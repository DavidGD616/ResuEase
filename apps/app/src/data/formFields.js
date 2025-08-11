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
  
  // Sections data
  skills: [],
  education: [],
  employment: [],
  languages: [],
  internships: [],
  courses: [],
  references: [],
  links: [],
  hobbies: '',
  
  // Custom sections
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
    jobTitle: '',
    company: '',
    startDate: '',
    endDate: '',
    location: '',
    description: ''
  },
  internship: {
    jobTitle: '',
    company: '',
    startDate: '',
    endDate: '',
    location: '',
    description: ''
  },
  course: {
    courseName: '',
    institution: '',
    startDate: '',
    endDate: ''
  },
  reference: {
    referentName: '',
    referentCompany: '',
    referentEmail: '',
    referentPhone: ''
  },
  link: {
    linkTitle: '',
    url: ''
  },
  language: {
    language: '',
    proficiency: 'Not applicable'
  },
  customSection : {
    header: '',
    subheader: '',
    description: ''
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