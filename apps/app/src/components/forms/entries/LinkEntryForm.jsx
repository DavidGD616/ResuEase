function LinkEntryForm({ link, onUpdate }) {
  const handleChange = (field, value) => {
    onUpdate(link.id, field, value);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Link title and URL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Link title</label>
          <input
            type="text"
            value={link.linkTitle}
            onChange={(e) => handleChange('linkTitle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="My Website"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
          <input
            type="url"
            value={link.url}
            onChange={(e) => handleChange('url', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="www.example.com"
          />
        </div>
      </div>
    </div>
  );
}

export default LinkEntryForm;