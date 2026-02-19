import { useState, useEffect, useRef } from 'react';
import HarvardTemplate from '../resume/HarvardTemplate';
import type { FormData, SidebarItem } from '../../types/resume';

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

      const pageHeight = 11 * 96 - 0.5 * 2 * 96;
      const content = contentRef.current;
      const contentHeight = content.scrollHeight;

      if (contentHeight <= pageHeight) {
        setPages([1]);
      } else {
        const numberOfPages = Math.ceil(contentHeight / pageHeight);
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
          width: '8.5in',
          height: '11in',
          padding: '0.5in',
          pageBreakAfter: pageNum < pages.length ? 'always' : 'avoid',
          overflow: 'hidden',
          position: 'relative',
        }}>
          <div style={{
            height: '100%',
            overflow: 'hidden',
            transform: `translateY(-${(pageNum - 1) * (11 * 96 - 0.5 * 2 * 96)}px)`,
          }}>
            {pageNum === 1 ? renderContent() : null}
          </div>
        </div>
      ))}

      <div style={{
        position: 'absolute',
        left: '-9999px',
        width: '8.5in',
        padding: '0.5in',
      }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default DocumentPreview;
