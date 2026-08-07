import en from '../locales/en.json';
import es from '../locales/es.json';
import type { FormData, SidebarItem } from '../types/resume';

/**
 * Renderer-independent, display-ready resume data.  Keep this module free of
 * React and i18next so the preview and download always receive the same
 * localized content.
 */

export type ResumeLocale = 'en' | 'es';

export type StandardResumeSectionId =
  | 'summary'
  | 'employment'
  | 'internships'
  | 'education'
  | 'projects'
  | 'links'
  | 'references';

export type CombinedSkillSectionId =
  | 'courses'
  | 'skills'
  | 'technologiesSkills'
  | 'languages'
  | 'hobbies';

/**
 * The visible string is deliberately separate from the annotation target.
 * Renderers must use displayText for layout and only create a link when
 * linkTarget is present.
 */
export interface ResumeDisplayLink {
  displayText: string;
  linkTarget?: string;
}

export interface ResumeDocumentLabels {
  sections: Record<StandardResumeSectionId, string> & { custom: string };
  skillGroups: Record<CombinedSkillSectionId, string>;
}

export interface ResumeDocumentMetadata {
  title: string;
  author: string;
  creator: 'ResuEase';
  producer: 'ResuEase';
  language: ResumeLocale;
}

export interface ResumeDocumentHeader {
  fullName: string;
  jobTitle?: string;
  contact: {
    location?: string;
    phone?: ResumeDisplayLink;
    email?: ResumeDisplayLink;
    portfolio?: ResumeDisplayLink;
  };
}

export interface ResumeWorkItem {
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  bulletPoints: string[];
}

export interface ResumeEducationItem {
  degree: string;
  institution: string;
  location: string;
  dateRange: string;
  description: string;
  bulletPoints: string[];
}

export interface ResumeProjectItem {
  name: ResumeDisplayLink;
  dateRange: string;
  bulletPoints: string[];
}

export interface ResumeLinkItem {
  title: string;
  url?: ResumeDisplayLink;
}

export interface ResumeReferenceItem {
  referentName: string;
  referentCompany: string;
  position: string;
  phone?: ResumeDisplayLink;
  email?: ResumeDisplayLink;
}

export interface ResumeCustomItem {
  header: string;
  subheader: string;
  description: string;
  bulletPoints: string[];
}

export interface ResumeSkillGroup {
  id: CombinedSkillSectionId;
  label: string;
  items: string[];
}

export interface ResumeSummarySection {
  kind: 'summary';
  id: 'summary';
  title: string;
  content: string;
}

export interface ResumeWorkSection {
  kind: 'employment' | 'internships';
  id: 'employment' | 'internships';
  title: string;
  items: ResumeWorkItem[];
}

export interface ResumeEducationSection {
  kind: 'education';
  id: 'education';
  title: string;
  items: ResumeEducationItem[];
}

export interface ResumeProjectsSection {
  kind: 'projects';
  id: 'projects';
  title: string;
  items: ResumeProjectItem[];
}

export interface ResumeLinksSection {
  kind: 'links';
  id: 'links';
  title: string;
  items: ResumeLinkItem[];
}

export interface ResumeReferencesSection {
  kind: 'references';
  id: 'references';
  title: string;
  items: ResumeReferenceItem[];
}

export interface ResumeCombinedSkillsSection {
  kind: 'combinedSkills';
  id: 'combined-skills';
  title: string;
  groups: ResumeSkillGroup[];
}

export interface ResumeCustomSection {
  kind: 'custom';
  id: string;
  title: string;
  items: ResumeCustomItem[];
}

export type ResumeDocumentSection =
  | ResumeSummarySection
  | ResumeWorkSection
  | ResumeEducationSection
  | ResumeProjectsSection
  | ResumeLinksSection
  | ResumeReferencesSection
  | ResumeCombinedSkillsSection
  | ResumeCustomSection;

export interface ResumeDocumentModel {
  version: 1;
  locale: ResumeLocale;
  labels: ResumeDocumentLabels;
  metadata: ResumeDocumentMetadata;
  header: ResumeDocumentHeader;
  /** Final render order; combined groups are intentionally always last. */
  sections: ResumeDocumentSection[];
  /** Stable key for coalescing generation requests and rejecting stale output. */
  revision: string;
}

