import { FileDown, Menu, Home } from 'lucide-react';

function TopNavigation({ onMenuClick }) {

  return (
    <div className="bg-white border-b border-gray-200 px-2 sm:px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        
        <div className="flex w-full items-center space-x-2 sm:space-x-4">
          {/* Hamburger Menu */}
          <button
          onClick={onMenuClick}
          className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg lg:hidden">
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg">
            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div className="flex w-full lg:w-auto bg-gray-100 rounded-lg p-0.5 sm:p-1">
            <button className="flex-1 justify-center px-2 sm:px-0 lg:px-4 py-1.5 sm:py-2 bg-gray-900 text-white rounded-md text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
              <FileDown className="w-3 h-3 sm:w-4 sm:h-4" />
              Write
            </button>
            <button className="flex-1 justify-center px-2 sm:px-0 lg:px-4 py-1.5 sm:py-2 text-gray-700 hover:bg-gray-200 rounded-md text-xs sm:text-sm font-medium">
              Design
            </button>
            <button className="flex-1 justify-center px-2 sm:px-0 lg:px-4 py-1.5 sm:py-2 text-gray-700 hover:bg-gray-200 rounded-md text-xs sm:text-sm font-medium">
              Improve
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-2">
          <div className="hidden lg:flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-24 bg-yellow-200 h-2 rounded-full">
              <div className="w-1/2 bg-yellow-400 h-2 rounded-full"></div>
            </div>
            <span>50%</span>
          </div>
          <button 
            className="px-4 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 ml-2 sm:ml-4"
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