import type { LucideIcon } from 'lucide-react';

// ---------------------------------------------------------------------------
// Section item types
// ---------------------------------------------------------------------------

export interface EducationItem {
  id?: string;
  institution: string;
  degree: string;
  dateRange: string;
  location: string;
  bulletPoints: string[];
}

export interface EmploymentItem {
  id?: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  bulletPoints: string[];
  isCurrentJob: boolean;
}

export interface InternshipItem {
  id?: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  bulletPoints: string[];
}

export interface ProjectItem {
  id?: string;
  name: string;
  url: string;
  dateRange: string;
  bulletPoints: string[];
}

export interface CourseItem {
  id?: string;
  courseName: string;
}

export interface ReferenceItem {
  id?: string;
  referentName: string;
  referentCompany: string;
  referentEmail: string;
  referentPhone: string;
}

export interface LinkItem {
  id?: string;
  linkTitle: string;
  url: string;
}

export interface LanguageItem {
  id?: string;
  language: string;
  proficiency: string;
}

export interface HobbyItem {
  id?: string;
  hobbyName: string;
}

export interface SkillItem {
  id?: string;
  skillName: string;
}

export interface TechSkillItem {
  id?: string;
  technologiesSkillName: string;
}

export interface CustomEntryItem {
  id?: string;
  header: string;
  subheader: string;
  description: string;
  bulletPoints: string[];
}

// ---------------------------------------------------------------------------
// Main form data shape
// ---------------------------------------------------------------------------

export interface FormData {
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  portfolio: string;
  about: string;
  projects: ProjectItem[];
  skills: SkillItem[];
  technologiesSkills: TechSkillItem[];
  education: EducationItem[];
  employment: EmploymentItem[];
  languages: LanguageItem[];
  internships: InternshipItem[];
  courses: CourseItem[];
  references: ReferenceItem[];
  links: LinkItem[];
  hobbies: HobbyItem[];
  [key: string]: unknown; // custom-{id} sections
}

// ---------------------------------------------------------------------------
// Sidebar item shape
// ---------------------------------------------------------------------------

export interface SidebarItem {
  id: string;
  icon: LucideIcon;
  label: string;
  order: number;
  fixed: boolean;
}
