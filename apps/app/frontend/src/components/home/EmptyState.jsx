import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

function EmptyState() {
  const navigate = useNavigate();

  const handleBuildResume = () => {
    navigate('/resume-builder');
  };

  return (
    <div className="text-center py-16">
      {/* Illustration */}
      <div className="mb-8">
        <div className="max-w-md mx-auto">
          {/* Professional people illustration */}
          <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 mb-8">
            <div className="flex justify-center items-end space-x-4">
              {/* Person 1 */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-400 rounded-full mb-2 flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
                <div className="w-16 h-20 bg-blue-500 rounded-t-full"></div>
              </div>

              {/* Person 2 - Chef/Service worker with hat */}
              <div className="flex flex-col items-center">
                <div className="w-3 h-4 bg-gray-300 rounded-t-lg mb-1 mx-auto"></div>
                <div className="w-12 h-12 bg-orange-300 rounded-full mb-2 flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
                <div className="w-16 h-24 bg-blue-600 rounded-t-full flex items-center justify-center">
                  <div className="w-2 h-8 bg-green-400 rounded"></div>
                </div>
              </div>

              {/* Person 3 */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-amber-300 rounded-full mb-2 flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
                <div className="w-16 h-20 bg-green-500 rounded-t-full"></div>
              </div>

              {/* Person 4 - Doctor/Medical professional */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-pink-300 rounded-full mb-2 flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
                <div className="w-16 h-22 bg-white rounded-t-full border-2 border-gray-200 flex items-center justify-center">
                  <div className="w-8 h-1 bg-blue-500 rounded"></div>
                </div>
              </div>

              {/* Person 5 */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-purple-300 rounded-full mb-2 flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
                <div className="w-16 h-18 bg-indigo-500 rounded-t-full"></div>
              </div>

              {/* Person 6 - Waving hand */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-yellow-300 rounded-full mb-2 flex items-center justify-center relative">
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                  {/* Waving hand */}
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full transform rotate-12"></div>
                </div>
                <div className="w-16 h-20 bg-blue-700 rounded-t-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          If you don't have a resume yet, it's a great time to create one!
        </h1>
        
        <button
          onClick={handleBuildResume}
          className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Build my resume</span>
        </button>
      </div>
    </div>
  );
}

export default EmptyState;