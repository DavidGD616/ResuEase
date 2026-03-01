import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileDown, Menu, Home } from 'lucide-react';
import { PdfService } from '../../services/PdfService';
import type { FormData, SidebarItem } from '../../types/resume';

interface TopNavigationProps {
  onMenuClick: () => void;
  formData: FormData;
  sidebarItems: SidebarItem[];
}

function TopNavigation({ onMenuClick, formData, sidebarItems }: TopNavigationProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();

  const handleHomeButton = () => {
    navigate('/');
  };

  const handleDownloadClick = async () => {
    setIsDownloading(true);

    try {
      const result = await PdfService.downloadResumePDF(formData, sidebarItems, 'harvard');

      if (!result.success) {
        alert(`PDF generation failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Download error:', error);
      alert(`Download failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      className="px-2 sm:px-4 py-3"
      style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={onMenuClick}
            className="p-1.5 sm:p-2 rounded-lg lg:hidden transition-colors hover:bg-(--accent-dim) hover:text-(--accent)"
            style={{ color: 'var(--ink-2)' }}
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={handleHomeButton}
            className="p-1.5 sm:p-2 rounded-lg transition-colors hover:bg-(--accent-dim) hover:text-(--accent)"
            style={{ color: 'var(--ink-2)' }}
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="flex items-center space-x-2">
            <img
              src="/ResuEase-logo.svg"
              alt="ResuEase Logo"
              className="w-6 h-6 sm:w-8 sm:h-8"
            />
            <h1 className="text-sm sm:text-lg font-semibold" style={{ color: 'var(--ink)' }}>ResuEase</h1>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={handleDownloadClick}
            disabled={isDownloading}
            className={`
              px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2
              ${isDownloading ? 'cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}
            `}
            style={isDownloading ? {
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              color: 'var(--ink-3)',
            } : {}}
          >
            <FileDown className={`w-4 h-4 ${isDownloading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">
              {isDownloading ? 'Generating...' : 'Download'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TopNavigation;
