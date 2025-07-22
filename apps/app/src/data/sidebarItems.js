import { User, Phone, FileDown, Briefcase, GraduationCap, Award } from 'lucide-react';

export const SIDEBAR_ITEMS = [
  { id: 'personal', icon: User, label: 'Personal details' },
  { id: 'contact', icon: Phone, label: 'Contact information' },
  { id: 'summary', icon: FileDown, label: 'Professional summary' },
  { id: 'employment', icon: Briefcase, label: 'Employment history' },
  { id: 'skills', icon: Award, label: 'Skills' },
  { id: 'education', icon: GraduationCap, label: 'Education' }
];

export const SECTION_TYPES = {
  PERSONAL: 'personal',
  CONTACT: 'contact',
  SUMMARY: 'summary',
  EMPLOYMENT: 'employment',
  SKILLS: 'skills',
  EDUCATION: 'education'
};