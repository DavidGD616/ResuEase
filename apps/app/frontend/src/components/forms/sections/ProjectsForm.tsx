import { useState } from 'react';
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
      <FormHeader title="Projects" onDelete={deleteModal.openModal} showDelete />

      <FormDescription>
        This section is optional, and it's mainly useful for students or recent grads. You can list school projects or even personal projects here to give your resume more depth and show practical experience.
      </FormDescription>

      <FormSection>
        {projects.map((project) => (
          <div key={project.id} className="border border-gray-200 rounded-md sm:rounded-lg">
            <FormEntryHeader
              title={project.name || 'Untitled'}
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

        <AddEntryButton onClick={addProject} label="Add Project" />
      </FormSection>

      <Modal.Confirmation
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={deleteModal.confirmDelete}
        title="Are you sure you want to delete this section?"
        message="You can't undo this action."
        confirmText="Delete Section"
        cancelText="Cancel"
      />
    </div>
  );
}

export default ProjectsForm;
