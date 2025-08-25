// Server-side version of your HarvardTemplate
// This converts your React component to a Node.js function that returns HTML string

// Process header data (same as your frontend)
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

// Process section data (same as your frontend but complete)
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

  languages: (formData) => ({
    title: "Languages",
    items: formData.languages || [],
    isEmpty: !formData.languages?.length,
    displayType: 'inline'
  }),

  courses: (formData) => ({
    title: "Professional Development",
    items: formData.courses || [],
    isEmpty: !formData.courses?.length
  }),

  skills: (formData) => ({
    title: "Skills",
    items: formData.skills?.filter(skill => skill?.skillName) || [],
    isEmpty: !formData.skills?.length,
    displayType: 'inline'
  }),

  technologiesSkills: (formData) => ({
    title: "Technologies", 
    items: formData.technologiesSkills?.filter(tech => tech?.technologiesSkillName) || [],
    isEmpty: !formData.technologiesSkills?.length,
    displayType: 'inline'
  }),

  hobbies: (formData) => ({
    title: "Interests",
    items: formData.hobbies?.filter(hobby => hobby?.hobbyName) || [],
    isEmpty: !formData.hobbies?.length,
    displayType: 'inline'
  }),

  links: (formData) => ({
    title: "Portfolio & Links",
    items: formData.links || [],
    isEmpty: !formData.links?.length
  }),

  references: (formData) => ({
    title: "References",
    items: formData.references || [],
    isEmpty: !formData.references?.length
  }),

  // Handle custom sections
  custom: (formData, sectionId) => {
    const sectionKey = `customEntries_${sectionId}`;
    const entries = formData[sectionKey] || [];
    
    return {
      title: "Custom Section",
      items: entries,
      isEmpty: !entries.length
    };
  }
};

// CSS styles (converted from your React styles)
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
  
  // Handle inline sections (skills, languages, hobbies, etc.)
  if (sectionData.displayType === 'inline') {
    return generateInlineSection(sectionData, sectionId);
  }
  
  // Handle list sections (employment, education, etc.)
  const itemsHTML = sectionData.items.map(item => {
    if (sectionId === 'employment' || sectionId === 'internships') {
      return generateEmploymentItem(item);
    }
    
    if (sectionId === 'education') {
      return generateEducationItem(item);
    }
    
    if (sectionId === 'projects') {
      return generateProjectItem(item);
    }
    
    if (sectionId === 'courses') {
      return generateCourseItem(item);
    }
    
    if (sectionId === 'links') {
      return generateLinkItem(item);
    }
    
    if (sectionId === 'references') {
      return generateReferenceItem(item);
    }
    
    // Handle custom sections
    if (sectionId.startsWith('custom-')) {
      return generateCustomItem(item);
    }
    
    return '<div class="item">Unknown item type</div>';
  }).join('');
  
  return `
    <div class="section">
      <div class="section-title">${sectionData.title}</div>
      ${itemsHTML}
    </div>
  `;
};

// Generate inline sections (skills, languages, hobbies, technologies)
const generateInlineSection = (sectionData, sectionId) => {
  let content = '';
  
  if (sectionId === 'skills') {
    content = `<strong>Skills:</strong> ${sectionData.items.map(skill => skill.skillName).join('; ')}`;
  } else if (sectionId === 'technologiesSkills') {
    content = `<strong>Technologies:</strong> ${sectionData.items.map(tech => tech.technologiesSkillName).join('; ')}`;
  } else if (sectionId === 'languages') {
    content = `<strong>Languages:</strong> ${sectionData.items.map(lang => {
      const languageText = lang.language && lang.proficiency && lang.proficiency !== 'Not applicable'
        ? `${lang.language} (${lang.proficiency})`
        : lang.language || '';
      return languageText;
    }).join('; ')}`;
  } else if (sectionId === 'hobbies') {
    content = `<strong>Interests:</strong> ${sectionData.items.map(hobby => hobby.hobbyName).join('; ')}`;
  }
  
  return `
    <div class="section">
      <div class="section-title">${sectionData.title}</div>
      <div class="inline-list">
        <div class="inline-section">${content}</div>
      </div>
    </div>
  `;
};

// Generate employment/internship items
const generateEmploymentItem = (item) => {
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
};

// Generate education items
const generateEducationItem = (item) => {
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
};

// Generate project items
const generateProjectItem = (item) => {
  const bulletPointsHTML = item.bulletPoints && item.bulletPoints.length > 0
    ? `<div class="bullet-points">
         ${item.bulletPoints.map(bullet => `<div class="bullet-point">• ${bullet}</div>`).join('')}
       </div>`
    : '';
    
  return `
    <div class="item">
      <div class="item-header">
        <div>
          ${item.url ? 
            `<a href="${item.url}" target="_blank" rel="noopener noreferrer" style="color: #000; text-decoration: underline; font-weight: bold;">${item.name || 'Project Name'}</a>` :
            `<span class="item-title">${item.name || 'Project Name'}</span>`
          }
        </div>
        <div class="item-date">${item.dateRange || ''}</div>
      </div>
      ${bulletPointsHTML}
    </div>
  `;
};

// Generate course items
const generateCourseItem = (item) => {
  return `
    <div class="item">
      <div class="item-title">${item.courseName || 'Course Name'}</div>
    </div>
  `;
};

// Generate link items
const generateLinkItem = (item) => {
  return `
    <div class="item">
      <div class="item-title">
        <strong>${item.linkTitle || 'Link'}</strong>
        ${item.url ? `<span class="item-date">: ${item.url}</span>` : ''}
      </div>
    </div>
  `;
};

