import { useTranslation } from 'react-i18next';
import { useDeleteModal } from '../../../hooks/useDeleteModal';
import Modal from '../../ui/Modal';
import { FormHeader, FormDescription, FormTextarea } from '../shared/FormComponents';
import type { FormData } from '../../../types/resume';

interface ProfessionalSummaryFormProps {
  formData: FormData;
  handleInputChange: (field: string, value: unknown) => void;
  onDeleteSection: () => void;
}

function ProfessionalSummaryForm({ formData, handleInputChange, onDeleteSection }: ProfessionalSummaryFormProps) {
  const { t } = useTranslation();
  const deleteModal = useDeleteModal(onDeleteSection);

  return (
    <div>
      <FormHeader title={t('forms.summary.header')} onDelete={deleteModal.openModal} showDelete />

      <FormDescription>
        {t('forms.summary.description')}
      </FormDescription>

      <FormTextarea
        label={t('forms.summary.label')}
        value={formData.about}
        onChange={(e) => handleInputChange('about', e.target.value)}
        rows={6}
        placeholder={t('forms.summary.placeholder')}
        aiTransform={{
          jobTitle: formData.jobTitle,
          sectionName: 'Professional Summary',
          fieldLabel: 'Summary',
          onTransformAccept: (text) => handleInputChange('about', text),
        }}
      />

      <Modal.Confirmation
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={deleteModal.confirmDelete}
      />
    </div>
  );
}

export default ProfessionalSummaryForm;
