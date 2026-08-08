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
  onRenderSuccess?: () => void;
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

  it('keeps the A4 geometry empty until a generated PDF Blob is available', () => {
    const onPageCountChange = vi.fn();
    const { container } = render(
      <ResumePdfViewer blob={null} currentPage={1} onPageCountChange={onPageCountChange} />,
    );

    expect(container.firstChild).toHaveStyle({ width: '794px', height: '1123px' });
    expect(container.firstChild?.childNodes).toHaveLength(0);
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

  it('keeps the painted Blob visible until the replacement page renders', async () => {
    const firstBlob = new Blob(['first'], { type: 'application/pdf' });
    const nextBlob = new Blob(['next'], { type: 'application/pdf' });
    const onPageCountChange = vi.fn();
    const { container, rerender } = render(
      <ResumePdfViewer blob={firstBlob} currentPage={1} onPageCountChange={onPageCountChange} />,
    );

    const firstRender = pageMock.mock.calls[0]?.[0] as MockPageProps;
    firstRender.onRenderSuccess?.();

    rerender(
      <ResumePdfViewer blob={nextBlob} currentPage={1} onPageCountChange={onPageCountChange} />,
    );

    await vi.waitFor(() => expect(documentMock).toHaveBeenCalledWith(expect.objectContaining({ file: nextBlob })));
    const layersBeforePaint = container.querySelectorAll(':scope > div > div');
    expect(layersBeforePaint).toHaveLength(2);
    expect((layersBeforePaint[0] as HTMLDivElement).style.opacity).toBe('1');
    expect((layersBeforePaint[1] as HTMLDivElement).style.opacity).toBe('0');

    const nextRender = pageMock.mock.calls[pageMock.mock.calls.length - 1]?.[0] as MockPageProps;
    nextRender.onRenderSuccess?.();

    await vi.waitFor(() => expect(container.querySelectorAll(':scope > div > div')).toHaveLength(1));
    const visibleLayer = container.querySelector(':scope > div > div') as HTMLDivElement;
    expect(visibleLayer.style.opacity).toBe('1');
  });
});
