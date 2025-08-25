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
   * @param {Object} formData 
   * @param {Array} sidebarItems 
   * @returns {string} 
   */
  static generateHtml(templateName, formData, sidebarItems) {
    try {
      console.log(`Generating HTML for template: ${templateName}`);
      
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
      
      console.log('HTML generated successfully');
      return fullHtml;
      
    } catch (error) {
      console.error('Error generating HTML:', error);
      throw new Error(`Failed to generate HTML: ${error.message}`);
    }
  }
  
  /**
   * Get CSS styles for the template
   * This extracts the styles your templates use
   */
  static getTemplateStyles(templateName) {
    // Harvard template styles (same as your current template)
    const harvardStyles = `
      body {
        font-family: 'Times', 'Times New Roman', serif;
        font-size: 11pt;
        line-height: 1.2;
        color: #000;
        margin: 0;
        padding: 0;
      }
      
      .header {
        text-align: center;
        margin-bottom: 24pt;
        padding-bottom: 16pt;
        border-bottom: 1px solid #000;
      }
      
      .name {
        font-size: 16pt;
        font-weight: bold;
        margin-bottom: 8pt;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      
      .job-title {
        font-size: 11pt;
        margin-bottom: 4pt;
      }
      
      .contact {
        font-size: 10pt;
        color: #333;
      }
      
      .section {
        margin-bottom: 24pt;
      }
      
      .section-title {
        font-size: 12pt;
        font-weight: bold;
        margin-bottom: 8pt;
        text-transform: uppercase;
        border-bottom: 1px solid #000;
        padding-bottom: 2pt;
      }
      
      .item-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 4pt;
      }
      
      .item-title {
        font-size: 11pt;
        font-weight: bold;
      }
      
      .item-date {
        font-size: 10pt;
        color: #333;
      }
      
      .item-description {
        font-size: 11pt;
        line-height: 1.3;
        margin-left: 12pt;
        text-align: justify;
        margin-bottom: 4pt;
      }
      
      .bullet-points {
        font-size: 11pt;
        line-height: 1.3;
        margin-left: 12pt;
        margin-top: 4pt;
      }
      
      .bullet-point {
        margin-bottom: 2pt;
      }
      
      .item {
        margin-bottom: 12pt;
      }
      
      .inline-list {
        font-size: 11pt;
        line-height: 1.3;
      }
      
      .inline-section {
        margin-bottom: 8pt;
      }
      
      .inline-section:last-child {
        margin-bottom: 0;
      }
      
      /* Ensure links are styled properly for PDF */
      a {
        color: #333;
        text-decoration: underline;
      }
      
      /* Print-specific styles */
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
        return harvardStyles;
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