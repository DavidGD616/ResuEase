import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { DOC_HEIGHT, DOC_WIDTH } from '../constants/document';

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

interface PdfLayer {
  id: number;
  blob: Blob;
}

/**
 * Renders one page from the generated resume PDF at the existing A4 preview size.
 * Consumers should dynamically import this module so PDF.js stays out of the
 * initial application bundle. The previous painted layer remains visible until
 * PDF.js has rendered the next Blob, preventing a white-card flicker.
 */
function ResumePdfViewer({ blob, currentPage, onPageCountChange }: ResumePdfViewerProps) {
  const nextLayerId = useRef(0);
  const latestLayerId = useRef(blob ? 0 : -1);
  const [visibleLayerId, setVisibleLayerId] = useState<number | null>(blob ? 0 : null);
  const [layers, setLayers] = useState<PdfLayer[]>(() => (
    blob ? [{ id: 0, blob }] : []
  ));

  useEffect(() => {
    if (!blob || layers.some((layer) => layer.blob === blob)) return;

    const id = ++nextLayerId.current;
    latestLayerId.current = id;

    setLayers((previous) => [
      ...previous.filter((layer) => layer.id === visibleLayerId),
      { id, blob },
    ]);
  }, [blob, layers, visibleLayerId]);

  const handleLoadSuccess = ({ numPages }: PdfDocumentLoadResult) => {
    onPageCountChange(numPages);
  };

  return (
    <div style={{ position: 'relative', width: DOC_WIDTH, height: DOC_HEIGHT }}>
      {layers.map((layer) => (
        <div
          key={layer.id}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: layer.id === visibleLayerId ? 1 : 0,
            pointerEvents: layer.id === visibleLayerId ? 'auto' : 'none',
          }}
        >
          <Document
            file={layer.blob}
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
              onRenderSuccess={() => {
                if (layer.id !== latestLayerId.current) return;
                setVisibleLayerId(layer.id);
                setLayers((previous) => previous.filter((candidate) => candidate.id === layer.id));
              }}
            />
          </Document>
        </div>
      ))}
    </div>
  );
}

export default ResumePdfViewer;
