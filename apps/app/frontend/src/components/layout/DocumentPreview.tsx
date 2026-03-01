import { useState, useEffect, useRef } from 'react';
import HarvardTemplate from '../resume/HarvardTemplate';
import type { FormData, SidebarItem } from '../../types/resume';
import { DOC_WIDTH, DOC_HEIGHT, DOC_PADDING, DOC_USABLE_HEIGHT } from '../../constants/document';

interface DocumentPreviewProps {
  formData: FormData;
  sidebarItems?: SidebarItem[];
}

const DocumentPreview = ({ formData, sidebarItems = [] }: DocumentPreviewProps) => {
  const [pages, setPages] = useState<number[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculatePages = () => {
      if (!contentRef.current) return;

      const contentHeight = contentRef.current.scrollHeight;

      if (contentHeight <= DOC_USABLE_HEIGHT) {
        setPages([1]);
      } else {
        const numberOfPages = Math.ceil(contentHeight / DOC_USABLE_HEIGHT);
        setPages(Array.from({ length: numberOfPages }, (_, i) => i + 1));
      }
    };

    const timeoutId = setTimeout(calculatePages, 100);
    return () => clearTimeout(timeoutId);
  }, [formData, sidebarItems]);

  const renderContent = () => (
    <div ref={contentRef}>
      <HarvardTemplate
        formData={formData}
        sidebarItems={sidebarItems}
      />
    </div>
  );

  return (
    <div style={{
      fontFamily: 'Times, "Times New Roman", serif',
      fontSize: '11pt',
      lineHeight: '1.2',
      color: '#000',
    }}>
      {pages.map((pageNum) => (
        <div key={pageNum} className="bg-white" style={{
          width: DOC_WIDTH,
          height: DOC_HEIGHT,
          padding: DOC_PADDING,
          pageBreakAfter: pageNum < pages.length ? 'always' : 'avoid',
          overflow: 'hidden',
          position: 'relative',
        }}>
          <div style={{
            height: '100%',
            overflow: 'hidden',
            transform: `translateY(-${(pageNum - 1) * DOC_USABLE_HEIGHT}px)`,
          }}>
            {pageNum === 1 ? renderContent() : null}
          </div>
        </div>
      ))}

      <div style={{
        position: 'absolute',
        left: '-9999px',
        width: DOC_WIDTH,
        padding: DOC_PADDING,
      }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default DocumentPreview;
