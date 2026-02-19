import type {
  EducationItem,
  EmploymentItem,
  InternshipItem,
  ProjectItem,
  CourseItem,
  ReferenceItem,
  LinkItem,
  LanguageItem,
  HobbyItem,
  SkillItem,
  TechSkillItem,
  CustomEntryItem,
  FormData,
} from '../types/resume';

// =============================================================================
// CONSTANTS
// =============================================================================

export const PROFICIENCY_LEVELS = [
  'Not applicable',
  'Beginner',
  'Intermediate',
  'Advanced',
  'Native',
] as const;

export type ProficiencyLevel = (typeof PROFICIENCY_LEVELS)[number];

// =============================================================================
// SECTION TEMPLATES
// =============================================================================

export const SECTION_TEMPLATES = {
  education: {
    institution: '',
    degree: '',
    dateRange: '',
    location: '',
    bulletPoints: [],
  } satisfies Omit<EducationItem, 'id'>,

  projects: {
    name: '',
    url: '',
    dateRange: '',
    bulletPoints: [],
  } satisfies Omit<ProjectItem, 'id'>,

  employment: {
    jobTitle: '',
    company: '',
    startDate: '',
    endDate: '',
    location: '',
    description: '',
    bulletPoints: [],
    isCurrentJob: false,
  } satisfies Omit<EmploymentItem, 'id'>,

  internships: {
    jobTitle: '',
    company: '',
    startDate: '',
    endDate: '',
    location: '',
    description: '',
    bulletPoints: [],
  } satisfies Omit<InternshipItem, 'id'>,

  courses: {
    courseName: '',
  } satisfies Omit<CourseItem, 'id'>,

  references: {
    referentName: '',
    referentCompany: '',
    referentEmail: '',
    referentPhone: '',
  } satisfies Omit<ReferenceItem, 'id'>,

  links: {
    linkTitle: '',
    url: '',
  } satisfies Omit<LinkItem, 'id'>,

  languages: {
    language: '',
    proficiency: 'Not applicable',
  } satisfies Omit<LanguageItem, 'id'>,

  hobbies: {
    hobbyName: '',
  } satisfies Omit<HobbyItem, 'id'>,

  skills: {
    skillName: '',
  } satisfies Omit<SkillItem, 'id'>,

  technologiesSkills: {
    technologiesSkillName: '',
  } satisfies Omit<TechSkillItem, 'id'>,

  // Template for custom section entries
  customEntry: {
    header: '',
    subheader: '',
    description: '',
    bulletPoints: [],
  } satisfies Omit<CustomEntryItem, 'id'>,
};

export type SectionTemplateKey = keyof typeof SECTION_TEMPLATES;

// =============================================================================
// INITIAL FORM DATA
// =============================================================================

export const INITIAL_FORM_DATA: FormData = {
  // Personal Information
  firstName: '',
  lastName: '',
  jobTitle: '',

  // Contact Information
  email: '',
  phone: '',
  location: '',
  portfolio: '',

  // Professional Summary
  about: '',

  // Dynamic Sections (arrays of objects based on templates)
  projects: [],
  skills: [],
  technologiesSkills: [],
  education: [],
  employment: [],
  languages: [],
  internships: [],
  courses: [],
  references: [],
  links: [],
  hobbies: [],

  // Custom Sections - will be added dynamically
  // Format: customEntries_custom-1: [], customEntries_custom-2: [], etc.
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

const generateUniqueId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

export const createSectionItem = (sectionType: string) => {
  // Handle custom section entries
  if (sectionType.startsWith('customEntries_')) {
    return { ...SECTION_TEMPLATES.customEntry, id: generateUniqueId() };
  }

  const template = SECTION_TEMPLATES[sectionType as SectionTemplateKey];

  if (!template) {
    throw new Error(
      `Invalid section type: ${sectionType}. Available types: ${Object.keys(SECTION_TEMPLATES).join(', ')}`
    );
  }

  return { ...template, id: generateUniqueId() };
};

export const getSectionTemplate = (sectionType: string) => {
  if (sectionType.startsWith('customEntries_')) {
    return SECTION_TEMPLATES.customEntry;
  }
  return SECTION_TEMPLATES[sectionType as SectionTemplateKey] ?? null;
};

export const isValidSectionType = (sectionType: string): boolean => {
  if (sectionType.startsWith('customEntries_')) {
    return true;
  }
  return Object.prototype.hasOwnProperty.call(SECTION_TEMPLATES, sectionType);
};

export const getAvailableSectionTypes = (): string[] => {
  return Object.keys(SECTION_TEMPLATES);
};
