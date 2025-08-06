import DocumentPreview from './DocumentPreview';

function PreviewPanel({ formData }) {
  return (
    <div className="w-auto bg-gray-50 border-l border-gray-200 p-6">
      <div className="w-full max-w-full flex justify-center">
        <div
          className="relative bg-gray-50 overflow-hidden rounded-lg shadow-lg inset-shadow-sm w-full"
          style={{
            aspectRatio: "0.7076648841354723",
            // Use min() to ensure it doesn't exceed container width
            maxWidth: "min(100%, calc((100vh - 104px) * 0.7076648841354723))",
            // Height will automatically adjust based on aspect ratio
          }}
        >
          <DocumentPreview formData={formData} />
        </div>
      </div>

      <div className="flex items-center justify-center mt-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Saved
        </div>
      </div>
    </div>
  );
}

export default PreviewPanel;