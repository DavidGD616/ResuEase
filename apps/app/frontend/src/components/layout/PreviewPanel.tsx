import { useRef, useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DocumentPreview from './DocumentPreview';
import SaveStatus from '../ui/SaveStatus';
import type { FormData, SidebarItem } from '../../types/resume';
import { DOC_WIDTH, DOC_HEIGHT } from '../../constants/document';

type SaveStatusValue = 'saving' | 'saved' | 'error';

interface PreviewPanelProps {
  formData: FormData;
  sidebarItems?: SidebarItem[];
  saveStatus: SaveStatusValue;
}

function PreviewPanel({ formData, sidebarItems = [], saveStatus }: PreviewPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.54);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handlePageCountChange = useCallback((count: number) => {
    setTotalPages(count);
    setCurrentPage(prev => Math.min(prev, count));
  }, []);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        const documentWidth = DOC_WIDTH;
        const documentHeight = DOC_HEIGHT;

        const scaleX = containerWidth / documentWidth;
        const scaleY = containerHeight / documentHeight;

        const newScale = Math.min(scaleX, scaleY);
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
    <div
      className="w-full lg:border-l p-3 sm:p-4 lg:p-6"
      style={{
        backgroundColor: '#e8e8e5',
        borderColor: 'var(--border)',
        maxWidth: `calc((100vh - 104px) * ${DOC_WIDTH / DOC_HEIGHT} + 3rem)`,
      }}
    >
      <div className="w-full max-w-full flex justify-center">
        <div
          className="relative bg-white overflow-hidden rounded-lg w-full"
          style={{
            aspectRatio: '.707',
            maxWidth: 'min(100%, calc((100vh - 104px) * 0.707034728))',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <div
            ref={containerRef}
            className="w-full h-full flex items-center justify-center"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
            }}
          >
            <DocumentPreview
              formData={formData}
              sidebarItems={sidebarItems}
              currentPage={currentPage}
              onPageCountChange={handlePageCountChange}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 items-center mt-4 text-xs" style={{ color: 'var(--ink-3)' }}>
        <div><SaveStatus status={saveStatus} /></div>
        <div className="flex justify-center">
          {totalPages > 1 && (
            <div className="flex items-center gap-1 bg-white rounded-full px-2.5 py-1" style={{ border: '1px solid var(--border)' }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-0.5 rounded-full disabled:opacity-40 disabled:pointer-events-none transition-colors hover:bg-white/80"
                style={{ color: 'var(--ink-3)' }}
              >
                <ChevronLeft size={14} />
              </button>
              <span className="tabular-nums px-1">{currentPage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-0.5 rounded-full disabled:opacity-40 disabled:pointer-events-none transition-colors hover:bg-white/80"
                style={{ color: 'var(--ink-3)' }}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
        <div />
      </div>
    </div>
  );
}

export default PreviewPanel;
