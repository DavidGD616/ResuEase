function ReferenceEntryForm({ reference, onUpdate }) {
  const handleChange = (field, value) => {
    onUpdate(reference.id, field, value);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Referent Name and Company */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Referent name</label>
          <input
            type="text"
            value={reference.referentName}
            onChange={(e) => handleChange('referentName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John Smith"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Referent company</label>
          <input
            type="text"
            value={reference.referentCompany}
            onChange={(e) => handleChange('referentCompany', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Apple Inc."
          />
        </div>
      </div>

      {/* Referent Email and Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Referent email</label>
          <input
            type="email"
            value={reference.referentEmail}
            onChange={(e) => handleChange('referentEmail', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Referent phone</label>
          <input
            type="tel"
            value={reference.referentPhone}
            onChange={(e) => handleChange('referentPhone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="999 888 7777"
          />
        </div>
      </div>
    </div>
  );
}

export default ReferenceEntryForm;