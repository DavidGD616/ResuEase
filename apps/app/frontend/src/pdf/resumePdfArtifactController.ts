import type { ResumeDocumentModel } from './resumeDocumentModel';

export interface ResumePdfArtifact {
  revision: string;
  blob: Blob;
}

export type ResumePdfGenerator = (model: ResumeDocumentModel) => Promise<Blob>;

/**
 * Keeps successful browser-generated artifacts separate from React state.
 *
 * Calls for the same document revision share one promise, so a preview refresh
 * and a download click can never render two different copies of the same
 * resume. A small LRU cache also lets a download reuse the visible artifact.
 */
export class ResumePdfArtifactController {
  private readonly cache = new Map<string, Blob>();
  private readonly inFlight = new Map<string, Promise<Blob>>();

  constructor(
    private readonly generate: ResumePdfGenerator,
    private readonly cacheLimit = 8,
  ) {}

  getCached(model: ResumeDocumentModel): Blob | undefined {
    const blob = this.cache.get(model.revision);
    if (!blob) return undefined;

    // Refresh its LRU position.
    this.cache.delete(model.revision);
    this.cache.set(model.revision, blob);
    return blob;
  }

  async getArtifact(model: ResumeDocumentModel): Promise<Blob> {
    const cached = this.getCached(model);
    if (cached) return cached;

    const pending = this.inFlight.get(model.revision);
    if (pending) return pending;

    const task = this.generate(model).then((blob) => {
      this.remember(model, blob);
      return blob;
    });

    this.inFlight.set(model.revision, task);

    try {
      return await task;
    } finally {
      if (this.inFlight.get(model.revision) === task) {
        this.inFlight.delete(model.revision);
      }
    }
  }

  remember(model: ResumeDocumentModel, blob: Blob): ResumePdfArtifact {
    this.cache.delete(model.revision);
    this.cache.set(model.revision, blob);

    while (this.cache.size > this.cacheLimit) {
      const oldestRevision = this.cache.keys().next().value;
      if (typeof oldestRevision !== 'string') break;
      this.cache.delete(oldestRevision);
    }

    return { revision: model.revision, blob };
  }
}

export function resumeDownloadFilename(model: ResumeDocumentModel): string {
  const [firstName = '', ...lastNameParts] = model.header.fullName.split(' ').filter(Boolean);
  const safeFirstName = firstName || 'resume';
  const safeLastName = lastNameParts.join(' ') || 'document';

  return `${safeFirstName}_${safeLastName}_resume.pdf`;
}

/** Download and revoke the temporary browser URL once the click is dispatched. */
export function downloadResumePdfBlob(blob: Blob, filename: string): void {
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = downloadUrl;
  link.download = filename;
  document.body.appendChild(link);

  try {
    link.click();
  } finally {
    link.remove();
    window.setTimeout(() => window.URL.revokeObjectURL(downloadUrl), 0);
  }
}
