import { describe, it, expect } from 'vitest';
import { processHeaderData, processSectionData } from '../resumeDataProcessors';
import type { FormData, SkillItem, TechSkillItem, HobbyItem, EmploymentItem } from '../../types/resume';

const base: FormData = {
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

// ---------------------------------------------------------------------------
// processHeaderData
// ---------------------------------------------------------------------------

describe('processHeaderData', () => {
  it('combines first and last name with a space', () => {
    const result = processHeaderData({ ...base, firstName: 'Alice', lastName: 'Smith' });
    expect(result.fullName).toBe('Alice Smith');
  });

  it('trims when only first name is present', () => {
    const result = processHeaderData({ ...base, firstName: 'Alice', lastName: '' });
    expect(result.fullName).toBe('Alice');
  });

  it('trims when only last name is present', () => {
    const result = processHeaderData({ ...base, firstName: '', lastName: 'Smith' });
    expect(result.fullName).toBe('Smith');
  });

  it('returns empty string when both names are empty', () => {
    const result = processHeaderData(base);
    expect(result.fullName).toBe('');
  });

  it('returns jobTitle when present', () => {
    const result = processHeaderData({ ...base, jobTitle: 'Software Engineer' });
    expect(result.jobTitle).toBe('Software Engineer');
  });

  it('returns empty string for jobTitle when absent', () => {
    const result = processHeaderData(base);
    expect(result.jobTitle).toBe('');
  });

  it('passes all contact fields through unchanged', () => {
    const result = processHeaderData({
      ...base,
      email: 'alice@example.com',
      phone: '555-1234',
      location: 'New York, NY',
      portfolio: 'alice.dev',
    });
    expect(result.contact).toEqual({
      email: 'alice@example.com',
      phone: '555-1234',
      location: 'New York, NY',
      portfolio: 'alice.dev',
    });
  });
});

// ---------------------------------------------------------------------------
// processSectionData.summary
// ---------------------------------------------------------------------------

describe('processSectionData.summary', () => {
  it('is empty when about is an empty string', () => {
    const result = processSectionData.summary(base);
    expect(result.isEmpty).toBe(true);
  });

  it('is not empty when about has content', () => {
    const result = processSectionData.summary({ ...base, about: 'Experienced engineer.' });
    expect(result.isEmpty).toBe(false);
    expect(result.content).toBe('Experienced engineer.');
  });

  it('has the correct section title', () => {
    expect(processSectionData.summary(base).title).toBe('Professional Summary');
  });
});

// ---------------------------------------------------------------------------
// processSectionData.employment
// ---------------------------------------------------------------------------

describe('processSectionData.employment', () => {
  it('is empty when the employment array is empty', () => {
    const result = processSectionData.employment(base);
    expect(result.isEmpty).toBe(true);
    expect(result.items).toEqual([]);
  });

  it('is not empty when employment has at least one entry', () => {
    const entry = { id: '1', jobTitle: 'Engineer', company: 'Acme' } as EmploymentItem;
    const result = processSectionData.employment({ ...base, employment: [entry] });
    expect(result.isEmpty).toBe(false);
    expect(result.items).toHaveLength(1);
  });

  it('has the correct section title', () => {
    expect(processSectionData.employment(base).title).toBe('Professional Experience');
  });
});

// ---------------------------------------------------------------------------
// processSectionData.skills
// ---------------------------------------------------------------------------

describe('processSectionData.skills', () => {
  it('filters out skills with an empty skillName', () => {
    const skills: SkillItem[] = [
      { id: '1', skillName: 'TypeScript' },
      { id: '2', skillName: '' },
      { id: '3', skillName: 'React' },
    ];
    const result = processSectionData.skills({ ...base, skills });
    expect(result.items).toHaveLength(2);
    expect(result.items.map((s) => (s as SkillItem).skillName)).toEqual(['TypeScript', 'React']);
  });

  it('is empty when the skills array is empty', () => {
    const result = processSectionData.skills(base);
    expect(result.isEmpty).toBe(true);
    expect(result.items).toEqual([]);
  });

  it('has displayType inline', () => {
    expect(processSectionData.skills(base).displayType).toBe('inline');
  });
});

// ---------------------------------------------------------------------------
// processSectionData.technologiesSkills
// ---------------------------------------------------------------------------

describe('processSectionData.technologiesSkills', () => {
  it('filters out technologies with an empty name', () => {
    const techs: TechSkillItem[] = [
      { id: '1', technologiesSkillName: 'Node.js' },
      { id: '2', technologiesSkillName: '' },
    ];
    const result = processSectionData.technologiesSkills({ ...base, technologiesSkills: techs });
    expect(result.items).toHaveLength(1);
    expect((result.items[0] as TechSkillItem).technologiesSkillName).toBe('Node.js');
  });

  it('is empty when the array is empty', () => {
    expect(processSectionData.technologiesSkills(base).isEmpty).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// processSectionData.hobbies
// ---------------------------------------------------------------------------

describe('processSectionData.hobbies', () => {
  it('filters out hobbies with an empty hobbyName', () => {
    const hobbies: HobbyItem[] = [
      { id: '1', hobbyName: 'Hiking' },
      { id: '2', hobbyName: '' },
      { id: '3', hobbyName: 'Reading' },
    ];
    const result = processSectionData.hobbies({ ...base, hobbies });
    expect(result.items).toHaveLength(2);
  });

  it('is empty when the array is empty', () => {
    expect(processSectionData.hobbies(base).isEmpty).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// processSectionData.custom
// ---------------------------------------------------------------------------

describe('processSectionData.custom', () => {
  it('reads entries from the correct dynamic key', () => {
    const formData: FormData = {
      ...base,
      ['customEntries_custom-1']: [{ id: '1', header: 'Award', subheader: '', description: '', bulletPoints: [] }],
    };
    const result = processSectionData.custom(formData, 'custom-1');
    expect(result.isEmpty).toBe(false);
    expect(result.items).toHaveLength(1);
  });

  it('is empty when no entries exist for the given section ID', () => {
    const result = processSectionData.custom(base, 'custom-1');
    expect(result.isEmpty).toBe(true);
    expect(result.items).toEqual([]);
  });
});
