const puppeteer = require('puppeteer-core');

// Get Puppeteer configuration for different environments
const getPuppeteerConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction && process.env.BROWSER_WS_ENDPOINT) {
    // Use Browserless in production
    return {
      browserWSEndpoint: process.env.BROWSER_WS_ENDPOINT
    };
  }
  
  // Development configuration (local puppeteer)
  return {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  };
};

// Connect to browser based on environment
const connectToBrowser = async () => {
  try {
    const browserConfig = {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    };

    // Only set executablePath for local development
    if (!process.env.RAILWAY_ENVIRONMENT && process.env.NODE_ENV !== 'production') {
      browserConfig.executablePath = '/Applications/Google Chrome Dev.app/Contents/MacOS/Google Chrome Dev';
    }

    const browser = await puppeteer.launch(browserConfig);
    return browser;
  } catch (error) {
    console.error('Failed to launch browser:', error);
    throw error;
  }
};

// Simple HTML to PDF conversion service
const convertHtmlToPdf = async (req, res) => {
  let browser = null;

  try {
    const { html, options = {} } = req.body;
    
    // Validate input
    if (!html) {
      return res.status(400).json({
        success: false,
        message: 'HTML content is required'
      });
    }

    console.log('Converting HTML to PDF...');
    console.log('HTML length:', html.length, 'characters');
    console.log('Using Browserless:', !!process.env.BROWSER_WS_ENDPOINT);

    // Connect to browser (Browserless or local)
    browser = await connectToBrowser();

    const page = await browser.newPage();

    // Set the HTML content directly
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Default PDF options (can be overridden by request)
    const defaultOptions = {
      format: 'A4',
      margin: {
        top: '0.75in',
        right: '0.75in',
        bottom: '0.75in',
        left: '0.75in'
      },
      printBackground: true
    };

    // Merge with provided options
    const pdfOptions = { ...defaultOptions, ...options };

    // Generate PDF
    const pdfBuffer = await page.pdf(pdfOptions);

    console.log('PDF generated successfully from HTML!');

    // Set headers for download
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="resume.pdf"',
      'Content-Length': pdfBuffer.length,
    });

    // Send the PDF
    res.send(pdfBuffer);

  } catch (error) {
    console.error('HTML to PDF conversion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to convert HTML to PDF',
      error: error.message
    });
  } finally {
    // Always close the browser
    if (browser) {
      await browser.close();
      console.log('Browser closed.');
    }
  }
};

// Test PDF generation with simple HTML
const generateTestPDF = async (req, res) => {
  let browser = null;

  try {
    console.log('Starting PDF generation...');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Browserless endpoint:', process.env.BROWSER_WS_ENDPOINT ? 'Connected' : 'Not configured');

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
            <p>Browser: ${process.env.BROWSER_WS_ENDPOINT ? 'Browserless' : 'Local Puppeteer'}</p>
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
    await page.setContent(testHTML, { waitUntil: 'networkidle0' });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '0.75in',
        right: '0.75in',
        bottom: '0.75in',
        left: '0.75in'
      },
      printBackground: true
    });

    console.log('PDF generated successfully!');

    // Set headers for download
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="test-resume.pdf"',
      'Content-Length': pdfBuffer.length,
    });

    // Send the PDF
    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate PDF',
      error: error.message
    });
  } finally {
    // Always close the browser
    if (browser) {
      await browser.close();
      console.log('Browser closed.');
    }
  }
};

module.exports = {
  generateTestPDF,
  convertHtmlToPdf
};