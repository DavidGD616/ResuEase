import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { DOC_WIDTH } from '../constants/document';

// This must remain in the same lazy-loaded module as Document and Page.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export interface ResumePdfViewerProps {
  blob: Blob | null;
  currentPage: number;
  onPageCountChange: (pageCount: number) => void;
}

interface PdfDocumentLoadResult {
  numPages: number;
}

/**
 * Renders one page from the generated resume PDF at the existing A4 preview size.
 * Consumers should dynamically import this module so PDF.js stays out of the
 * initial application bundle.
 */
function ResumePdfViewer({ blob, currentPage, onPageCountChange }: ResumePdfViewerProps) {
  if (!blob) {
    return null;
  }

  const handleLoadSuccess = ({ numPages }: PdfDocumentLoadResult) => {
    onPageCountChange(numPages);
  };

  return (
    <Document
      file={blob}
      onLoadSuccess={handleLoadSuccess}
      loading={null}
      error={null}
      noData={null}
    >
      <Page
        pageNumber={currentPage}
        width={DOC_WIDTH}
        renderAnnotationLayer
        renderTextLayer
        loading={null}
        error={null}
        noData={null}
      />
    </Document>
  );
}

export default ResumePdfViewer;
