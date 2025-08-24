import { useRef, useEffect, useState } from 'react';
import DocumentPreview from './DocumentPreview';

function PreviewPanel({ formData, sidebarItems = [] }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(0.54);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const container = containerRef.current;      
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        // A4 document size 96dpi
        const documentWidth = 794;
        const documentHeight = 1123;

        const scaleX = containerWidth / documentWidth;
        const scaleY = containerHeight / documentHeight;
        
        // Use the bigger scale to ensure document fits completely
        const newScale = Math.max(scaleX, scaleY);
        setScale(newScale);
      }
    };

    updateScale();
    
    const resizeObserver = new ResizeObserver(updateScale);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    window.addEventListener('resize', updateScale);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, []);

  return (
    <div className="w-96 sm:w-md bg-gray-50 lg:border-l border-gray-200 p-6">
      <div className="w-full max-w-full flex justify-center">
        <div
          className="relative bg-white overflow-hidden rounded-lg shadow-lg inset-shadow-sm w-full"
          style={{
            aspectRatio: "0.76",
            maxWidth: "min(100%, calc((100vh - 104px) * 0.707034728))",
          }}
        >
          {/* Container that scales DocumentPreview to fit */}
          <div 
            ref={containerRef}
            className="w-full h-full flex items-center justify-center"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'center center'
            }}
          >
            <DocumentPreview formData={formData} sidebarItems={sidebarItems} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center mt-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Saved
        </div>
      </div>
    </div>
  );
}

export default PreviewPanel;