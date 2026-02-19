import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import CreateDropdown from './CreateDropdown';
import { useAuth } from '../../hooks/useAuth';

function HeroSection() {
  const { user, signOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('resumes');

  const handleSignOut = async () => {
    await signOut();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const tabs = [
    { id: 'resumes', label: 'Resumes' },
    { id: 'cover-letters', label: 'Cover letters' },
    { id: 'resignation-letters', label: 'Resignation letters' },
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <img
                src="/ResuEase-logo.svg"
                alt="ResuEase Logo"
                className="w-6 h-6 sm:w-8 sm:h-8"
              />
              <h1 className="text-lg font-semibold text-gray-900">ResuEase</h1>
            </div>
          </div>

          <div className="hidden md:flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="p-2 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer">
                <span className="text-sm font-medium text-gray-700">
                  {user?.email?.substring(0, 2).toUpperCase() ?? 'U'}
                </span>
              </div>

              <div className="absolute right-0 top-full mt-2 w-auto bg-white rounded-md shadow-lg border py-2 border-gray-200 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm">
                    {user?.email}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span className="text-sm font-medium">Create</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              <CreateDropdown
                isOpen={isDropdownOpen}
                onClose={() => setIsDropdownOpen(false)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
