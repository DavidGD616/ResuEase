import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  multiPageEnglishResumeFixture,
  multiPageSpanishResumeFixture,
  onePageEnglishResumeFixture,
  type ResumePdfFixture,
} from '../__fixtures__/resumeFixtures';
import { buildResumeDocumentModel, type ResumeDocumentModel } from '../resumeDocumentModel';

let generateResumePdfBlob: typeof import('../generateResumePdf')['generateResumePdfBlob'];

interface RenderedPdf {
  bytes: Uint8Array;
  document: Awaited<ReturnType<typeof pdfjs.getDocument>>['promise'] extends Promise<infer Document> ? Document : never;
  fixtureId: string;
  loadingTask: ReturnType<typeof pdfjs.getDocument>;
  model: ResumeDocumentModel;
}

const renderedPdfs = new Map<string, RenderedPdf>();

async function renderFixture(fixture: ResumePdfFixture): Promise<RenderedPdf> {
  const model = buildResumeDocumentModel(fixture.formData, fixture.sidebarItems, fixture.locale);
  const blob = await generateResumePdfBlob(model);
  const bytes = new Uint8Array(await blob.arrayBuffer());
  // PDF.js can transfer its input buffer to a worker/fake worker. Keep the
  // original bytes intact so the test can also inspect the embedded font data.
  const loadingTask = pdfjs.getDocument({ data: bytes.slice(), verbosity: pdfjs.VerbosityLevel.ERRORS });

  return {
    bytes,
    document: await loadingTask.promise,
    fixtureId: fixture.id,
    loadingTask,
    model,
  };
}

async function extractDocumentText(document: RenderedPdf['document']): Promise<string> {
  const textPages = await Promise.all(
    Array.from({ length: document.numPages }, async (_, offset) => {
      const page = await document.getPage(offset + 1);
      const content = await page.getTextContent();

      return content.items
        .map((item) => ('str' in item ? item.str : ''))
        .join(' ');
    }),
  );

  return textPages.join('\n');
}

async function extractLinkUrls(document: RenderedPdf['document']): Promise<string[]> {
  const pages = await Promise.all(
    Array.from({ length: document.numPages }, (_, offset) => document.getPage(offset + 1)),
  );
  const annotations = (await Promise.all(pages.map((page) => page.getAnnotations()))).flat();

  return annotations
    .filter((annotation) => annotation.subtype === 'Link')
    .flatMap((annotation) => [annotation.url, annotation.unsafeUrl])
    .filter((url): url is string => typeof url === 'string');
}

function expectTextInOrder(text: string, markers: string[]) {
  let previousIndex = -1;

  for (const marker of markers) {
    const index = text.indexOf(marker);
    expect(index, `Expected PDF text to contain "${marker}"`).toBeGreaterThan(previousIndex);
    previousIndex = index;
  }
}

beforeAll(async () => {
  ({ generateResumePdfBlob } = await import('../generateResumePdf'));

  const results = await Promise.all([
    renderFixture(onePageEnglishResumeFixture),
    renderFixture(multiPageEnglishResumeFixture),
    renderFixture(multiPageSpanishResumeFixture),
  ]);

  for (const rendered of results) {
    renderedPdfs.set(rendered.fixtureId, rendered);
  }
}, 60_000);

afterAll(async () => {
  await Promise.all([...renderedPdfs.values()].map(async ({ document, loadingTask }) => {
    await document.destroy();
    await loadingTask.destroy();
  }));
});

describe('generateResumePdfBlob', () => {
  it('creates the compact English fixture as a single, link-bearing PDF', async () => {
    const rendered = renderedPdfs.get(onePageEnglishResumeFixture.id);
    if (!rendered) throw new Error('One-page English fixture did not render');

    expect(rendered.document.numPages).toBe(1);

    const text = await extractDocumentText(rendered.document);
    expectTextInOrder(text, [
      'ALEX MORGAN',
      'PROFESSIONAL SUMMARY',
      'PROFESSIONAL EXPERIENCE',
      'SKILLS',
    ]);

    const urls = await extractLinkUrls(rendered.document);
    expect(urls).toEqual(expect.arrayContaining([
      'mailto:alex.morgan@example.com',
      'tel:+14155550136',
    ]));
  });

  it('creates a multi-page English PDF with correct metadata, content order, and safe links', async () => {
    const rendered = renderedPdfs.get(multiPageEnglishResumeFixture.id);
    if (!rendered) throw new Error('English fixture did not render');

    expect(rendered.bytes.byteLength).toBeGreaterThan(20_000);
    expect(rendered.document.numPages).toBeGreaterThanOrEqual(multiPageEnglishResumeFixture.expectedMinimumPages);

    const metadata = await rendered.document.getMetadata();
    expect(metadata.info).toMatchObject({
      Title: rendered.model.metadata.title,
      Author: rendered.model.metadata.author,
      Creator: 'ResuEase',
      Producer: 'ResuEase',
    });

    const text = await extractDocumentText(rendered.document);
    expectTextInOrder(text, [
      'TAYLOR BENNETT',
      'PROJECTS',
      'PROFESSIONAL SUMMARY',
      'COMMUNITY LEADERSHIP',
      'PROFESSIONAL EXPERIENCE',
      'EDUCATION',
      'INTERNSHIP EXPERIENCE',
      'PORTFOLIO & LINKS',
      'REFERENCES',
      'LANGUAGES, CERTIFICATIONS, SKILLS, TECHNOLOGIES & INTERESTS',
    ]);
    expect(text).toContain('Accessible Service Blueprint Kit');

    const urls = await extractLinkUrls(rendered.document);
    expect(urls).toEqual(expect.arrayContaining([
      'https://taylor-bennett.example.com/work?source=resume&campaign=2026',
      'https://github.com/taylorbennett/service-blueprint-kit',
      'https://taylor-bennett.example.com/case-studies/clinical-operations-platform',
      'mailto:jordan.lee@example.com',
      'tel:+12125550123',
    ]));
  });

  it('retains Spanish Unicode and embeds Liberation Serif in the generated PDF', async () => {
    const rendered = renderedPdfs.get(multiPageSpanishResumeFixture.id);
    if (!rendered) throw new Error('Spanish fixture did not render');

    expect(rendered.document.numPages).toBeGreaterThanOrEqual(multiPageSpanishResumeFixture.expectedMinimumPages);

    const text = await extractDocumentText(rendered.document);
    expectTextInOrder(text, [
      'LUCÍA HERNÁNDEZ NÚÑEZ',
      'PROYECTOS',
      'RESUMEN PROFESIONAL',
      'LIDERAZGO COMUNITARIO',
      'EXPERIENCIA LABORAL',
      'EDUCACIÓN',
      'PRÁCTICAS PROFESIONALES',
      'PORTAFOLIO Y VÍNCULOS',
      'REFERENCIAS',
      'IDIOMAS, CERTIFICACIONES, HABILIDADES, TECNOLOGÍAS & INTERESES',
    ]);
    expect(text).toContain('Coalición Calles Abiertas');
    expect(text).toContain('español');

    // React-PDF subsets embedded fonts, so the name can carry a six-character
    // subset prefix. The descriptor must still preserve Liberation Serif.
    const rawPdf = new TextDecoder('latin1').decode(rendered.bytes);
    expect(rawPdf).toMatch(/\/BaseFont\s*\/[A-Z]{6}\+LiberationSerif(?:-Bold|-Italic|-BoldItalic)?/);
  });
});
