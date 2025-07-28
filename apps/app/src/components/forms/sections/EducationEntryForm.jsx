import RichTextEditor from '../shared/RichTextEditor';

function EducationEntryForm({ education, onUpdate }) {
  const handleChange = (field, value) => {
    onUpdate(education.id, field, value);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
          <input
            type="text"
            value={education.institution}
            onChange={(e) => handleChange('institution', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Harvard University"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Degree</label>
          <input
            type="text"
            value={education.degree}
            onChange={(e) => handleChange('degree', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Bachelor's Degree in Design"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Start date</label>
          <input
            type="text"
            value={education.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Jan 2016"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">End date</label>
          <input
            type="text"
            value={education.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Feb 2019"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <input
            type="text"
            value={education.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Washington, D.C."
          />
        </div>
      </div>

      <RichTextEditor
        value={education.description}
        onChange={(e) => handleChange('description', e.target.value)}
        placeholder="Graduated with honors, recognized for outstanding achievement in Product Design."
      />
    </div>
  );
}

export default EducationEntryForm;