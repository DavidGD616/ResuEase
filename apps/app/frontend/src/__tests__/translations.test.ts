import { describe, it, expect } from 'vitest';
import en from '../locales/en.json';
import es from '../locales/es.json';

// Keys where English and Spanish values are legitimately identical
// (brand names, proper nouns, universal strings)
const ALLOWED_SAME = new Set([
  'nav.brand',
  'forms.technologies.skillNamePlaceholder',  // "React" is universal
  'forms.custom.entrySubheaderPlaceholder',   // "Isaac Asimov" is a proper noun
  'forms.education.dateRangePlaceholder',      // "Feb 2018 - Jun 2022" month abbrevs overlap
  'forms.employment.endDatePlaceholder',       // "Feb 2019"
  'forms.employment.companyPlaceholder',       // "Apple Inc."
  'forms.references.referentCompanyPlaceholder', // "Apple Inc."
  'forms.internships.companyPlaceholder',      // "Apple Inc."
  'forms.internships.startDatePlaceholder',    // "Jun 2020"
  'forms.links.url',                           // "URL" is a universal acronym
]);

type JsonObject = { [key: string]: JsonValue };
type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];

function collectLeafKeys(obj: JsonObject, prefix = ''): string[] {
  const keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...collectLeafKeys(value as JsonObject, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

describe('Translation file parity', () => {
  const enKeys = collectLeafKeys(en as JsonObject);
  const esKeys = collectLeafKeys(es as JsonObject);
  const enKeySet = new Set(enKeys);
  const esKeySet = new Set(esKeys);

  it('es.json has the same number of keys as en.json', () => {
    expect(esKeys.length).toBe(enKeys.length);
  });

  it('es.json contains all keys from en.json', () => {
    const missingFromEs = enKeys.filter(k => !esKeySet.has(k));
    expect(missingFromEs).toEqual([]);
  });

  it('en.json contains all keys from es.json (no extra keys in es)', () => {
    const extraInEs = esKeys.filter(k => !enKeySet.has(k));
    expect(extraInEs).toEqual([]);
  });
});

describe('Spanish translation completeness', () => {
  const enFlat = en as JsonObject;
  const esFlat = es as JsonObject;

  function getNestedValue(obj: JsonObject, keyPath: string): string | undefined {
    const parts = keyPath.split('.');
    let current: JsonValue = obj;
    for (const part of parts) {
      if (current === null || typeof current !== 'object' || Array.isArray(current)) return undefined;
      current = (current as JsonObject)[part];
    }
    return typeof current === 'string' ? current : undefined;
  }

  const enKeys = collectLeafKeys(enFlat);

  it('es.json has no empty string values', () => {
    const emptyKeys = enKeys.filter(key => {
      const esVal = getNestedValue(esFlat, key);
      return esVal === '';
    });
    expect(emptyKeys).toEqual([]);
  });

  it('es.json has no untranslated values (except whitelisted keys)', () => {
    const forgottenKeys = enKeys.filter(key => {
      if (ALLOWED_SAME.has(key)) return false;
      const enVal = getNestedValue(enFlat, key);
      const esVal = getNestedValue(esFlat, key);
      return enVal !== undefined && esVal !== undefined && enVal === esVal;
    });
    expect(forgottenKeys).toEqual([]);
  });
});