const STANDARD_SECTION_IDS: readonly StandardResumeSectionId[] = [
  'summary',
  'employment',
  'internships',
  'education',
  'projects',
  'links',
  'references',
];

const COMBINED_SKILL_SECTION_IDS: readonly CombinedSkillSectionId[] = [
  'courses',
  'skills',
  'technologiesSkills',
  'languages',
  'hobbies',
];

const SAFE_LINK_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

const LOCALE_RESOURCES = {
  en,
  es,
} as const;

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Match the browser's normal-white-space display while removing empty input. */
function normalizeDisplayText(value: unknown): string {
  return typeof value === 'string' ? value.replace(/\s+/gu, ' ').trim() : '';
}

function textAt(record: UnknownRecord, key: string): string {
  return normalizeDisplayText(record[key]);
}

function arrayAt(record: UnknownRecord, key: string): unknown[] {
  const value = record[key];
  return Array.isArray(value) ? value : [];
}

function normalizedBullets(value: unknown): string[] {
  return Array.isArray(value)
    ? value.map(normalizeDisplayText).filter(Boolean)
    : [];
}

function hasVisibleText(...values: string[]): boolean {
  return values.some(Boolean);
}

function isStandardSectionId(value: string): value is StandardResumeSectionId {
  return (STANDARD_SECTION_IDS as readonly string[]).includes(value);
}

function isCombinedSkillSectionId(value: string): value is CombinedSkillSectionId {
  return (COMBINED_SKILL_SECTION_IDS as readonly string[]).includes(value);
}

export function resolveResumeLocale(locale?: string): ResumeLocale {
  const language = locale?.toLowerCase().split('-')[0];
  return language === 'es' ? 'es' : 'en';
}

function buildLabels(locale: ResumeLocale): ResumeDocumentLabels {
  const resource = LOCALE_RESOURCES[locale].resume;

  return {
    sections: {
      summary: resource.sections.summary,
      employment: resource.sections.employment,
      internships: resource.sections.internships,
      education: resource.sections.education,
      projects: resource.sections.projects,
      links: resource.sections.links,
      references: resource.sections.references,
      custom: resource.sections.custom,
    },
    skillGroups: {
      courses: resource.skillGroups.courses,
      skills: resource.skillGroups.skills,
      technologiesSkills: resource.skillGroups.technologiesSkills,
      languages: resource.skillGroups.languages,
      hobbies: resource.skillGroups.hobbies,
    },
  };
}

/**
 * Return only annotation-safe targets. The parsed href is intentionally
 * normalized separately from the user-facing display text.
 */
export function sanitizeLinkTarget(value: string): string | undefined {
  const target = value.trim();
  if (!target || /[\u0000-\u001F\u007F]/u.test(target)) return undefined;

  try {
    const parsed = new URL(target);
    return SAFE_LINK_PROTOCOLS.has(parsed.protocol.toLowerCase())
      ? parsed.href
      : undefined;
  } catch {
    return undefined;
  }
}

function normalizeWebLinkTarget(displayText: string): string | undefined {
  if (!displayText) return undefined;

  const hasProtocol = /^[a-z][a-z\d+.-]*:/iu.test(displayText);
  return sanitizeLinkTarget(hasProtocol ? displayText : `https://${displayText}`);
}

function normalizeEmailLinkTarget(displayText: string): string | undefined {
  if (!/^[^\s@]+@[^\s@]+$/u.test(displayText)) return undefined;
  return sanitizeLinkTarget(`mailto:${displayText}`);
}

