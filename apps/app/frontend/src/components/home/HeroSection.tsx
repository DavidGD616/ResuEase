import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CreateDropdown from './CreateDropdown';
import { useAuth } from '../../hooks/useAuth';

function HeroSection() {
  const { user, signOut } = useAuth();
  const { t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('resumes');

  const handleSignOut = async () => {
    await signOut();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const tabs = [
    { id: 'resumes', label: t('home.tabs.resumes') },
    { id: 'cover-letters', label: t('home.tabs.coverLetters') },
    { id: 'resignation-letters', label: t('home.tabs.resignationLetters') },
  ];

  return (
    <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <img
                src="/ResuEase-logo.svg"
                alt="ResuEase Logo"
                className="w-6 h-6 sm:w-8 sm:h-8"
              />
              <h1 className="text-lg font-semibold" style={{ color: 'var(--ink)' }}>{t('nav.brand')}</h1>
            </div>
          </div>

          <div className="hidden md:flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id ? 'border-blue-500' : 'border-transparent'
                }`}
                style={{ color: activeTab === tab.id ? 'var(--accent)' : 'var(--ink-3)' }}
                onMouseEnter={e => { if (activeTab !== tab.id) (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink-2)'; }}
                onMouseLeave={e => { if (activeTab !== tab.id) (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink-3)'; }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div
                className="p-2 rounded-full flex items-center justify-center cursor-pointer"
                style={{ background: 'var(--accent-dim)' }}
              >
                <span className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
                  {user?.email?.substring(0, 2).toUpperCase() ?? 'U'}
                </span>
              </div>

              <div
                className="absolute right-0 top-full mt-2 w-auto bg-white rounded-md py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50"
                style={{ boxShadow: '0 10px 20px rgba(0,0,0,0.10)', border: '1px solid var(--border)' }}
              >
                <div className="py-1">
                  <div className="px-4 py-2 text-sm" style={{ color: 'var(--ink-2)' }}>
                    {user?.email}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm transition-colors hover:bg-gray-50"
                    style={{ color: 'var(--ink-2)' }}
                  >
                    {t('home.signOut')}
                  </button>
                </div>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                style={{ background: 'var(--accent)' }}
              >
                <span className="text-sm font-medium">{t('home.create')}</span>
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
