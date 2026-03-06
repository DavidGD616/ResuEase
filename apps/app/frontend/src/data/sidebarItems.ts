import {
  User,
  Phone,
  FileDown,
  Briefcase,
  GraduationCap,
  Award,
  MessageSquare,
  Globe,
  Link,
  Gamepad2,
  Code,
  FolderKanban,
  Cpu,
} from 'lucide-react';
import type { SidebarItem } from '../types/resume';

// Core sections that appear by default in the sidebar
export const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'personal', icon: User, label: 'Personal details', labelKey: 'sidebar.personalDetails', order: 0, fixed: true },
  { id: 'contact', icon: Phone, label: 'Contact information', labelKey: 'sidebar.contactInformation', order: 1, fixed: true },
  { id: 'employment', icon: Briefcase, label: 'Employment history', labelKey: 'sidebar.employmentHistory', order: 2, fixed: false },
  { id: 'education', icon: GraduationCap, label: 'Education', labelKey: 'sidebar.education', order: 3, fixed: false },
  { id: 'projects', icon: FolderKanban, label: 'Projects', labelKey: 'sidebar.projects', order: 4, fixed: false },
  { id: 'courses', icon: GraduationCap, label: 'Courses', labelKey: 'sidebar.courses', order: 5, fixed: false },
  { id: 'skills', icon: Award, label: 'Skills', labelKey: 'sidebar.skills', order: 6, fixed: false },
  { id: 'technologiesSkills', icon: Cpu, label: 'Technologies', labelKey: 'sidebar.technologies', order: 7, fixed: false },
  { id: 'hobbies', icon: Gamepad2, label: 'Hobbies', labelKey: 'sidebar.hobbies', order: 8, fixed: false },
];

// Additional section types that can be added via "Additional section"
export interface AdditionalSectionItem {
  id: string;
  icon: typeof User;
  label: string;
  labelKey?: string;
}

export const ADDITIONAL_SECTION: AdditionalSectionItem[] = [
  { id: 'summary', icon: FileDown, label: 'Professional summary', labelKey: 'sidebar.professionalSummary' },
  { id: 'internships', icon: Briefcase, label: 'Internships', labelKey: 'sidebar.internships' },
  { id: 'references', icon: MessageSquare, label: 'References', labelKey: 'sidebar.references' },
  { id: 'languages', icon: Globe, label: 'Languages', labelKey: 'sidebar.languages' },
  { id: 'links', icon: Link, label: 'Links', labelKey: 'sidebar.links' },
  { id: 'custom', icon: Code, label: 'Custom section', labelKey: 'sidebar.customSection' },
];

export const SECTION_TYPES = {
  PERSONAL: 'personal',
  CONTACT: 'contact',
  EMPLOYMENT: 'employment',
  SKILLS: 'skills',
  PROJECTS: 'projects',
  EDUCATION: 'education',
} as const;

export type SectionType = (typeof SECTION_TYPES)[keyof typeof SECTION_TYPES];
