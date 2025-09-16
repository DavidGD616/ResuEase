import { useState, useEffect, useRef } from 'react';
import HarvardTemplate from '../resume/HarvardTemplate';

const DocumentPreview = ({ formData, sidebarItems = [] }) => {
  const [pages, setPages] = useState([]);
  const contentRef = useRef(null);

  // Calculate pages based on content height
  useEffect(() => {
    // Add a small delay to ensure content is rendered
    const calculatePages = () => {
      if (!contentRef.current) return;

      const pageHeight = 11 * 96 - (0.5 * 2 * 96); // 11 inches minus top/bottom margins in pixels
      const content = contentRef.current;
      const contentHeight = content.scrollHeight;
      
      if (contentHeight <= pageHeight) {
        setPages([1]);
      } else {
        const numberOfPages = Math.ceil(contentHeight / pageHeight);
        setPages(Array.from({ length: numberOfPages }, (_, i) => i + 1));
      }
    };

    // Use setTimeout to ensure DOM is updated before calculating
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
      color: '#000'
    }}>
      {pages.map((pageNum) => (
        <div key={pageNum} className="bg-white" style={{
          width: '8.5in',
          height: '11in',
          padding: '0.5in',
          pageBreakAfter: pageNum < pages.length ? 'always' : 'avoid',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            height: '100%',
            overflow: 'hidden',
            transform: `translateY(-${(pageNum - 1) * (11 * 96 - 0.5 * 2 * 96)}px)`
          }}>
            {pageNum === 1 ? renderContent() : null}
          </div>
        </div>
      ))}
      
      {/* Hidden content for measurement */}
      <div style={{ 
        position: 'absolute', 
        left: '-9999px', 
        width: '8.5in', 
        padding: '0.5in' 
      }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default DocumentPreview;