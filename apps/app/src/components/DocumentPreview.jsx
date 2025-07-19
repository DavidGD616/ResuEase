import React from 'react';

function DocumentPreview({ formData }) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm">
      {/* Header */}
      <div className="text-center border-b-2 border-blue-600 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-blue-900 mb-2">
          {formData.fullName || 'Your Name'}
        </h1>
        <div className="flex justify-center gap-4 text-sm text-gray-600 flex-wrap">
          <div className="flex items-center gap-1">
            {formData.email || 'your.email@example.com'}
          </div>
          <div className="flex items-center gap-1">
            {formData.phone || '+1 (555) 123-4567'}
          </div>
          <div className="flex items-center gap-1">
            {formData.address || 'Your Address'}
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-blue-900 border-b border-gray-200 pb-2 mb-3">
          Personal Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="border-l-4 border-blue-500 pl-3">
            <div className="font-medium text-sm">Date of Birth</div>
            <div className="text-gray-600 text-sm">{formData.dateOfBirth || 'Not specified'}</div>
          </div>
          <div className="border-l-4 border-blue-500 pl-3">
            <div className="font-medium text-sm">Occupation</div>
            <div className="text-gray-600 text-sm">{formData.occupation || 'Not specified'}</div>
          </div>
          <div className="border-l-4 border-blue-500 pl-3">
            <div className="font-medium text-sm">Company</div>
            <div className="text-gray-600 text-sm">{formData.company || 'Not specified'}</div>
          </div>
          <div className="border-l-4 border-blue-500 pl-3">
            <div className="font-medium text-sm">Experience</div>
            <div className="text-gray-600 text-sm">{formData.experience || 'Not specified'}</div>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-blue-900 border-b border-gray-200 pb-2 mb-3">
          Skills
        </h3>
        <div className="bg-gray-50 p-3 rounded border-l-4 border-blue-500">
          <p className="text-sm text-gray-700">
            {formData.skills || 'No skills listed'}
          </p>
        </div>
      </div>

      {/* About */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-blue-900 border-b border-gray-200 pb-2 mb-3">
          About
        </h3>
        <div className="bg-gray-50 p-3 rounded border-l-4 border-blue-500">
          <p className="text-sm text-gray-700">
            {formData.about || 'No description provided'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default DocumentPreview;