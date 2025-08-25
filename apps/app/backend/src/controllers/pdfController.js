const puppeteer = require('puppeteer');
const { generateResumeHTML } = require('../templates/resumeTemplate');

// Generate PDF from real resume data
const generateResumePDF = async (req, res) => {
  let browser = null;

  try {
    const { formData, sidebarItems } = req.body;
    
    // Validate input
    if (!formData || !sidebarItems) {
      return res.status(400).json({
        success: false,
        message: 'Missing formData or sidebarItems'
      });
    }

    console.log('Starting resume PDF generation...');

    // Launch browser
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Generate HTML from resume data
    const resumeHTML = generateResumeHTML(formData, sidebarItems);

    // Set the HTML content
    await page.setContent(resumeHTML, { waitUntil: 'networkidle0' });

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

    console.log('Resume PDF generated successfully!');

    // Create filename
    const fileName = `${formData.firstName || 'resume'}_${formData.lastName || 'document'}_${Date.now()}.pdf`;

    // Set headers for download
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Length': pdfBuffer.length,
    });

    // Send the PDF
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Resume PDF generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate resume PDF',
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

    // Launch browser
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

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
          </style>
        </head>
        <body>
          <div class="header">
            <div class="name">TEST RESUME</div>
            <div>PDF Generation Test</div>
          </div>
          
          <div class="section">
            <div class="section-title">Test Section</div>
            <p>This is a test PDF generated with Puppeteer!</p>
            <p>Timestamp: ${new Date().toISOString()}</p>
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
  generateResumePDF
};