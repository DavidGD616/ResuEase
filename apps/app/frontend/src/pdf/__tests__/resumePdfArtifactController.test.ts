import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ResumeDocumentModel } from '../resumeDocumentModel';
import {
  downloadResumePdfBlob,
  ResumePdfArtifactController,
  resumeDownloadFilename,
} from '../resumePdfArtifactController';
import { useResumePdf } from '../../hooks/useResumePdf';

function model(revision: string, fullName = 'Ada Lovelace'): ResumeDocumentModel {
  return {
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
      title: `Resume - ${fullName}`,
      author: fullName,
      creator: 'ResuEase',
      producer: 'ResuEase',
      language: 'en',
    },
    header: { fullName, contact: {} },
    sections: [],
    revision,
  };
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

describe('ResumePdfArtifactController', () => {
  it('coalesces identical generation requests and reuses the successful Blob', async () => {
    const generated = deferred<Blob>();
    const generate = vi.fn(() => generated.promise);
    const controller = new ResumePdfArtifactController(generate);
    const document = model('same');

    const first = controller.getArtifact(document);
    const second = controller.getArtifact(document);
    expect(generate).toHaveBeenCalledTimes(1);

    const blob = new Blob(['first']);
    generated.resolve(blob);

    await expect(first).resolves.toBe(blob);
    await expect(second).resolves.toBe(blob);
    await expect(controller.getArtifact(document)).resolves.toBe(blob);
    expect(generate).toHaveBeenCalledTimes(1);
  });

  it('does not cache errors, so a later request can retry generation', async () => {
    const generate = vi
      .fn<() => Promise<Blob>>()
      .mockRejectedValueOnce(new Error('render failed'))
      .mockResolvedValueOnce(new Blob(['retry']));
    const controller = new ResumePdfArtifactController(generate);
    const document = model('retry');

    await expect(controller.getArtifact(document)).rejects.toThrow('render failed');
    await expect(controller.getArtifact(document)).resolves.toEqual(new Blob(['retry']));
    expect(generate).toHaveBeenCalledTimes(2);
  });
});

describe('browser download cleanup', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('uses the existing resume filename convention and revokes its temporary URL', () => {
    const createObjectURL = vi.fn(() => 'blob:resume');
    const revokeObjectURL = vi.fn();
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
    Object.defineProperty(window.URL, 'createObjectURL', { configurable: true, value: createObjectURL });
    Object.defineProperty(window.URL, 'revokeObjectURL', { configurable: true, value: revokeObjectURL });

    const document = model('download', 'Ada Byron Lovelace');
    expect(resumeDownloadFilename(document)).toBe('Ada_Byron Lovelace_resume.pdf');

    downloadResumePdfBlob(new Blob(['pdf']), 'Ada_Byron Lovelace_resume.pdf');
    expect(click).toHaveBeenCalledOnce();
    expect(createObjectURL).toHaveBeenCalledOnce();

    act(() => vi.runAllTimers());
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:resume');
  });
});

describe('useResumePdf', () => {
  it('keeps the last good preview while rejecting a stale completion from an older edit', async () => {
    const first = deferred<Blob>();
    const second = deferred<Blob>();
    const generate = vi.fn((document: ResumeDocumentModel) => (
      document.revision === 'first' ? first.promise : second.promise
    ));
    const firstModel = model('first');
    const secondModel = model('second');

    const { result, rerender } = renderHook(
      ({ previewModel, latestModel }) => useResumePdf({ previewModel, latestModel, generate }),
      { initialProps: { previewModel: firstModel, latestModel: firstModel } },
    );

    await waitFor(() => expect(generate).toHaveBeenCalledWith(firstModel));
    rerender({ previewModel: firstModel, latestModel: secondModel });

    await act(async () => first.resolve(new Blob(['old'])));
    expect(result.current.previewBlob).toBeNull();

    rerender({ previewModel: secondModel, latestModel: secondModel });
    await waitFor(() => expect(generate).toHaveBeenCalledWith(secondModel));

    const latestBlob = new Blob(['new']);
    await act(async () => second.resolve(latestBlob));
    await waitFor(() => expect(result.current.previewBlob).toBe(latestBlob));
    expect(result.current.status).toBe('ready');
  });

  it('generates the latest non-debounced model for download and promotes that same Blob', async () => {
    const previewBlob = new Blob(['preview']);
    const downloadBlob = new Blob(['download']);
    const generate = vi.fn((document: ResumeDocumentModel) => Promise.resolve(
      document.revision === 'preview' ? previewBlob : downloadBlob,
    ));
    const download = vi.fn();
    const previewModel = model('preview');
    const latestModel = model('latest');

    const { result } = renderHook(() => useResumePdf({
      previewModel,
      latestModel,
      generate,
      download,
    }));

    await act(async () => result.current.downloadLatest());

    expect(generate).toHaveBeenCalledWith(latestModel);
    expect(result.current.previewBlob).toBe(downloadBlob);
    expect(download).toHaveBeenCalledWith(downloadBlob, 'Ada_Lovelace_resume.pdf');
  });

  it('retains the prior valid preview and never downloads when generation fails', async () => {
    const firstBlob = new Blob(['first']);
    const generate = vi
      .fn<(document: ResumeDocumentModel) => Promise<Blob>>()
      .mockResolvedValueOnce(firstBlob)
      .mockRejectedValueOnce(new Error('generation failed'));
    const download = vi.fn();
    const firstModel = model('first');
    const failedModel = model('failed');

    const { result, rerender } = renderHook(
      ({ previewModel, latestModel }) => useResumePdf({ previewModel, latestModel, generate, download }),
      { initialProps: { previewModel: firstModel, latestModel: firstModel } },
    );

    await waitFor(() => expect(result.current.previewBlob).toBe(firstBlob));
    rerender({ previewModel: failedModel, latestModel: failedModel });

    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current.previewBlob).toBe(firstBlob);
    expect(download).not.toHaveBeenCalled();
  });
});
