import { HtmlGenerator } from "../utils/htmlGenerator";

const API_BASE_URL = 'http://localhost:3001/api';

export class PdfService {
  // Test the backend connection
  static async testConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/test`);
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Backend connection failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Generate and download test PDF
  static async downloadTestPDF() {
    try {
      console.log('Requesting PDF from backend...');
      
      const response = await fetch(`${API_BASE_URL}/generate-test-pdf`, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the PDF as a blob
      const pdfBlob = await response.blob();
      
      // Create download link
      const downloadUrl = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `test-resume-${Date.now()}.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      console.log('PDF downloaded successfully!');
      return { success: true };
      
    } catch (error) {
      console.error('PDF download failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Generate and download resume PDF using HTML generation
  static async downloadResumePDF(formData, sidebarItems, templateName = 'harvard') {
    try {
      console.log('Generating HTML from React template...');
      
      // Step 1: Generate HTML from React component
      const htmlContent = HtmlGenerator.generateHtml(templateName, formData, sidebarItems);
      
      console.log('HTML generated, requesting PDF from backend...');
      
      // Step 2: Send HTML to backend for PDF conversion
      const response = await fetch(`${API_BASE_URL}/html-to-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/pdf',
        },
        body: JSON.stringify({
          html: htmlContent,
          options: {
            format: 'A4',
            margin: {
              top: '0.75in',
              right: '0.75in',
              bottom: '0.75in',
              left: '0.75in'
            }
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      // Step 3: Download the PDF
      const pdfBlob = await response.blob();
      
      // Create filename based on user's name
      const firstName = formData.firstName || 'resume';
      const lastName = formData.lastName || 'document';
      const filename = `${firstName}_${lastName}_resume.pdf`;
      
      // Create download link
      const downloadUrl = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      console.log('Resume PDF downloaded successfully!');
      return { success: true };
      
    } catch (error) {
      console.error('Resume PDF download failed:', error);
      return { success: false, error: error.message };
    }
  }
}