import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProjectEntryForm from '../entries/ProjectEntryForm';
import { FormHeader, FormDescription, FormSection, FormEntryHeader, AddEntryButton } from '../shared/FormComponents';
import Modal from '../../ui/Modal';
import { useDeleteModal } from '../../../hooks/useDeleteModal';
import type { FormData, ProjectItem } from '../../../types/resume';

interface ProjectsFormProps {
  onDeleteSection: () => void;
  formData: FormData;
  addSectionItem: (sectionType: string) => string;
  updateSectionItem: (sectionType: string, itemId: string, field: string, value: unknown) => void;
  removeSectionItem: (sectionType: string, itemId: string) => void;
}

function ProjectsForm({
  onDeleteSection,
  formData,
  addSectionItem,
  updateSectionItem,
  removeSectionItem,
}: ProjectsFormProps) {
  const { t } = useTranslation();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const deleteModal = useDeleteModal(onDeleteSection);

  const projects = (formData.projects || []) as (ProjectItem & { id: string })[];

  const addProject = () => {
    const newItemId = addSectionItem('projects');
    setExpandedItems((prev) => ({ ...prev, [newItemId]: true }));
  };

  const removeProject = (id: string) => {
    removeSectionItem('projects', id);
    setExpandedItems((prev) => {
      const newExpanded = { ...prev };
      delete newExpanded[id];
      return newExpanded;
    });
  };

  const updateProject = (id: string, field: string, value: unknown) => {
    updateSectionItem('projects', id, field, value);
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div>
      <FormHeader title={t('forms.projects.header')} onDelete={deleteModal.openModal} showDelete />

      <FormDescription>
        {t('forms.projects.description')}
      </FormDescription>

      <FormSection>
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-md sm:rounded-lg" style={{ border: '1px solid var(--border)' }}>
            <FormEntryHeader
              title={project.name || t('common.untitled')}
              isExpanded={expandedItems[project.id]}
              onToggleExpanded={() => toggleExpanded(project.id)}
              onRemove={() => removeProject(project.id)}
            />

            {expandedItems[project.id] && (
              <ProjectEntryForm
                project={project}
                onUpdate={updateProject}
                jobTitle={formData.jobTitle}
              />
            )}
          </div>
        ))}

        <AddEntryButton onClick={addProject} label={t('forms.projects.addEntry')} />
      </FormSection>

      <Modal.Confirmation
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={deleteModal.confirmDelete}
      />
    </div>
  );
}

export default ProjectsForm;
