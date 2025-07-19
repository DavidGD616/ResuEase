import React from 'react';
import DocumentPreview from './DocumentPreview';
import { exportToPDF } from '../utils/pdfExporter';

function PreviewSection({ formData }) {
  const handleExport = () => {
    exportToPDF(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          Live Preview
        </h2>
        <button
          onClick={handleExport}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          Export PDF
        </button>
      </div>

      <div className="border rounded-lg p-6 bg-gray-50 min-h-[600px]">
        <DocumentPreview formData={formData} />
      </div>
    </div>
  );
}

export default PreviewSection;