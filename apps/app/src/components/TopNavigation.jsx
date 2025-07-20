import { FileDown, Menu, Home } from 'lucide-react';

function TopNavigation() {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        
        <div className="flex w-full items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg lg:hidden">
            <Menu className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Home className="w-5 h-5" />
          </button>
          <div className="flex w-full lg:w-auto bg-gray-100 rounded-lg p-1">
            <button className="flex-1 justify-center lg:px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium flex items-center gap-2">
              <FileDown className="w-4 h-4" />
              Write
            </button>
            <button className="flex-1 justify-center lg:px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md text-sm font-medium">
              Design
            </button>
            <button className="flex-1 justify-center lg:px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md text-sm font-medium">
              Improve
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="hidden lg:flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-24 bg-yellow-200 h-2 rounded-full">
              <div className="w-1/2 bg-yellow-400 h-2 rounded-full"></div>
            </div>
            <span>50%</span>
          </div>
          <button className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium">
            Share
          </button>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-2"
          >
            <FileDown className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

export default TopNavigation;