import { renderToString } from 'react-dom/server';
import HarvardTemplate from '../components/resume/HarvardTemplate';

/**
 * Generate HTML string from React template component
 * This converts your existing React templates to HTML for PDF generation
 */
export class HtmlGenerator {
  
  /**
   * Generate complete HTML document with styles from React template
   * @param {string} templateName - Name of the template ('harvard', 'modern', etc.)
   * @param {Object} formData - Resume form data
   * @param {Array} sidebarItems - Sidebar configuration
   * @returns {string} Complete HTML document with inline styles
   */
  static generateHtml(templateName, formData, sidebarItems) {
    try {
      
      // For now we only have Harvard template, but this structure makes it easy to add more
      let TemplateComponent;
      
      switch (templateName.toLowerCase()) {
        case 'harvard':
        default:
          TemplateComponent = HarvardTemplate;
          break;
        // Future templates can be added here:
        // case 'modern':
        //   TemplateComponent = ModernTemplate;
        //   break;
      }
      
      // Render React component to HTML string
      const templateHtml = renderToString(
        TemplateComponent({ formData, sidebarItems })
      );
      
      // Get the styles that should be applied
      const styles = this.getTemplateStyles(templateName);
      
      // Wrap in complete HTML document
      const fullHtml = this.wrapInHtmlDocument(templateHtml, styles, formData);
      
      return fullHtml;
      
    } catch (error) {
      console.error('Error generating HTML:', error);
      throw new Error(`Failed to generate HTML: ${error.message}`);
    }
  }
  
  /**
   * Get CSS styles for the template
   * Since you're using inline styles, we only need base styles
   */
  static getTemplateStyles(templateName) {
    // Minimal base styles - your inline styles handle the rest
    const baseStyles = `
      body {
        font-family: 'Times', 'Times New Roman', serif;
        font-size: 11pt;
        line-height: 1.2;
        color: #000;
        margin: 0;
        padding: 0;
      }
      
      /* Links */
      a {
        color: #333;
        text-decoration: underline;
      }
      
      /* Print styles */
      @media print {
        body {
          margin: 0;
          padding: 0;
        }
      }
    `;
    
    switch (templateName.toLowerCase()) {
      case 'harvard':
      default:
        return baseStyles;
      // Future templates:
      // case 'modern':
      //   return modernStyles;
    }
  }
  
  /**
   * Wrap the template HTML in a complete HTML document
   */
  static wrapInHtmlDocument(templateHtml, styles, formData) {
    const title = formData.firstName && formData.lastName 
      ? `Resume - ${formData.firstName} ${formData.lastName}`
      : 'Resume';
      
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title}</title>
          <style>
            ${styles}
          </style>
        </head>
        <body>
          ${templateHtml}
        </body>
      </html>
    `;
  }
  
  /**
   * Helper method to validate template exists
   */
  static isValidTemplate(templateName) {
    const validTemplates = ['harvard']; // Add more as you create them
    return validTemplates.includes(templateName.toLowerCase());
  }
  
  /**
   * Get list of available templates
   */
  static getAvailableTemplates() {
    return [
      { id: 'harvard', name: 'Harvard Template', description: 'Classic academic style' }
      // Add more templates here as you create them
    ];
  }
}