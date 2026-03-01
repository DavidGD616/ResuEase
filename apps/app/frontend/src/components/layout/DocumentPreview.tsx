import { useState, useEffect, useRef } from 'react';
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
  const measureRef = useRef<HTMLDivElement>(null);
  const [pageBreaks, setPageBreaks] = useState<number[]>([0]);

  useEffect(() => {
    const calculatePageBreaks = () => {
      if (!measureRef.current) return;

      const totalHeight = measureRef.current.scrollHeight;

      if (totalHeight <= DOC_USABLE_HEIGHT) {
        setPageBreaks([0]);
        onPageCountChange(1);
        return;
      }

      // Use offsetTop traversal instead of getBoundingClientRect().
      // offsetTop/offsetHeight are DOM layout properties unaffected by CSS transforms,
      // giving unscaled coordinates consistent with scrollHeight and DOC_USABLE_HEIGHT.
      const measureDiv = measureRef.current;
      const elements = Array.from(measureDiv.querySelectorAll('*'))
        .map(el => {
          let top = 0;
          let cur = el as HTMLElement;
          while (cur && cur !== measureDiv) {
            top += cur.offsetTop;
            cur = cur.offsetParent as HTMLElement;
          }
          const height = (el as HTMLElement).offsetHeight;
          return { top, bottom: top + height };
        })
        .filter(({ top, bottom }) => bottom - top > 1)
        .sort((a, b) => a.top - b.top);

      const breaks: number[] = [0];
      let pageStart = 0;

      while (pageStart + DOC_USABLE_HEIGHT < totalHeight) {
        const boundary = pageStart + DOC_USABLE_HEIGHT;

        // Walk sorted elements and keep updating bestBreak for every element that
        // straddles the boundary. The last update (largest top) is the most specific
        // element — closest to the boundary without starting after it.
        let bestBreak = boundary; // fallback: exact boundary (unavoidable cut)

        for (const { top, bottom } of elements) {
          if (top >= boundary) break;
          if (top > pageStart + 20 && bottom > boundary) {
            bestBreak = top;
          }
        }

        breaks.push(bestBreak);
        pageStart = bestBreak;
      }

      setPageBreaks(breaks);
      onPageCountChange(breaks.length);
    };

    const timeoutId = setTimeout(calculatePageBreaks, 100);
    return () => clearTimeout(timeoutId);
  }, [formData, sidebarItems, onPageCountChange]);

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
        <div style={{ height: '100%', overflow: 'hidden' }}>
          <div style={{ transform: `translateY(-${pageBreaks[currentPage - 1] ?? 0}px)` }}>
            <HarvardTemplate formData={formData} sidebarItems={sidebarItems} />
          </div>
        </div>
      </div>

      {/* Off-screen measurement div — ref lives here exclusively so offsetTop traversal measures this render */}
      <div style={{
        position: 'absolute',
        left: '-9999px',
        width: DOC_WIDTH,
        padding: DOC_PADDING,
      }}>
        <div ref={measureRef} style={{ position: 'relative' }}>
          <HarvardTemplate formData={formData} sidebarItems={sidebarItems} />
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;
