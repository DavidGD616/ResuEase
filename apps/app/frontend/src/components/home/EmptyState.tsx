import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function EmptyState() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleBuildResume = () => {
    navigate('/resume-builder');
  };

  return (
    <div className="text-center py-16">
      <div className="mb-8 flex justify-center">
        <img
          src="/environmental-study.svg"
          alt="environmental-study"
          className="h-40 md:h-56"
        />
      </div>

      <div className="max-w-lg mx-auto">
        <h1 className="text-xl font-medium mb-4" style={{ color: 'var(--ink-2)' }}>
          {t('home.emptyState.title')}
        </h1>

        <button
          onClick={handleBuildResume}
          className="inline-flex items-center space-x-2 text-white px-6 py-2.5 rounded-full hover:bg-blue-700 transition-colors font-medium"
          style={{ background: 'var(--accent)' }}
        >
          <Plus className="w-5 h-5" />
          <span>{t('home.emptyState.cta')}</span>
        </button>
      </div>
    </div>
  );
}

export default EmptyState;
