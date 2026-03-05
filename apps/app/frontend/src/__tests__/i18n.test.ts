import { describe, it, expect, afterEach } from 'vitest';
import i18n from '../i18n';

describe('i18n configuration', () => {
  afterEach(async () => {
    await i18n.changeLanguage('en');
  });

  it('fallback language is en', () => {
    expect(i18n.options.fallbackLng).toContain('en');
  });

  it('supported languages include en and es', () => {
    expect(i18n.options.supportedLngs).toContain('en');
    expect(i18n.options.supportedLngs).toContain('es');
  });

  it('uses languageOnly load option to strip region codes', () => {
    expect(i18n.options.load).toBe('languageOnly');
  });

  it('localStorage detection key is resuease_lang', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const detection = i18n.options.detection as any;
    expect(detection.lookupLocalStorage).toBe('resuease_lang');
  });

  it('translates keys correctly in English', async () => {
    await i18n.changeLanguage('en');
    expect(i18n.t('nav.download')).toBe('Download');
    expect(i18n.t('auth.title')).toBe('Welcome to ResuEase');
    expect(i18n.t('status.saving')).toBe('Saving...');
    expect(i18n.t('status.saved')).toBe('Saved');
    expect(i18n.t('sidebar.employmentHistory')).toBe('Employment history');
  });

  it('translates keys correctly in Spanish', async () => {
    await i18n.changeLanguage('es');
    expect(i18n.t('nav.download')).toBe('Descargar');
    expect(i18n.t('auth.title')).toBe('Bienvenido a ResuEase');
    expect(i18n.t('status.saving')).toBe('Guardando...');
    expect(i18n.t('status.saved')).toBe('Guardado');
    expect(i18n.t('sidebar.employmentHistory')).toBe('Experiencia laboral');
  });

  it('falls back to English for unsupported locale', async () => {
    await i18n.changeLanguage('fr');
    expect(i18n.t('nav.download')).toBe('Download');
  });

  it('supports interpolation for keys with variables', async () => {
    await i18n.changeLanguage('en');
    expect(i18n.t('reorder.deleteTitle', { sectionLabel: 'Skills' })).toBe('Delete Skills?');

    await i18n.changeLanguage('es');
    expect(i18n.t('reorder.deleteTitle', { sectionLabel: 'Habilidades' })).toBe('¿Eliminar Habilidades?');
  });
});
