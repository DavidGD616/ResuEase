import { User, Phone, FileDown, Briefcase, GraduationCap, Award } from 'lucide-react';

export const SIDEBAR_ITEMS = [
  { id: 'personal', icon: User, label: 'Personal details', order: 0, fixed: true },
  { id: 'contact', icon: Phone, label: 'Contact information', order: 1, fixed: true },
  { id: 'summary', icon: FileDown, label: 'Professional summary', order: 2, fixed: true },
  { id: 'employment', icon: Briefcase, label: 'Employment history', order: 3, fixed: false },
  { id: 'skills', icon: Award, label: 'Skills', order: 4, fixed: false },
  { id: 'education', icon: GraduationCap, label: 'Education', order: 5, fixed: false }
];

export const SECTION_TYPES = {
  PERSONAL: 'personal',
  CONTACT: 'contact',
  SUMMARY: 'summary',
  EMPLOYMENT: 'employment',
  SKILLS: 'skills',
  EDUCATION: 'education'
};