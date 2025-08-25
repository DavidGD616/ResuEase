// Server-side version of HarvardTemplate
const processHeaderData = (formData) => ({
  fullName: (formData.firstName + " " + formData.lastName).trim() || "",
  jobTitle: formData.jobTitle || "",
  contact: {
    location: formData.location,
    phone: formData.phone,
    email: formData.email,
    portfolio: formData.portfolio
  }
});

// Process section data
const processSectionData = {
  summary: (formData) => ({
    title: "Professional Summary",
    content: formData.about,
    isEmpty: !formData.about
  }),

  employment: (formData) => ({
    title: "Professional Experience",
    items: formData.employment || [],
    isEmpty: !formData.employment?.length
  }),

  internships: (formData) => ({
    title: "Internship Experience", 
    items: formData.internships || [],
    isEmpty: !formData.internships?.length
  }),

  education: (formData) => ({
    title: "Education",
    items: formData.education || [],
    isEmpty: !formData.education?.length
  }),

  projects: (formData) => ({
    title: "Projects",
    items: formData.projects || [],
    isEmpty: !formData.projects?.length
  }),

  // Add more sections as needed...
};

// CSS styles (converted from React styles)
const getResumeStyles = () => `
  <style>
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
  </style>
`;

// Generate header HTML
const generateHeaderHTML = (headerData) => {
  const { fullName, jobTitle, contact } = headerData;
  
  let contactParts = [];
  if (contact.location) contactParts.push(contact.location);
  if (contact.phone) contactParts.push(contact.phone);
  if (contact.email) contactParts.push(contact.email);
  if (contact.portfolio) {
    const portfolioUrl = contact.portfolio.startsWith('http') 
      ? contact.portfolio 
      : `https://${contact.portfolio}`;
    contactParts.push(`<a href="${portfolioUrl}" style="color: #333; text-decoration: underline;">${contact.portfolio}</a>`);
  }
  
  return `
    <div class="header">
      <div class="name">${fullName.toUpperCase()}</div>
      ${jobTitle ? `<div class="job-title">${jobTitle}</div>` : ''}
      <div class="contact">
        ${contactParts.join(' • ')}
      </div>
    </div>
  `;
};

// Generate section HTML
const generateSectionHTML = (sectionData, sectionId) => {
  if (sectionData.isEmpty) return '';
  
  if (sectionId === 'summary') {
    return `
      <div class="section">
        <div class="section-title">${sectionData.title}</div>
        <div class="item-description">${sectionData.content}</div>
      </div>
    `;
  }
  
  // Handle list sections (employment, education, etc.)
  const itemsHTML = sectionData.items.map(item => {
    if (sectionId === 'employment' || sectionId === 'internships') {
      const bulletPointsHTML = item.bulletPoints && item.bulletPoints.length > 0
        ? `<div class="bullet-points">
             ${item.bulletPoints.map(bullet => `<div class="bullet-point">• ${bullet}</div>`).join('')}
           </div>`
        : '';
        
      return `
        <div class="item">
          <div class="item-header">
            <div>
              <span class="item-title">${item.jobTitle || 'Position Title'}</span>
              ${item.company ? ` at <em>${item.company}</em>` : ''}
              ${item.location ? `<span class="item-date">, ${item.location}</span>` : ''}
            </div>
            <div class="item-date">
              ${item.startDate && item.endDate ? `${item.startDate} - ${item.endDate}` : ''}
            </div>
          </div>
          ${item.description ? `<div class="item-description">${item.description}</div>` : ''}
          ${bulletPointsHTML}
        </div>
      `;
    }
    
    if (sectionId === 'education') {
      const bulletPointsHTML = item.bulletPoints && item.bulletPoints.length > 0
        ? `<div class="bullet-points">
             ${item.bulletPoints.map(bullet => `<div class="bullet-point">• ${bullet}</div>`).join('')}
           </div>`
        : '';
        
      return `
        <div class="item">
          <div class="item-header">
            <div>
              <span class="item-title">${item.degree || 'Degree'}</span>
              ${item.institution ? `, ${item.institution}` : ''}
              ${item.location ? `<span class="item-date">, ${item.location}</span>` : ''}
            </div>
            <div class="item-date">${item.dateRange || 'Date'}</div>
          </div>
          ${bulletPointsHTML}
        </div>
      `;
    }
    
    return '<div class="item">Item not supported yet</div>';
  }).join('');
  
  return `
    <div class="section">
      <div class="section-title">${sectionData.title}</div>
      ${itemsHTML}
    </div>
  `;
};

// Main function to generate complete HTML
const generateResumeHTML = (formData, sidebarItems) => {
  const headerData = processHeaderData(formData);
  const headerHTML = generateHeaderHTML(headerData);
  
  // Get ordered sections (excluding fixed and additional)
  const orderedSections = sidebarItems
    .filter(item => !item.fixed && item.id !== 'additional')
    .sort((a, b) => a.order - b.order)
    .map(item => item.id);
  
  // Generate sections HTML
  const sectionsHTML = orderedSections.map(sectionId => {
    const processor = processSectionData[sectionId];
    if (!processor) return '';
    
    const sectionData = processor(formData);
    return generateSectionHTML(sectionData, sectionId);
  }).join('');
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Resume - ${headerData.fullName}</title>
        ${getResumeStyles()}
      </head>
      <body>
        ${headerHTML}
        ${sectionsHTML}
      </body>
    </html>
  `;
};

module.exports = {
  generateResumeHTML,
  processHeaderData,
  processSectionData
};