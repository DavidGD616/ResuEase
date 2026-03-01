import { useEffect, useRef } from 'react';
import HarvardTemplate from '../resume/HarvardTemplate';
import type { FormData, SidebarItem } from '../../types/resume';
import { DOC_WIDTH, DOC_HEIGHT, DOC_PADDING, DOC_USABLE_HEIGHT } from '../../constants/document';

interface DocumentPreviewProps {
  formData: FormData;
  sidebarItems?: SidebarItem[];
  currentPage: number;
  onPageCountChange: (count: number) => void;
}

const DocumentPreview = ({ formData, sidebarItems = [], currentPage, onPageCountChange }: DocumentPreviewProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculatePages = () => {
      if (!contentRef.current) return;

      const contentHeight = contentRef.current.scrollHeight;
      const count = contentHeight <= DOC_USABLE_HEIGHT
        ? 1
        : Math.ceil(contentHeight / DOC_USABLE_HEIGHT);

      onPageCountChange(count);
    };

    const timeoutId = setTimeout(calculatePages, 100);
    return () => clearTimeout(timeoutId);
  }, [formData, sidebarItems, onPageCountChange]);

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
      <div className="bg-white" style={{
        width: DOC_WIDTH,
        height: DOC_HEIGHT,
        padding: DOC_PADDING,
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{
          height: '100%',
          overflow: 'hidden',
          transform: `translateY(-${(currentPage - 1) * DOC_USABLE_HEIGHT}px)`,
        }}>
          {renderContent()}
        </div>
      </div>

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
