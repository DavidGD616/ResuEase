import { pdf } from '@react-pdf/renderer';
import { HarvardPdfDocument } from './HarvardPdfDocument';
import type { ResumeDocumentModel } from './resumeDocumentModel';

/**
 * Produces the browser PDF artifact from the renderer-independent model.
 * This intentionally has no caching or lifecycle logic; useResumePdf owns
 * debouncing, stale-result handling, and blob reuse.
 */
export function generateResumePdfBlob(model: ResumeDocumentModel): Promise<Blob> {
  return pdf(HarvardPdfDocument({ model })).toBlob();
}
