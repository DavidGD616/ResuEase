import { User, Phone, FileDown, Briefcase, GraduationCap, Award, MessageSquare, Globe, Link, Gamepad2, Code, FolderKanban } from 'lucide-react';

// Core sections that appear by default in the sidebar
export const SIDEBAR_ITEMS = [
  { id: 'personal', icon: User, label: 'Personal details', order: 0, fixed: true },
  { id: 'contact', icon: Phone, label: 'Contact information', order: 1, fixed: true },
  { id: 'employment', icon: Briefcase, label: 'Employment history', order: 2, fixed: false },
  { id: 'education', icon: GraduationCap, label: 'Education', order: 3, fixed: false },
  { id: 'projects', icon: FolderKanban,  label: 'Projects', order: 4, fixed: false },
  { id: 'skills', icon: Award, label: 'Skills', order: 5, fixed: false },
];

// Additional section types that can be added via "Additional section"
export const ADDITIONAL_SECTION = [
  { id: 'summary', icon: FileDown, label: 'Professional summary' },
  { id: 'internships', icon: Briefcase, label: 'Internships' },
  { id: 'courses', icon: GraduationCap, label: 'Courses' },
  { id: 'references', icon: MessageSquare, label: 'References' },
  { id: 'languages', icon: Globe, label: 'Languages' },
  { id: 'links', icon: Link, label: 'Links' },
  { id: 'hobbies', icon: Gamepad2, label: 'Hobbies' },
  { id: 'custom', icon: Code, label: 'Custom section' }
];

export const SECTION_TYPES = {
  PERSONAL: 'personal',
  CONTACT: 'contact',
  EMPLOYMENT: 'employment',
  SKILLS: 'skills',
  PROJECTS: 'projects',
  EDUCATION: 'education',
};