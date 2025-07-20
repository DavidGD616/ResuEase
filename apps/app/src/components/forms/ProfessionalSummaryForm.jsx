function ProfessionalSummaryForm({ formData, handleInputChange }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Professional summary</h1>
      <p className="text-gray-600 mb-8">
        Include your professional title, years of experience, and your most impressive achievements. Each achievement should be measurable and expressed in numbers.
      </p>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Summary</label>
        <textarea
          value={formData.about}
          onChange={(e) => handleInputChange('about', e.target.value)}
          rows="6"
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g. Passionate frontend developer with 3+ years of experience..."
        />
      </div>
    </div>
  );
}

export default ProfessionalSummaryForm;