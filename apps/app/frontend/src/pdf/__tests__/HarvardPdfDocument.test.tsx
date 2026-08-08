import { Document, Page } from '@react-pdf/renderer';
import { describe, expect, it } from 'vitest';
import {
  HARVARD_PAGE_MARGIN,
  HarvardPdfDocument,
  safePdfLinkTarget,
} from '../HarvardPdfDocument';
import type { ResumeDocumentModel } from '../resumeDocumentModel';

const model: ResumeDocumentModel = {
  version: 1,
  locale: 'en',
  labels: {
    sections: {
      summary: 'Professional Summary',
      employment: 'Professional Experience',
      internships: 'Internship Experience',
      education: 'Education',
      projects: 'Projects',
      links: 'Portfolio & Links',
      references: 'References',
      custom: 'Custom Section',
    },
    skillGroups: {
      courses: 'Certifications',
      skills: 'Skills',
      technologiesSkills: 'Technologies',
      languages: 'Languages',
      hobbies: 'Interests',
    },
  },
  metadata: {
    title: 'Resume - Ada Lovelace',
    author: 'Ada Lovelace',
    creator: 'ResuEase',
    producer: 'ResuEase',
    language: 'en',
  },
  header: {
    fullName: 'Ada Lovelace',
    contact: {},
  },
  sections: [],
  revision: 'resume-v1-test',
};

describe('HarvardPdfDocument', () => {
  it('builds a metadata-bearing, wrapped A4 Document with the Harvard 36pt margin', () => {
    const document = HarvardPdfDocument({ model });
    const page = document.props.children;

    expect(document.type).toBe(Document);
    expect(document.props).toMatchObject({
      title: 'Resume - Ada Lovelace',
      author: 'Ada Lovelace',
      creator: 'ResuEase',
      producer: 'ResuEase',
      language: 'en',
    });
    expect(page.type).toBe(Page);
    expect(page.props).toMatchObject({
      size: 'A4',
      wrap: true,
      style: { padding: HARVARD_PAGE_MARGIN },
    });
  });

  it('only forwards renderer-safe annotation targets', () => {
    expect(safePdfLinkTarget('https://example.com/work')).toBe('https://example.com/work');
    expect(safePdfLinkTarget('mailto:ada@example.com')).toBe('mailto:ada@example.com');
    expect(safePdfLinkTarget('tel:+15550100')).toBe('tel:+15550100');
    expect(safePdfLinkTarget('javascript:alert(1)')).toBeUndefined();
    expect(safePdfLinkTarget(undefined)).toBeUndefined();
  });
});
