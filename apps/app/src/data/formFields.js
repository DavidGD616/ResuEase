// =============================================================================
// CONSTANTS
// =============================================================================

export const PROFICIENCY_LEVELS = [
  'Not applicable',
  'Beginner',
  'Intermediate',
  'Advanced',
  'Native'
];

export const SUGGESTED_SKILLS = [
  'Project Management',
  'Data Analysis',
  'Problem Solving',
  'Team Leadership',
  'Customer Service',
  'Digital Marketing',
  'Time Management',
  'Communication',
  'Strategic Planning',
  'Software Development'
];

// =============================================================================
// SECTION TEMPLATES
// =============================================================================

export const SECTION_TEMPLATES = {
  education: {
    institution: '',
    degree: '',
    startDate: '',
    endDate: '',
    location: '',
    description: ''
  },
  
  employment: {
    jobTitle: '',
    company: '',
    startDate: '',
    endDate: '',
    location: '',
    description: ''
  },
  
  internships: {
    jobTitle: '',
    company: '',
    startDate: '',
    endDate: '',
    location: '',
    description: ''
  },
  
  courses: {
    courseName: '',
    institution: '',
    startDate: '',
    endDate: ''
  },
  
  references: {
    referentName: '',
    referentCompany: '',
    referentEmail: '',
    referentPhone: ''
  },
  
  links: {
    linkTitle: '',
    url: ''
  },
  
  languages: {
    language: '',
    proficiency: 'Not applicable'
  },
  
  customSection: {
    header: '',
    subheader: '',
    description: ''
  }
};

// =============================================================================
// INITIAL FORM DATA
// =============================================================================

export const INITIAL_FORM_DATA = {
  // Personal Information
  firstName: '',
  lastName: '',
  jobTitle: '',
  nationality: '',
  driversLicense: '',
  birthDate: '',
  
  // Contact Information
  email: '',
  phone: '',
  country: '',
  city: '',
  address: '',
  postalCode: '',
  
  // Professional Summary
  about: '',
  hobbies: '',
  
  // Dynamic Sections (arrays of objects based on templates)
  skills: [],
  education: [],
  employment: [],
  languages: [],
  internships: [],
  courses: [],
  references: [],
  links: [],
  
  // Custom Sections
  customSections: {}
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Creates a new section item based on the template
 * @param {string} sectionType - The type of section (must match SECTION_TEMPLATES key)
 * @returns {Object} New section item with unique ID
 */
export const createSectionItem = (sectionType) => {
  const template = SECTION_TEMPLATES[sectionType];
  
  if (!template) {
    throw new Error(`Invalid section type: ${sectionType}. Available types: ${Object.keys(SECTION_TEMPLATES).join(', ')}`);
  }
  
  return {
    ...template,
    id: generateUniqueId()
  };
};

/**
 * Generates a unique ID for section items
 * @returns {string} Unique identifier
 */
const generateUniqueId = () => {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Gets the template structure for a section type
 * @param {string} sectionType - The section type
 * @returns {Object} Template object
 */
export const getSectionTemplate = (sectionType) => {
  return SECTION_TEMPLATES[sectionType] || null;
};

/**
 * Validates if a section type exists
 * @param {string} sectionType - The section type to validate
 * @returns {boolean} True if section type exists
 */
export const isValidSectionType = (sectionType) => {
  return Object.prototype.hasOwnProperty.call(SECTION_TEMPLATES, sectionType);
};

/**
 * Gets all available section types
 * @returns {string[]} Array of section type names
 */
export const getAvailableSectionTypes = () => {
  return Object.keys(SECTION_TEMPLATES);
};