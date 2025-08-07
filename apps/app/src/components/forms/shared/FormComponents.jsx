import { Camera, Plus, Trash2, ChevronDown, ChevronUp, X } from 'lucide-react';

// Typography Components

export function FormHeader({ title, onDelete, showDelete = false }) {
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

export function FormDescription({ children }) {
  return (
    <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
      {children}
    </p>
  );
}

// Layout Components

export function FormSection({ children, className = "" }) {
  return (
    <div className={`space-y-4 sm:space-y-6 ${className}`}>
      {children}
    </div>
  );
}

export function FormContainer({ children, className = "" }) {
  return (
    <div className={`p-3 sm:p-4 space-y-3 sm:space-y-4 ${className}`}>
      {children}
    </div>
  );
}

export function FormGrid({ columns = 2, children, className = "" }) {
  const gridClass = columns === 3 
    ? "grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4"
    : "grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4";
    
  return <div className={`${gridClass} ${className}`}>{children}</div>;
}

// Form Input Components

export function FormInput({ label, ...props }) {
  return (
    <div>
      {label && (
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
          {label}
        </label>
      )}
      <input
        className="w-full px-2 sm:px-3 py-2 sm:py-3 border border-gray-300 rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
        {...props}
      />
    </div>
  );
}

export function FormTextarea({ label, ...props }) {
  return (
    <div>
      {label && (
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
          {label}
        </label>
      )}
      <textarea
        className="w-full px-2 sm:px-3 py-2 sm:py-3 border border-gray-300 rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base resize-none"
        {...props}
      />
    </div>
  );
}

export function FormSelect({ label, options, ...props }) {
  return (
    <div>
      {label && (
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
          {label}
        </label>
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

export function FormButton({ variant = "secondary", icon: Icon, children, ...props }) {
  const baseClasses = "flex items-center gap-1 sm:gap-2 font-medium transition-colors text-sm sm:text-base";
  
  const variants = {
    primary: "px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-md sm:rounded-lg hover:bg-blue-700",
    secondary: "px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-700 rounded-md sm:rounded-lg hover:bg-gray-300",
    ghost: "text-gray-700 hover:text-gray-900",
    panel: "bg-gray-50 rounded-md sm:rounded-lg p-3 sm:p-4 w-full justify-start hover:bg-gray-100"
  };
  
  return (
    <button className={`${baseClasses} ${variants[variant]}`} {...props}>
      {Icon && <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
      {children}
    </button>
  );
}

export function FormToggleButton({ isOpen, icon: Icon, children, ...props }) {
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