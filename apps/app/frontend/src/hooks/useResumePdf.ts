import { useCallback, useEffect, useRef, useState } from 'react';
import type { ResumeDocumentModel } from '../pdf/resumeDocumentModel';
import {
  downloadResumePdfBlob,
  ResumePdfArtifactController,
  type ResumePdfArtifact,
  type ResumePdfGenerator,
  resumeDownloadFilename,
} from '../pdf/resumePdfArtifactController';

export type ResumePdfStatus = 'idle' | 'generating' | 'ready' | 'error';

export interface ResumePdfController {
  previewBlob: Blob | null;
  status: ResumePdfStatus;
  error: Error | null;
  downloadLatest: () => Promise<void>;
}

export interface UseResumePdfOptions {
  /** Debounced model used for automatic preview refreshes. */
  previewModel: ResumeDocumentModel;
  /** Immediate model used when the user presses Download. */
  latestModel: ResumeDocumentModel;
  /** Dependency injection is used only by focused controller tests. */
  generate?: ResumePdfGenerator;
  download?: (blob: Blob, filename: string) => void;
}

interface ResumePdfState {
  previewBlob: Blob | null;
  status: ResumePdfStatus;
  error: Error | null;
}

const initialState: ResumePdfState = {
  previewBlob: null,
  status: 'idle',
  error: null,
};

const generateResumePdf: ResumePdfGenerator = async (model) => {
  const { generateResumePdfBlob } = await import('../pdf/generateResumePdf');
  return generateResumePdfBlob(model);
};

function asError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

/**
 * Shares one browser-only PDF artifact between the live preview and download.
 * The caller keeps the existing 300 ms form debounce for `previewModel`; this
 * hook deliberately never schedules a second debounce or sends resume data to
 * the backend.
 */
export function useResumePdf({
  previewModel,
  latestModel,
  generate = generateResumePdf,
  download = downloadResumePdfBlob,
}: UseResumePdfOptions): ResumePdfController {
  const [state, setState] = useState<ResumePdfState>(initialState);
  const latestModelRef = useRef(latestModel);
  const visibleArtifactRef = useRef<ResumePdfArtifact | null>(null);
  const previewOperationRef = useRef(0);
  const generatorRef = useRef<ResumePdfGenerator | null>(null);
  const artifactsRef = useRef<ResumePdfArtifactController | null>(null);

  latestModelRef.current = latestModel;

  if (generatorRef.current !== generate || artifactsRef.current === null) {
    generatorRef.current = generate;
    artifactsRef.current = new ResumePdfArtifactController(generate);
  }

  const artifacts = artifactsRef.current;

  const promote = useCallback((model: ResumeDocumentModel, blob: Blob) => {
    const artifact = artifacts.remember(model, blob);
    visibleArtifactRef.current = artifact;
    setState({ previewBlob: blob, status: 'ready', error: null });
  }, [artifacts]);

  useEffect(() => {
    const visibleArtifact = visibleArtifactRef.current;
    if (visibleArtifact?.revision === previewModel.revision) {
      setState({ previewBlob: visibleArtifact.blob, status: 'ready', error: null });
      return;
    }

    const operation = ++previewOperationRef.current;
    let disposed = false;
    setState((previous) => ({ ...previous, status: 'generating', error: null }));

    void artifacts.getArtifact(previewModel)
      .then((blob) => {
        // An edit made during generation owns the next preview. Do not flash an
        // older PDF over the last valid one while the 300 ms debounce settles.
        if (
          disposed
          || operation !== previewOperationRef.current
          || previewModel.revision !== latestModelRef.current.revision
        ) {
          return;
        }

        promote(previewModel, blob);
      })
      .catch((error: unknown) => {
        if (
          disposed
          || operation !== previewOperationRef.current
          || previewModel.revision !== latestModelRef.current.revision
        ) {
          return;
        }

        setState((previous) => ({
          ...previous,
          status: 'error',
          error: asError(error),
        }));
      });

    return () => {
      disposed = true;
    };
  }, [artifacts, previewModel, promote]);

  const downloadLatest = useCallback(async () => {
    // Invalidate any old preview completion before downloading an immediate
    // (non-debounced) model.
    previewOperationRef.current += 1;

    setState((previous) => ({ ...previous, status: 'generating', error: null }));

    // A click starts from the immediate model, not the debounced preview. If
    // the user edits while generation is in flight, discard that now-stale
    // result and continue with the newest model before downloading anything.
    for (;;) {
      const model = latestModelRef.current;

      try {
        const blob = await artifacts.getArtifact(model);

        if (model.revision !== latestModelRef.current.revision) {
          continue;
        }

        promote(model, blob);
        download(blob, resumeDownloadFilename(model));
        return;
      } catch (error) {
        // A failed generation for an obsolete edit must not block the newest
        // form from being rendered and downloaded.
        if (model.revision !== latestModelRef.current.revision) {
          continue;
        }

        const normalizedError = asError(error);
        setState((previous) => ({
          ...previous,
          status: 'error',
          error: normalizedError,
        }));
        throw normalizedError;
      }
    }
  }, [artifacts, download, promote]);

  return {
    previewBlob: state.previewBlob,
    status: state.status,
    error: state.error,
    downloadLatest,
  };
}
