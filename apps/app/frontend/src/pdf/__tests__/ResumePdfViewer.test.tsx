import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import type { ReactNode } from 'react';

type MockDocumentProps = {
  children?: ReactNode;
  error?: ReactNode;
  file?: Blob | null;
  loading?: ReactNode;
  noData?: ReactNode;
  onLoadSuccess?: (document: { numPages: number }) => void;
};

type MockPageProps = {
  error?: ReactNode;
  loading?: ReactNode;
  noData?: ReactNode;
  pageNumber?: number;
  renderAnnotationLayer?: boolean;
  renderTextLayer?: boolean;
  width?: number;
};

const { documentMock, pageMock, pdfjsMock } = vi.hoisted(() => ({
  documentMock: vi.fn(),
  pageMock: vi.fn(),
  pdfjsMock: { GlobalWorkerOptions: {} as { workerSrc?: string } },
}));

vi.mock('react-pdf', () => ({
  pdfjs: pdfjsMock,
  Document: (props: MockDocumentProps) => {
    documentMock(props);
    props.onLoadSuccess?.({ numPages: 3 });
    return props.children;
  },
  Page: (props: MockPageProps) => {
    pageMock(props);
    return null;
  },
}));

const { default: ResumePdfViewer } = await import('../ResumePdfViewer');

describe('ResumePdfViewer', () => {
  afterEach(() => {
    cleanup();
    documentMock.mockClear();
    pageMock.mockClear();
  });

  it('renders nothing until a generated PDF Blob is available', () => {
    const onPageCountChange = vi.fn();
    const { container } = render(
      <ResumePdfViewer blob={null} currentPage={1} onPageCountChange={onPageCountChange} />,
    );

    expect(container.firstChild).toBeNull();
    expect(documentMock).not.toHaveBeenCalled();
    expect(pageMock).not.toHaveBeenCalled();
    expect(onPageCountChange).not.toHaveBeenCalled();
  });

  it('renders the selected page from the same Blob and reports the page count', () => {
    const blob = new Blob(['%PDF-1.7'], { type: 'application/pdf' });
    const onPageCountChange = vi.fn();

    render(
      <ResumePdfViewer blob={blob} currentPage={2} onPageCountChange={onPageCountChange} />,
    );

    expect(documentMock).toHaveBeenCalledWith(expect.objectContaining({
      file: blob,
      loading: null,
      error: null,
      noData: null,
    }));
    expect(pageMock).toHaveBeenCalledWith(expect.objectContaining({
      pageNumber: 2,
      width: 794,
      renderAnnotationLayer: true,
      renderTextLayer: true,
      loading: null,
      error: null,
      noData: null,
    }));
    expect(onPageCountChange).toHaveBeenCalledWith(3);
  });

  it('configures the PDF.js worker from the viewer module', () => {
    expect(pdfjsMock.GlobalWorkerOptions.workerSrc).toContain('pdf.worker.min.mjs');
  });
});