function normalizePhoneLinkTarget(displayText: string): string | undefined {
  if (/^tel:/iu.test(displayText)) return sanitizeLinkTarget(displayText);

  const compact = displayText.replace(/[()\s.-]/gu, '');
  if (!/\d/u.test(compact) || !/^\+?[\d*#,;]+$/u.test(compact)) return undefined;
  return sanitizeLinkTarget(`tel:${compact}`);
}

function displayLink(displayText: string, linkTarget?: string): ResumeDisplayLink {
  return linkTarget ? { displayText, linkTarget } : { displayText };
}

function buildHeader(formData: UnknownRecord): ResumeDocumentHeader {
  const firstName = textAt(formData, 'firstName');
  const lastName = textAt(formData, 'lastName');
  const phone = textAt(formData, 'phone');
  const email = textAt(formData, 'email');
  const portfolio = textAt(formData, 'portfolio');

  return {
    fullName: [firstName, lastName].filter(Boolean).join(' '),
    jobTitle: textAt(formData, 'jobTitle') || undefined,
    contact: {
      location: textAt(formData, 'location') || undefined,
      phone: phone ? displayLink(phone, normalizePhoneLinkTarget(phone)) : undefined,
      email: email ? displayLink(email, normalizeEmailLinkTarget(email)) : undefined,
      portfolio: portfolio ? displayLink(portfolio, normalizeWebLinkTarget(portfolio)) : undefined,
    },
  };
}

function buildWorkItem(value: unknown): ResumeWorkItem | undefined {
  if (!isRecord(value)) return undefined;

  const jobTitle = textAt(value, 'jobTitle');
  const company = textAt(value, 'company');
  const location = textAt(value, 'location');
  const startDate = textAt(value, 'startDate');
  const endDate = textAt(value, 'endDate');
  const description = textAt(value, 'description');
  const bulletPoints = normalizedBullets(value.bulletPoints);

  if (!hasVisibleText(jobTitle, company, location, startDate, endDate, description, ...bulletPoints)) {
    return undefined;
  }

  return { jobTitle, company, location, startDate, endDate, description, bulletPoints };
}

function buildEducationItem(value: unknown): ResumeEducationItem | undefined {
  if (!isRecord(value)) return undefined;

  const degree = textAt(value, 'degree');
  const institution = textAt(value, 'institution');
  const location = textAt(value, 'location');
  const dateRange = textAt(value, 'dateRange');
  const description = textAt(value, 'description');
  const bulletPoints = normalizedBullets(value.bulletPoints);

  if (!hasVisibleText(degree, institution, location, dateRange, description, ...bulletPoints)) {
    return undefined;
  }

  return { degree, institution, location, dateRange, description, bulletPoints };
}

function buildProjectItem(value: unknown): ResumeProjectItem | undefined {
  if (!isRecord(value)) return undefined;

  const name = textAt(value, 'name');
  const url = textAt(value, 'url');
  const dateRange = textAt(value, 'dateRange');
  const bulletPoints = normalizedBullets(value.bulletPoints);

  if (!hasVisibleText(name, url, dateRange, ...bulletPoints)) return undefined;

  return {
    // Keep the legacy Harvard fallback visible for URL-only project entries.
    name: displayLink(name || 'Project Name', normalizeWebLinkTarget(url)),
    dateRange,
    bulletPoints,
  };
}

function buildLinkItem(value: unknown): ResumeLinkItem | undefined {
  if (!isRecord(value)) return undefined;

  const title = textAt(value, 'linkTitle');
  const url = textAt(value, 'url');
  if (!hasVisibleText(title, url)) return undefined;

  return {
    title,
    url: url ? displayLink(url, normalizeWebLinkTarget(url)) : undefined,
  };
}

function buildReferenceItem(value: unknown): ResumeReferenceItem | undefined {
  if (!isRecord(value)) return undefined;

  const referentName = textAt(value, 'referentName');
  const referentCompany = textAt(value, 'referentCompany');
  // position is not created by the current form, but older persisted resumes
  // can contain it and HarvardTemplate still renders it.
  const position = textAt(value, 'position');
  const phone = textAt(value, 'referentPhone');
  const email = textAt(value, 'referentEmail');

  if (!hasVisibleText(referentName, referentCompany, position, phone, email)) {
    return undefined;
  }

  return {
    referentName,
    referentCompany,
    position,
    phone: phone ? displayLink(phone, normalizePhoneLinkTarget(phone)) : undefined,
    email: email ? displayLink(email, normalizeEmailLinkTarget(email)) : undefined,
  };
}

function buildCustomItem(value: unknown): ResumeCustomItem | undefined {
  if (!isRecord(value)) return undefined;

  const header = textAt(value, 'header');
  const subheader = textAt(value, 'subheader');
  const description = textAt(value, 'description');
  const bulletPoints = normalizedBullets(value.bulletPoints);

  if (!hasVisibleText(header, subheader, description, ...bulletPoints)) return undefined;
  return { header, subheader, description, bulletPoints };
}

function buildCombinedSkillGroup(
  sectionId: CombinedSkillSectionId,
  formData: UnknownRecord,
  labels: ResumeDocumentLabels,
): ResumeSkillGroup | undefined {
  const entries = arrayAt(formData, sectionId);
  const items = entries.flatMap((entry) => {
    if (!isRecord(entry)) return [];

    switch (sectionId) {
      case 'courses': {
        const courseName = textAt(entry, 'courseName');
        return courseName ? [courseName] : [];
      }
      case 'skills': {
        const skillName = textAt(entry, 'skillName');
        return skillName ? [skillName] : [];
      }
      case 'technologiesSkills': {
        const skillName = textAt(entry, 'technologiesSkillName');
        return skillName ? [skillName] : [];
      }
      case 'languages': {
        const language = textAt(entry, 'language');
        const proficiency = textAt(entry, 'proficiency');
        if (!language) return [];
        return [proficiency && proficiency !== 'Not applicable' ? `${language} (${proficiency})` : language];
      }
      case 'hobbies': {
        const hobbyName = textAt(entry, 'hobbyName');
        return hobbyName ? [hobbyName] : [];
      }
    }
  });

  return items.length > 0 ? { id: sectionId, label: labels.skillGroups[sectionId], items } : undefined;
}

function buildStandardSection(
  sectionId: StandardResumeSectionId,
  formData: UnknownRecord,
  labels: ResumeDocumentLabels,
): ResumeDocumentSection | undefined {
  switch (sectionId) {
    case 'summary': {
      const content = textAt(formData, 'about');
      return content ? { kind: 'summary', id: 'summary', title: labels.sections.summary, content } : undefined;
    }
    case 'employment':
    case 'internships': {
      const items = arrayAt(formData, sectionId).flatMap((item) => {
        const workItem = buildWorkItem(item);
        return workItem ? [workItem] : [];
      });
      return items.length > 0 ? { kind: sectionId, id: sectionId, title: labels.sections[sectionId], items } : undefined;
    }
    case 'education': {
      const items = arrayAt(formData, 'education').flatMap((item) => {
        const educationItem = buildEducationItem(item);
        return educationItem ? [educationItem] : [];
      });
      return items.length > 0 ? { kind: 'education', id: 'education', title: labels.sections.education, items } : undefined;
    }
    case 'projects': {
      const items = arrayAt(formData, 'projects').flatMap((item) => {
        const projectItem = buildProjectItem(item);
        return projectItem ? [projectItem] : [];
      });
      return items.length > 0 ? { kind: 'projects', id: 'projects', title: labels.sections.projects, items } : undefined;
    }
    case 'links': {
      const items = arrayAt(formData, 'links').flatMap((item) => {
        const linkItem = buildLinkItem(item);
        return linkItem ? [linkItem] : [];
      });
      return items.length > 0 ? { kind: 'links', id: 'links', title: labels.sections.links, items } : undefined;
    }
    case 'references': {
      const items = arrayAt(formData, 'references').flatMap((item) => {
        const referenceItem = buildReferenceItem(item);
        return referenceItem ? [referenceItem] : [];
      });
      return items.length > 0 ? { kind: 'references', id: 'references', title: labels.sections.references, items } : undefined;
    }
  }
}

function buildCustomSection(
  sectionId: string,
  label: string,
  formData: UnknownRecord,
): ResumeCustomSection | undefined {
  const entries = arrayAt(formData, `customEntries_${sectionId}`).flatMap((item) => {
    const customItem = buildCustomItem(item);
    return customItem ? [customItem] : [];
  });

  return entries.length > 0 ? { kind: 'custom', id: sectionId, title: label, items: entries } : undefined;
}

function sortSidebarItems(sidebarItems: SidebarItem[]): SidebarItem[] {
  return sidebarItems
    .map((item, index) => ({ item, index }))
    .sort((left, right) => left.item.order - right.item.order || left.index - right.index)
    .map(({ item }) => item);
}

function combinedTitle(groups: ResumeSkillGroup[]): string {
  const groupLabels = groups.map((group) => group.label);
  if (groupLabels.length === 1) return groupLabels[0];
  if (groupLabels.length === 2) return groupLabels.join(' & ');

  const last = groupLabels[groupLabels.length - 1]!;
  return `${groupLabels.slice(0, -1).join(', ')} & ${last}`;
}

function stableStringify(value: unknown): string {
  if (value === null) return 'null';

  switch (typeof value) {
    case 'string':
    case 'number':
    case 'boolean':
      return JSON.stringify(value);
    case 'undefined':
      return 'undefined';
    case 'object': {
      if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;

      const record = value as UnknownRecord;
      return `{${Object.keys(record)
        .sort()
        .map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`)
        .join(',')}}`;
    }
    default:
      return JSON.stringify(String(value));
  }
}

function revisionFor(model: Omit<ResumeDocumentModel, 'revision'>): string {
  const serialized = stableStringify(model);
  let hash = 0x811c9dc5;

  for (let index = 0; index < serialized.length; index += 1) {
    hash ^= serialized.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  return `resume-v1-${(hash >>> 0).toString(36)}`;
}

/**
 * Converts persisted form and sidebar state into a complete visual document
 * contract. It deliberately omits unfilled draft entries and unknown sidebar
 * IDs, matching what a finished resume should display.
 */
export function buildResumeDocumentModel(
  formData: FormData,
  sidebarItems: SidebarItem[],
  locale?: string,
): ResumeDocumentModel {
  const resolvedLocale = resolveResumeLocale(locale);
  const labels = buildLabels(resolvedLocale);
  const input = formData as unknown as UnknownRecord;
  const header = buildHeader(input);
  const sortedSidebarItems = sortSidebarItems(sidebarItems);

  const regularSections = sortedSidebarItems
    .filter((item) => !item.fixed && !isCombinedSkillSectionId(item.id))
    .flatMap((item) => {
      if (item.id.startsWith('custom-')) {
        // Deliberately ignore labelKey: custom labels are user data, not UI copy.
        const customSection = buildCustomSection(item.id, item.label, input);
        return customSection ? [customSection] : [];
      }

      if (!isStandardSectionId(item.id)) return [];
      const section = buildStandardSection(item.id, input, labels);
      return section ? [section] : [];
    });

  const combinedGroups = sortedSidebarItems
    .filter((item) => isCombinedSkillSectionId(item.id))
    .flatMap((item) => {
      const group = buildCombinedSkillGroup(item.id as CombinedSkillSectionId, input, labels);
      return group ? [group] : [];
    });

  const combinedSection: ResumeCombinedSkillsSection | undefined = combinedGroups.length > 0
    ? {
        kind: 'combinedSkills',
        id: 'combined-skills',
        title: combinedTitle(combinedGroups),
        groups: combinedGroups,
      }
    : undefined;

  const firstName = textAt(input, 'firstName');
  const lastName = textAt(input, 'lastName');
  const modelWithoutRevision: Omit<ResumeDocumentModel, 'revision'> = {
    version: 1,
    locale: resolvedLocale,
    labels,
    metadata: {
      title: firstName && lastName ? `Resume - ${header.fullName}` : 'Resume',
      author: header.fullName,
      creator: 'ResuEase',
      producer: 'ResuEase',
      language: resolvedLocale,
    },
    header,
    sections: combinedSection ? [...regularSections, combinedSection] : regularSections,
  };

  return {
    ...modelWithoutRevision,
    revision: revisionFor(modelWithoutRevision),
  };
}
