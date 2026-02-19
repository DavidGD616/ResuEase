import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

function EmptyState() {
  const navigate = useNavigate();

  const handleBuildResume = () => {
    navigate('/resume-builder');
  };

  return (
    <div className="text-center py-16">
      <div className="mb-8 flex justify-center">
        <img
          src="/environmental-study.svg"
          alt="environmental-study"
          className="h-40 md:h-80"
        />
      </div>

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
