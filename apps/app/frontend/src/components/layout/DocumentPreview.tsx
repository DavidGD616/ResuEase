import { lazy, Suspense } from 'react';
import { DOC_HEIGHT, DOC_WIDTH } from '../../constants/document';

const ResumePdfViewer = lazy(() => import('../../pdf/ResumePdfViewer'));

interface DocumentPreviewProps {
  previewBlob: Blob | null;
  currentPage: number;
  onPageCountChange: (count: number) => void;
}

const DocumentPreview = ({ previewBlob, currentPage, onPageCountChange }: DocumentPreviewProps) => {
  return (
    <div style={{
      width: DOC_WIDTH,
      height: DOC_HEIGHT,
      fontFamily: 'Times, "Times New Roman", serif',
      fontSize: '11pt',
      lineHeight: '1.2',
      color: '#000',
    }}>
      <Suspense fallback={null}>
        <ResumePdfViewer
          blob={previewBlob}
          currentPage={currentPage}
          onPageCountChange={onPageCountChange}
        />
      </Suspense>
    </div>
  );
};

export default DocumentPreview;
