import DocumentPreview from './DocumentPreview';

function PreviewPanel({ formData }) {
  return (
    <div className="w-96 bg-white border-l border-gray-200 p-6">
      <div className="bg-gray-50 rounded-lg p-6 min-h-[600px]">
        <DocumentPreview formData={formData} />
      </div>
      
      <div className="flex items-center justify-center mt-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Saved
        </div>
      </div>
    </div>
  );
}

export default PreviewPanel;