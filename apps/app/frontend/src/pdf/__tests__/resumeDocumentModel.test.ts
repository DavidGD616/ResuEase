import { User } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import {
  buildResumeDocumentModel,
  sanitizeLinkTarget,
  type ResumeDocumentSection,
} from '../resumeDocumentModel';
import { multiPageEnglishResumeFixture, multiPageSpanishResumeFixture } from '../__fixtures__/resumeFixtures';
import type { FormData, SidebarItem } from '../../types/resume';

const baseFormData: FormData = {
  firstName: '',
  lastName: '',
  jobTitle: '',
  email: '',
  phone: '',
  location: '',
  portfolio: '',
  about: '',
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
};

function sidebarItem(id: string, order: number, label = id, fixed = false): SidebarItem {
  return { id, order, label, fixed, icon: User };
}

function sectionById(sections: ResumeDocumentSection[], id: string): ResumeDocumentSection {
  const section = sections.find((candidate) => candidate.id === id);
  if (!section) throw new Error(`Expected a ${id} section`);
  return section;
}

describe('buildResumeDocumentModel', () => {
  it('normalizes header data and resolves labels for the selected locale outside rendering', () => {
    const model = buildResumeDocumentModel(
      {
        ...baseFormData,
        firstName: '  Ana ',
        lastName: ' Gómez  ',
        jobTitle: '  Diseñadora\n de producto ',
        location: ' Ciudad de México ',
        about: '  Profesional\ncon experiencia. ',
      },
      [sidebarItem('summary', 0)],
      'es-MX',
    );

    expect(model.locale).toBe('es');
    expect(model.header).toEqual({
      fullName: 'Ana Gómez',
      jobTitle: 'Diseñadora de producto',
      contact: { location: 'Ciudad de México', phone: undefined, email: undefined, portfolio: undefined },
    });
    expect(model.labels.sections.summary).toBe('Resumen Profesional');
    expect(sectionById(model.sections, 'summary')).toMatchObject({
      kind: 'summary',
      title: 'Resumen Profesional',
      content: 'Profesional con experiencia.',
    });
    expect(model.metadata).toMatchObject({
      title: 'Resume - Ana Gómez',
      author: 'Ana Gómez',
      language: 'es',
    });
  });

  it('uses sidebar order for regular sections, then appends combined groups regardless of their sidebar position', () => {
    const model = buildResumeDocumentModel(
      {
        ...baseFormData,
        employment: [{ jobTitle: 'Engineer', company: 'Acme', startDate: '2020', endDate: '2024', location: '', description: '', bulletPoints: [], isCurrentJob: false }],
        projects: [{ name: 'Portfolio', url: '', dateRange: '', bulletPoints: [] }],
        courses: [{ courseName: 'Algorithms' }],
        skills: [{ skillName: 'TypeScript' }],
        ['customEntries_custom-7']: [{ header: 'Award', subheader: '', description: '', bulletPoints: [] }],
      },
      [
        sidebarItem('courses', 0),
        sidebarItem('skills', 1),
        sidebarItem('employment', 2),
        sidebarItem('custom-7', 3, 'Awards'),
        sidebarItem('projects', 4),
      ],
      'en',
    );

    expect(model.sections.map((section) => section.id)).toEqual([
      'employment',
      'custom-7',
      'projects',
      'combined-skills',
    ]);

    const combined = sectionById(model.sections, 'combined-skills');
    expect(combined).toMatchObject({
      kind: 'combinedSkills',
      title: 'Certifications & Skills',
      groups: [
        { id: 'courses', label: 'Certifications', items: ['Algorithms'] },
        { id: 'skills', label: 'Skills', items: ['TypeScript'] },
      ],
    });
  });

  it('keeps a custom sidebar label verbatim even when the item has a translatable labelKey', () => {
    const customTitle = '  Premios y distinciones — 2026  ';
    const model = buildResumeDocumentModel(
      {
        ...baseFormData,
        ['customEntries_custom-1']: [{ header: 'Ganadora', subheader: 'Premio Nacional', description: '', bulletPoints: [] }],
      },
      [{ ...sidebarItem('custom-1', 0, customTitle), labelKey: 'sidebar.customSection' }],
      'es',
    );

    expect(sectionById(model.sections, 'custom-1')).toMatchObject({
      kind: 'custom',
      title: customTitle,
    });
  });

  it('filters blank draft entries while retaining every visible standard-section field', () => {
    const model = buildResumeDocumentModel(
      {
        ...baseFormData,
        employment: [
          { jobTitle: '', company: '', startDate: '', endDate: '', location: '', description: ' ', bulletPoints: [' ', ''], isCurrentJob: false },
          { jobTitle: 'Lead Engineer', company: 'ResuEase', startDate: '', endDate: '', location: '', description: '', bulletPoints: ['  Built a renderer.  ', ''], isCurrentJob: false },
        ],
        education: [{ degree: '', institution: '', dateRange: '', location: '', bulletPoints: [''] }],
        projects: [{ name: '', url: 'https://example.com', dateRange: '', bulletPoints: [] }],
        links: [{ linkTitle: '', url: '' }],
        references: [{ referentName: '', referentCompany: '', referentEmail: '', referentPhone: '' }],
        skills: [{ skillName: '' }, { skillName: 'React' }],
        courses: [{ courseName: '' }],
        languages: [{ language: '', proficiency: 'Native' }],
        hobbies: [{ hobbyName: '' }],
      },
      [
        sidebarItem('employment', 0),
        sidebarItem('education', 1),
        sidebarItem('projects', 2),
        sidebarItem('links', 3),
        sidebarItem('references', 4),
        sidebarItem('courses', 5),
        sidebarItem('skills', 6),
        sidebarItem('languages', 7),
        sidebarItem('hobbies', 8),
      ],
    );

    expect(model.sections.map((section) => section.id)).toEqual(['employment', 'projects', 'combined-skills']);
    const employment = sectionById(model.sections, 'employment');
    expect(employment).toMatchObject({
      kind: 'employment',
      items: [{ jobTitle: 'Lead Engineer', company: 'ResuEase', bulletPoints: ['Built a renderer.'] }],
    });
    expect(sectionById(model.sections, 'combined-skills')).toMatchObject({
      groups: [{ id: 'skills', items: ['React'] }],
    });
    expect(sectionById(model.sections, 'projects')).toMatchObject({
      items: [{ name: { displayText: 'Project Name', linkTarget: 'https://example.com/' } }],
    });
  });

  it('keeps display strings separate from normalized safe link annotations', () => {
    const model = buildResumeDocumentModel(
      {
        ...baseFormData,
        email: 'ana@example.com',
        phone: '+1 (555) 010-0000',
        portfolio: 'portfolio.example',
        projects: [{ name: 'Open source work', url: 'github.com/ana/project', dateRange: '', bulletPoints: [] }],
        links: [
          { linkTitle: 'Website', url: 'https://example.com/work' },
          { linkTitle: 'Unsafe', url: 'javascript:alert(1)' },
        ],
        references: [{ referentName: 'Ada', referentCompany: 'Analytical Engines', referentEmail: 'ada@example.com', referentPhone: '555.123.4567', position: 'Director' }] as unknown as FormData['references'],
      },
      [sidebarItem('projects', 0), sidebarItem('links', 1), sidebarItem('references', 2)],
    );

    expect(model.header.contact).toEqual({
      location: undefined,
      email: { displayText: 'ana@example.com', linkTarget: 'mailto:ana@example.com' },
      phone: { displayText: '+1 (555) 010-0000', linkTarget: 'tel:+15550100000' },
      portfolio: { displayText: 'portfolio.example', linkTarget: 'https://portfolio.example/' },
    });

    const projects = sectionById(model.sections, 'projects');
    expect(projects).toMatchObject({
      kind: 'projects',
      items: [{ name: { displayText: 'Open source work', linkTarget: 'https://github.com/ana/project' } }],
    });

    const links = sectionById(model.sections, 'links');
    expect(links).toMatchObject({
      kind: 'links',
      items: [
        { title: 'Website', url: { displayText: 'https://example.com/work', linkTarget: 'https://example.com/work' } },
        { title: 'Unsafe', url: { displayText: 'javascript:alert(1)' } },
      ],
    });

    const references = sectionById(model.sections, 'references');
    expect(references).toMatchObject({
      kind: 'references',
      items: [{
        position: 'Director',
        phone: { displayText: '555.123.4567', linkTarget: 'tel:5551234567' },
        email: { displayText: 'ada@example.com', linkTarget: 'mailto:ada@example.com' },
      }],
    });

    expect(sanitizeLinkTarget('ftp://example.com')).toBeUndefined();
    expect(sanitizeLinkTarget('https://example.com')).toBe('https://example.com/');
  });

  it('creates a stable revision for identical output and changes it for locale, content, or order changes', () => {
    const formData: FormData = {
      ...baseFormData,
      firstName: 'Ada',
      lastName: 'Lovelace',
      about: 'Computing pioneer.',
      employment: [{ jobTitle: 'Mathematician', company: '', startDate: '', endDate: '', location: '', description: '', bulletPoints: [], isCurrentJob: false }],
      projects: [{ name: 'Notes', url: '', dateRange: '', bulletPoints: [] }],
    };
    const sidebar = [sidebarItem('employment', 0), sidebarItem('summary', 1), sidebarItem('projects', 2)];

    const initial = buildResumeDocumentModel(formData, sidebar, 'en');
    expect(buildResumeDocumentModel(formData, sidebar, 'en').revision).toBe(initial.revision);
    expect(buildResumeDocumentModel(formData, sidebar, 'es').revision).not.toBe(initial.revision);
    expect(buildResumeDocumentModel({ ...formData, about: 'First programmer.' }, sidebar, 'en').revision).not.toBe(initial.revision);
    const reorderedSidebar = [
      { ...sidebar[2], order: 0 },
      { ...sidebar[1], order: 1 },
      { ...sidebar[0], order: 2 },
    ];
    expect(buildResumeDocumentModel(formData, reorderedSidebar, 'en').revision).not.toBe(initial.revision);
  });

  it('keeps the reusable English and Spanish multi-page fixtures structurally complete', () => {
    for (const fixture of [multiPageEnglishResumeFixture, multiPageSpanishResumeFixture]) {
      const model = buildResumeDocumentModel(fixture.formData, fixture.sidebarItems, fixture.locale);
      const documentIds = model.sections.map((section) => section.id);

      expect(model.locale).toBe(fixture.locale);
      expect(documentIds).toEqual(expect.arrayContaining([
        'summary',
        'employment',
        'internships',
        'education',
        'projects',
        'links',
        'references',
        'combined-skills',
      ]));
      expect(model.sections.find((section) => section.kind === 'custom')?.title).toBeTruthy();
      expect(documentIds[documentIds.length - 1]).toBe('combined-skills');
    }
  });
});
