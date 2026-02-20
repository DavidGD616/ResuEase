import puppeteer, { Browser, PDFOptions } from "puppeteer-core";
import { Request, Response } from "express";

// Narrow the accepted PDF options to a safe subset.
// Never accept the full PDFOptions from the client — Puppeteer's `path` option,
// for example, would write the PDF to an arbitrary filesystem path on the server.
interface SafePdfOptions {
  format?: PDFOptions["format"];
  margin?: PDFOptions["margin"];
  printBackground?: PDFOptions["printBackground"];
}

interface HtmlToPdfBody {
  html: string;
  options?: SafePdfOptions;
}

// Tags that can enable SSRF, XSS, or remote code execution inside Puppeteer.
// <script>  — arbitrary JS execution
// <iframe>  — loads external documents from the server's network context (SSRF)
// <object>  — plugin / external content embedding
// <embed>   — same as object
// <link rel="import"> — HTML imports (deprecated but still parsed by some engines)
const DANGEROUS_TAG_RE = /<(script|iframe|object|embed)\b/i;
const IMPORT_LINK_RE = /<link[^>]*rel=["']?\s*import/i;

function containsDangerousTags(html: string): boolean {
  return DANGEROUS_TAG_RE.test(html) || IMPORT_LINK_RE.test(html);
}

// Connect to browser based on environment
const connectToBrowser = async (): Promise<Browser> => {
  try {
    // Check if Browserless endpoint is configured (production)
    if (process.env.BROWSER_WS_ENDPOINT) {
      console.log("Connecting to Browserless...");
      const browser = await puppeteer.connect({
        browserWSEndpoint: process.env.BROWSER_WS_ENDPOINT,
      });
      console.log("Connected to Browserless successfully!");
      return browser;
    }

    // Local development - launch Chrome locally
    console.log("Launching local Chrome...");
    const browserConfig = {
      headless: true as const,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
      ],
      executablePath:
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", 
    };

    const browser = await puppeteer.launch(browserConfig);
    console.log("Local Chrome launched successfully!");
    return browser;
  } catch (error) {
    console.error("Failed to connect to browser:", error);
    throw error;
  }
};

// Simple HTML to PDF conversion service
export const convertHtmlToPdf = async (req: Request<{}, {}, HtmlToPdfBody>, res: Response) => {
  let browser: Browser | null = null;

  try {
    const { html, options = {} } = req.body;

    // Validate input
    if (!html) {
      return res.status(400).json({
        success: false,
        message: "HTML content is required",
      });
    }

    // Reject HTML that contains tags capable of SSRF, XSS, or remote execution.
    // JS is also disabled in the page below, but blocking at this layer gives a
    // clear 400 to the caller and avoids launching a browser at all.
    if (containsDangerousTags(html)) {
      return res.status(400).json({
        success: false,
        message: "HTML contains disallowed elements",
      });
    }

    console.log("Converting HTML to PDF...");
    console.log("HTML length:", html.length, "characters");
    console.log("Using Browserless:", !!process.env.BROWSER_WS_ENDPOINT);

    // Connect to browser (Browserless or local)
    browser = await connectToBrowser();

    const page = await browser.newPage();

    // Disable JavaScript execution in the page as a second line of defence.
    // This prevents any JS that slips through tag detection from running.
    await page.setJavaScriptEnabled(false);

    // Cap rendering time to prevent a hanging request from tying up the server.
    await page.setContent(html, { waitUntil: "networkidle0", timeout: 30_000 });

    // Default PDF options
    const defaultOptions: PDFOptions = {
      format: "A4",
      margin: {
        top: "0.75in",
        right: "0.75in",
        bottom: "0.75in",
        left: "0.75in",
      },
      printBackground: true,
    };

    // Build PDF options from the safe subset only — never spread raw client
    // options, which could include Puppeteer's `path` key and write the PDF
    // to an arbitrary location on the server's filesystem.
    const pdfOptions: PDFOptions = { ...defaultOptions };
    if (options.format !== undefined) pdfOptions.format = options.format;
    if (options.margin !== undefined) pdfOptions.margin = options.margin;
    if (options.printBackground !== undefined) pdfOptions.printBackground = options.printBackground;

    // Generate PDF
    const pdfBuffer = await page.pdf(pdfOptions);

    console.log("PDF generated successfully from HTML!");

    // Set headers for download
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="resume.pdf"',
      "Content-Length": pdfBuffer.length.toString(),
    });

    // Send the PDF
    res.send(pdfBuffer);
  } catch (error) {
    console.error("HTML to PDF conversion error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      success: false,
      message: "Failed to convert HTML to PDF",
      error: message,
    });
  } finally {
    // Always close the browser
    if (browser) {
      await browser.close();
      console.log("Browser closed.");
    }
  }
};

// Test PDF generation with simple HTML
export const generateTestPDF = async (req: Request, res: Response) => {
  let browser: Browser | null = null;

  try {
    console.log("Starting PDF generation...");
    console.log("Environment:", process.env.NODE_ENV);
    console.log(
      "Browserless endpoint:",
      process.env.BROWSER_WS_ENDPOINT ? "Connected" : "Not configured"
    );

    // Connect to browser (Browserless or local)
    browser = await connectToBrowser();

    const page = await browser.newPage();

    // Simple test HTML
    const testHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Test PDF</title>
          <style>
            body {
              font-family: 'Times New Roman', serif;
              font-size: 12pt;
              line-height: 1.4;
              margin: 0;
              padding: 40px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            .name {
              font-size: 24pt;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .section {
              margin-bottom: 20px;
            }
            .section-title {
              font-size: 14pt;
              font-weight: bold;
              margin-bottom: 10px;
              text-transform: uppercase;
            }
            .success {
              color: green;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="name">TEST RESUME</div>
            <div>PDF Generation Test - <span class="success">SUCCESS!</span></div>
          </div>

          <div class="section">
            <div class="section-title">Test Section</div>
            <p>This PDF was generated successfully with Puppeteer!</p>
            <p>Timestamp: ${new Date().toISOString()}</p>
            <p>Environment: ${process.env.NODE_ENV}</p>
            <p>Browser: ${process.env.BROWSER_WS_ENDPOINT ? "Browserless" : "Local Puppeteer"}</p>
          </div>

          <div class="section">
            <div class="section-title">Server Info</div>
            <p>Node.js Version: ${process.version}</p>
            <p>Server Port: ${process.env.PORT || 3001}</p>
          </div>
        </body>
      </html>
    `;

    // Set the HTML content
    await page.setContent(testHTML, { waitUntil: "networkidle0" });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: {
        top: "0.75in",
        right: "0.75in",
        bottom: "0.75in",
        left: "0.75in",
      },
      printBackground: true,
    });

    console.log("PDF generated successfully!");

    // Set headers for download
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="test-resume.pdf"',
      "Content-Length": pdfBuffer.length.toString(),
    });

    // Send the PDF
    res.send(pdfBuffer);
  } catch (error) {
    console.error("PDF generation error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      success: false,
      message: "Failed to generate PDF",
      error: message,
    });
  } finally {
    // Always close the browser
    if (browser) {
      await browser.close();
      console.log("Browser closed.");
    }
  }
};
