import RichTextEditor from '../shared/RichTextEditor';

function CustomSectionEntryForm({ entry, onUpdate }) {
  const handleChange = (field, value) => {
    onUpdate(entry.id, field, value);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header and Subheader */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Header</label>
          <input
            type="text"
            value={entry.header}
            onChange={(e) => handleChange('header', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Foundation"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subheader</label>
          <input
            type="text"
            value={entry.subheader}
            onChange={(e) => handleChange('subheader', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Isaac Asimov"
          />
        </div>
      </div>

      <RichTextEditor
        value={entry.description}
        onChange={(e) => handleChange('description', e.target.value)}
        placeholder="Asimov's Foundation is a groundbreaking science fiction series that explores themes of humanity, power, and the fate of civilizations."
        label=""
      />
    </div>
  );
}

export default CustomSectionEntryForm;