import { HtmlGenerator } from '../utils/htmlGenerator';
import type { FormData, SidebarItem } from '../types/resume';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

type ServiceResult =
  | { success: true; data?: unknown }
  | { success: false; error: string };

export class PdfService {
  static async testConnection(): Promise<ServiceResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/test`);
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Backend connection failed:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: message };
    }
  }

  static async downloadTestPDF(): Promise<ServiceResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/generate-test-pdf`, {
        method: 'GET',
        headers: {
          Accept: 'application/pdf',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const pdfBlob = await response.blob();

      const downloadUrl = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `test-resume-${Date.now()}.pdf`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      return { success: true };

    } catch (error) {
      console.error('PDF download failed:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: message };
    }
  }

  static async downloadResumePDF(
    formData: FormData,
    sidebarItems: SidebarItem[],
    templateName: string = 'harvard'
  ): Promise<ServiceResult> {
    try {
      // Step 1: Generate HTML from React component
      const htmlContent = HtmlGenerator.generateHtml(templateName, formData, sidebarItems);

      // Step 2: Send HTML to backend for PDF conversion
      const response = await fetch(`${API_BASE_URL}/html-to-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/pdf',
        },
        body: JSON.stringify({
          html: htmlContent,
          options: {
            format: 'A4',
            margin: {
              top: '0.5in',
              right: '0.5in',
              bottom: '0.5in',
              left: '0.5in',
            },
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      // Step 3: Download the PDF
      const pdfBlob = await response.blob();

      const firstName = formData.firstName || 'resume';
      const lastName = formData.lastName || 'document';
      const filename = `${firstName}_${lastName}_resume.pdf`;

      const downloadUrl = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      return { success: true };

    } catch (error) {
      console.error('Resume PDF download failed:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: message };
    }
  }
}