// Generate reference items
const generateReferenceItem = (item) => {
  return `
    <div class="item">
      <div class="item-title">
        <strong>${item.referentName || 'Reference Name'}</strong>
        ${item.referentCompany ? `, ${item.referentCompany}` : ''}
      </div>
      <div class="item-date">
        ${item.referentPhone ? item.referentPhone : ''}
        ${item.referentPhone && item.referentEmail ? ' • ' : ''}
        ${item.referentEmail ? item.referentEmail : ''}
      </div>
    </div>
  `;
};

// Generate custom section items
const generateCustomItem = (item) => {
  const bulletPointsHTML = item.bulletPoints && item.bulletPoints.length > 0
    ? `<div class="bullet-points">
         ${item.bulletPoints.map(bullet => `<div class="bullet-point">• ${bullet}</div>`).join('')}
       </div>`
    : '';
    
  return `
    <div class="item">
      ${(item.header || item.subheader) ? `
        <div style="margin-bottom: 4pt;">
          ${item.header ? `<span class="item-title">${item.header}</span>` : ''}
          ${item.subheader ? `<span style="font-style: italic;">${item.header ? ' - ' : ''}${item.subheader}</span>` : ''}
        </div>
      ` : ''}
      ${item.description ? `<div class="item-description">${item.description}</div>` : ''}
      ${bulletPointsHTML}
    </div>
  `;
};

// Main function to generate complete HTML
const generateResumeHTML = (formData, sidebarItems) => {
  const headerData = processHeaderData(formData);
  const headerHTML = generateHeaderHTML(headerData);
  
  // Define which sections should be combined (like in your frontend)
  const combinedSkillsSections = ['courses', 'skills', 'technologiesSkills', 'languages', 'hobbies'];
  
  // Get ordered sections (excluding fixed, additional, and combined ones)
  const orderedSections = sidebarItems
    .filter(item => !item.fixed && item.id !== 'additional' && !combinedSkillsSections.includes(item.id))
    .sort((a, b) => a.order - b.order)
    .map(item => item.id);
  
  // Generate sections HTML
  const sectionsHTML = orderedSections.map(sectionId => {
    // Handle custom sections
    if (sectionId.startsWith('custom-')) {
      const sectionData = processSectionData.custom(formData, sectionId);
      return generateSectionHTML(sectionData, sectionId);
    }
    
    const processor = processSectionData[sectionId];
    if (!processor) return '';
    
    const sectionData = processor(formData);
    return generateSectionHTML(sectionData, sectionId);
  }).join('');
  
  // Generate combined skills section (like in your frontend)
  const availableCombinedSections = sidebarItems
    .filter(item => combinedSkillsSections.includes(item.id))
    .sort((a, b) => a.order - b.order)
    .map(item => item.id);
    
  const combinedSkillsHTML = generateCombinedSkillsSection(formData, availableCombinedSections);
  
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
        ${combinedSkillsHTML}
      </body>
    </html>
  `;
};

// Generate combined skills section (like in your frontend)
const generateCombinedSkillsSection = (formData, availableSections) => {
  const sectionMap = {
    courses: { title: 'CERTIFICATIONS', key: 'courses' },
    skills: { title: 'SKILLS', key: 'skills' },
    technologiesSkills: { title: 'TECHNOLOGIES', key: 'technologiesSkills' },
    languages: { title: 'LANGUAGES', key: 'languages' },
    hobbies: { title: 'INTERESTS', key: 'hobbies' }
  };

  // Get data for each section and check if it has content
  const sectionsWithData = [];
  const sectionData = {};

  availableSections.forEach(sectionId => {
    if (sectionMap[sectionId]) {
      const processor = processSectionData[sectionId];
      if (processor) {
        const data = processor(formData);
        if (!data.isEmpty) {
          sectionsWithData.push(sectionMap[sectionId].title);
          sectionData[sectionId] = data;
        }
      }
    }
  });

  // If no sections have data, return empty
  if (sectionsWithData.length === 0) return '';

  // Build the combined title
  let combinedTitle;
  if (sectionsWithData.length === 1) {
    combinedTitle = sectionsWithData[0];
  } else if (sectionsWithData.length === 2) {
    combinedTitle = sectionsWithData.join(' & ');
  } else {
    const lastSection = sectionsWithData.pop();
    combinedTitle = sectionsWithData.join(', ') + ' & ' + lastSection;
  }

  const contentHTML = Object.entries(sectionData).map(([sectionId, data], index) => {
    let content = '';
    
    if (sectionId === 'courses') {
      content = `<strong>Certifications:</strong> ${data.items.map(course => course.courseName).join('; ')}`;
    } else if (sectionId === 'skills') {
      content = `<strong>Skills:</strong> ${data.items.map(skill => skill.skillName).join('; ')}`;
    } else if (sectionId === 'technologiesSkills') {
      content = `<strong>Technologies:</strong> ${data.items.map(tech => tech.technologiesSkillName).join('; ')}`;
    } else if (sectionId === 'languages') {
      content = `<strong>Languages:</strong> ${data.items.map(language => {
        const languageText = language.language && language.proficiency && language.proficiency !== 'Not applicable'
          ? `${language.language} (${language.proficiency})`
          : language.language || '';
        return languageText;
      }).join('; ')}`;
    } else if (sectionId === 'hobbies') {
      content = `<strong>Interests:</strong> ${data.items.map(hobby => hobby.hobbyName).join('; ')}`;
    }
    
    const marginBottom = index < Object.keys(sectionData).length - 1 ? 'margin-bottom: 8pt;' : '';
    return `<div style="${marginBottom}">${content}</div>`;
  }).join('');

  return `
    <div class="section">
      <div class="section-title">${combinedTitle}</div>
      <div class="inline-list">
        ${contentHTML}
      </div>
    </div>
  `;
};

module.exports = {
  generateResumeHTML,
  processHeaderData,
  processSectionData
};