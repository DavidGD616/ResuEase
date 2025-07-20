function DocumentPreview({ formData }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* Document Preview Header */}
      <div className="text-right mb-6 border-b border-gray-200 pb-4">
        <div className="text-xs text-gray-500 mb-1">
          UNITED STATES • {formData.email?.toUpperCase() || 'DAVIDGUERRERO@PROTONMAIL.COM'} •
        </div>
        <h1 className="text-xl font-bold text-gray-900">
          {(formData.firstName + ' ' + formData.lastName).toUpperCase() || 'DAVID GUERRERO DIAZ'}
        </h1>
        <div className="text-sm text-gray-600 mt-1">
          {formData.jobTitle || 'Frontend Developer'}
        </div>
      </div>

      {/* Contact Information */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-900 mb-3">PERSONAL DETAILS</h3>
        <div className="space-y-2 text-xs text-gray-600">
          <div><span className="font-medium">Email:</span> {formData.email || 'your.email@example.com'}</div>
          <div><span className="font-medium">Phone:</span> {formData.phone || '+1 (555) 123-4567'}</div>
          <div><span className="font-medium">Address:</span> {formData.address || 'Your Address'}</div>
          {formData.website && <div><span className="font-medium">Website:</span> {formData.website}</div>}
          {formData.linkedin && <div><span className="font-medium">LinkedIn:</span> {formData.linkedin}</div>}
        </div>
      </div>

      {formData.about && (
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-900 mb-3">PROFESSIONAL SUMMARY</h3>
          <p className="text-xs text-gray-600 leading-relaxed">{formData.about}</p>
        </div>
      )}

      {formData.skills && (
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-900 mb-3">SKILLS</h3>
          <p className="text-xs text-gray-600">{formData.skills}</p>
        </div>
      )}
    </div>
  );
}

export default DocumentPreview;