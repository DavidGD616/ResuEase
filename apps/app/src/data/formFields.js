export const INITIAL_FORM_DATA = {
  // Personal Details
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
  
  // Professional
  about: '',
  
  // Dynamic sections data
  skills: [],
  education: [],
  employment: [],
  languages: [],
  internships: [],
  courses: [],
  references: [],
  links: [],
  hobbies: '',
  
  // Custom sections (dynamic)
  customSections: {}
};

// Section templates
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
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    location: '',
    description: ''
  },
  internship: {
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    location: '',
    description: ''
  },
  course: {
    name: '',
    institution: '',
    completionDate: '',
    description: ''
  },
  reference: {
    name: '',
    position: '',
    company: '',
    phone: '',
    email: '',
    relationship: ''
  },
  link: {
    label: '',
    url: '',
    description: ''
  },
  language: {
    name: '',
    level: 'Beginner'
  }
};

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