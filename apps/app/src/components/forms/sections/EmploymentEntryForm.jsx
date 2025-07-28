import RichTextEditor from '../shared/RichTextEditor';

function EmploymentEntryForm({ experience, onUpdate }) {
  const handleChange = (field, value) => {
    onUpdate(experience.id, field, value);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Job title</label>
          <input
            type="text"
            value={experience.jobTitle}
            onChange={(e) => handleChange('jobTitle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Product Designer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Company name</label>
          <input
            type="text"
            value={experience.company}
            onChange={(e) => handleChange('company', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Apple Inc."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Start date</label>
          <input
            type="text"
            value={experience.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Jan 2016"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">End date</label>
          <input
            type="text"
            value={experience.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Feb 2019"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <input
            type="text"
            value={experience.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Washington, D.C."
          />
        </div>
      </div>

      <RichTextEditor
        value={experience.description}
        onChange={(e) => handleChange('description', e.target.value)}
        placeholder="• Designed user-friendly interfaces for web and mobile applications.&#10;• Worked with teams to improve product features and overall user experience."
      />
    </div>
  );
}

export default EmploymentEntryForm;