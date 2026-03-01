import { useState } from 'react';
import type { ReactNode } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, X, HelpCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Modal from '../../ui/Modal';
import AiTextActions from './AiTextActions';

interface HintConfig {
  title: string;
  description: ReactNode;
}

// Hint Icon Component

interface HintIconProps {
  title: string;
  description: ReactNode;
  className?: string;
}

export function HintIcon({ title, description, className = '' }: HintIconProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className={`inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 hover:text-gray-700 transition-colors ${className}`}
        aria-label="Show hint"
      >
        <HelpCircle className="w-4 h-4" />
      </button>

      <Modal.Hint
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        description={description}
      />
    </>
  );
}

// Typography Components

interface FormHeaderProps {
  title: string;
  onDelete?: () => void;
  showDelete?: boolean;
}

export function FormHeader({ title, onDelete, showDelete = false }: FormHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-1 sm:mb-2">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h1>
      {showDelete && (
        <button
          onClick={onDelete}
          className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 transition-colors"
        >
          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      )}
    </div>
  );
}

interface FormDescriptionProps {
  children: ReactNode;
}

export function FormDescription({ children }: FormDescriptionProps) {
  return (
    <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
      {children}
    </p>
  );
}

// Layout Components

interface ClassNameChildrenProps {
  children: ReactNode;
  className?: string;
}

export function FormSection({ children, className = '' }: ClassNameChildrenProps) {
  return (
    <div className={`space-y-4 sm:space-y-6 ${className}`}>
      {children}
    </div>
  );
}

export function FormContainer({ children, className = '' }: ClassNameChildrenProps) {
  return (
    <div className={`p-3 sm:p-4 space-y-3 sm:space-y-4 ${className}`}>
      {children}
    </div>
  );
}

interface FormGridProps {
  columns?: 2 | 3;
  children: ReactNode;
  className?: string;
}

export function FormGrid({ columns = 2, children, className = '' }: FormGridProps) {
  const gridClass =
    columns === 3
      ? 'grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4'
      : 'grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4';

  return <div className={`${gridClass} ${className}`}>{children}</div>;
}

// Form Input Components

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: HintConfig;
}

export function FormInput({ label, hint, ...props }: FormInputProps) {
  return (
    <div>
      {label && (
        <div className="flex items-center gap-2 mb-1 sm:mb-2">
          <label className="block text-xs sm:text-sm font-medium text-gray-700">
            {label}
          </label>
          {hint && <HintIcon title={hint.title} description={hint.description} />}
        </div>
      )}
      <input
        className="w-full px-2 sm:px-3 py-2 sm:py-3 border border-gray-300 rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
        {...props}
      />
    </div>
  );
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: HintConfig;
  aiTransform?: {
    jobTitle?: string;
    sectionName: string;
    fieldLabel: string;
    onTransformAccept: (newText: string) => void;
  };
}

export function FormTextarea({ label, hint, aiTransform, ...props }: FormTextareaProps) {
  return (
    <div>
      {label && (
        <div className="flex items-center gap-2 mb-1 sm:mb-2">
          <label className="block text-xs sm:text-sm font-medium text-gray-700">
            {label}
          </label>
          {hint && <HintIcon title={hint.title} description={hint.description} />}
        </div>
      )}
      <textarea
        className="w-full px-2 sm:px-3 py-2 sm:py-3 border border-gray-300 rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base resize-none"
        {...props}
      />
      {aiTransform && (
        <AiTextActions
          text={(props.value as string) ?? ''}
          jobTitle={aiTransform.jobTitle}
          sectionName={aiTransform.sectionName}
          fieldLabel={aiTransform.fieldLabel}
          onAccept={aiTransform.onTransformAccept}
        />
      )}
    </div>
  );
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: string[];
  hint?: HintConfig;
}

export function FormSelect({ label, options, hint, ...props }: FormSelectProps) {
  return (
    <div>
      {label && (
        <div className="flex items-center gap-2 mb-1 sm:mb-2">
          <label className="block text-xs sm:text-sm font-medium text-gray-700">
            {label}
          </label>
          {hint && <HintIcon title={hint.title} description={hint.description} />}
        </div>
      )}
      <div className="relative">
        <select
          className="w-full px-2 sm:px-3 py-2 sm:py-3 border border-gray-300 rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base appearance-none bg-white"
          {...props}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}

// Button Components

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'panel';

interface FormButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: LucideIcon;
  children?: ReactNode;
}

export function FormButton({ variant = 'secondary', icon: Icon, children, ...props }: FormButtonProps) {
  const baseClasses = 'flex items-center gap-1 sm:gap-2 font-medium transition-colors text-sm sm:text-base';

  const variants: Record<ButtonVariant, string> = {
    primary: 'px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-md sm:rounded-lg hover:bg-blue-700',
    secondary: 'px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-700 rounded-md sm:rounded-lg hover:bg-gray-300',
    ghost: 'text-gray-700 hover:text-gray-900',
    panel: 'bg-gray-50 rounded-md sm:rounded-lg p-3 sm:p-4 w-full justify-start hover:bg-gray-100',
  };

  return (
    <button className={`${baseClasses} ${variants[variant]}`} {...props}>
      {Icon && <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
      {children}
    </button>
  );
}

interface FormToggleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isOpen: boolean;
  icon?: LucideIcon;
  children?: ReactNode;
}

export function FormToggleButton({ isOpen, icon: Icon, children, ...props }: FormToggleButtonProps) {
  return (
    <button
      className="flex items-center gap-1 sm:gap-2 text-gray-700 hover:text-gray-900 font-medium text-sm sm:text-base"
      {...props}
    >
      {isOpen ? (
        <span className="w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center text-lg leading-none">−</span>
      ) : (
        Icon && <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
      )}
      {children}
    </button>
  );
}

// Entry Components

interface FormEntryHeaderProps {
  title: string;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onRemove: () => void;
}

export function FormEntryHeader({ title, isExpanded, onToggleExpanded, onRemove }: FormEntryHeaderProps) {
  return (
    <div
      className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
      onClick={onToggleExpanded}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          className="text-gray-400 hover:text-gray-600"
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpanded();
          }}
        >
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>
        <h3 className="font-medium text-sm sm:text-base text-gray-900">
          {title || 'Untitled'}
        </h3>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 transition-colors"
      >
        <X className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
}

interface FormEntryBulletProps {
  title: string;
  onRemove: () => void;
  hint?: HintConfig;
}

export function FormEntryBullet({ title, onRemove, hint }: FormEntryBulletProps) {
  return (
    <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200">
      <div className="flex items-center gap-2 sm:gap-3">
        <h3 className="font-medium text-sm sm:text-base text-gray-900">
          {title || 'Untitled'}
        </h3>
        {hint && <HintIcon title={hint.title} description={hint.description} />}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRemove}
          className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 transition-colors"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}

interface AddEntryButtonProps {
  onClick: () => void;
  label: string;
}

export function AddEntryButton({ onClick, label }: AddEntryButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full py-2 sm:py-3 border-2 border-dashed border-gray-300 rounded-md sm:rounded-lg hover:border-gray-400 text-sm sm:text-base text-gray-600 hover:text-gray-700 transition-colors flex items-center justify-center gap-1 sm:gap-2"
    >
      <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
      {label}
    </button>
  );
}
