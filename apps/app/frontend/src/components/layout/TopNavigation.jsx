import { FileDown, Menu, Home } from 'lucide-react';

function TopNavigation({ onMenuClick }) {

  return (
    <div className="bg-white border-b border-gray-200 px-2 sm:px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Hamburger Menu */}
          <button
          onClick={onMenuClick}
          className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg lg:hidden transition-colors">
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
          {/* Home Button */}
          <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
          {/* App Title */}
          <div className="flex items-center space-x-2">
            <img 
              src="/ResuEase-logo.svg" 
              alt="ResuEase Logo" 
              className="w-6 h-6 sm:w-8 sm:h-8"
            />
            <h1 className="text-lg font-semibold text-gray-900">ResuEase</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Download Button */}
          <button 
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2"
          >
            <FileDown className="w-4 h-4" />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TopNavigation;