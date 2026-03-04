import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function NavigationTabs() {
  const [activeTab, setActiveTab] = useState('resumes');
  const { t } = useTranslation();

  const tabs = [
    { id: 'resumes', label: t('home.tabs.resumes') },
    { id: 'cover-letters', label: t('home.tabs.coverLetters') },
    { id: 'resignation-letters', label: t('home.tabs.resignationLetters') },
  ];

  return (
    <div className="border-b border-gray-200 mb-8">
      <nav className="flex space-x-8">
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
      </nav>
    </div>
  );
}

export default NavigationTabs;
