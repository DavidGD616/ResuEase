import { useTranslation } from 'react-i18next';
import { FormHeader, FormDescription } from '../shared/FormComponents';
import { SIDEBAR_ITEMS, ADDITIONAL_SECTION } from '../../../data/sidebarItems';
import type { SidebarItem } from '../../../types/resume';
import type { AdditionalSectionItem } from '../../../data/sidebarItems';

interface AdditionalSectionsFormProps {
  sidebarItems: SidebarItem[];
  onAddSection: (section: AdditionalSectionItem) => void;
}

function AdditionalSectionsForm({ sidebarItems, onAddSection }: AdditionalSectionsFormProps) {
  const { t } = useTranslation();

  const allAvailableSections = [
    ...SIDEBAR_ITEMS.filter((item) => !item.fixed),
    ...ADDITIONAL_SECTION,
  ];

  const availableSections = allAvailableSections.filter((section) => {
    if (section.id === 'custom') {
      return true;
    }
    const isInSidebar = sidebarItems.some((item) => item.id === section.id);
    return !isInSidebar;
  });

  const handleSectionClick = (section: AdditionalSectionItem) => {
    onAddSection(section);
  };

  return (
    <div>
      <FormHeader title={t('forms.additional.header')} />

      <FormDescription>
        {t('forms.additional.description')}
      </FormDescription>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {availableSections.map((section) => {
          const Icon = section.icon;
          const sectionLabel = section.labelKey ? t(section.labelKey) : section.label;
          return (
            <button
              key={section.id}
              onClick={() => handleSectionClick(section)}
              className="flex items-center justify-between p-3 sm:p-4 bg-white rounded-md sm:rounded-lg transition-colors text-left"
              style={{ border: '1px solid var(--border)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--accent-dim)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'white'; }}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: 'var(--ink-3)' }} />
                <span className="font-medium text-sm sm:text-base" style={{ color: 'var(--ink)' }}>{sectionLabel}</span>
              </div>
              <svg className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: 'var(--ink-3)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default AdditionalSectionsForm;
