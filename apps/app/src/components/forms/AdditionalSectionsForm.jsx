import { Briefcase, GraduationCap, MessageSquare, Globe, Link, Gamepad2, Code } from 'lucide-react';

function AdditionalSectionsForm() {
  const sections = [
    { id: 'internships', icon: Briefcase, label: 'Internships' },
    { id: 'courses', icon: GraduationCap, label: 'Courses' },
    { id: 'references', icon: MessageSquare, label: 'References' },
    { id: 'languages', icon: Globe, label: 'Languages' },
    { id: 'links', icon: Link, label: 'Links' },
    { id: 'hobbies', icon: Gamepad2, label: 'Hobbies' },
    { id: 'custom', icon: Code, label: 'Custom section' }
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Additional section</h1>
      <p className="text-gray-600 mb-8">
        You should only add resume categories if they are relevant and you can list a few things in each section. Pick the most impactful categories first.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">{section.label}</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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