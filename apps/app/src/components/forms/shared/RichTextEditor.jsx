import { Bold, Italic, List, ListOrdered, Link } from 'lucide-react';

function RichTextEditor({ value, onChange, placeholder, label = "Description" }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      
      {/* Rich Text Toolbar */}
      <div className="border border-gray-300 rounded-t-md bg-gray-50 p-2 flex items-center gap-1">
        <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600">
          <Bold className="w-4 h-4" />
        </button>
        <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600">
          <Italic className="w-4 h-4" />
        </button>
        <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600">
          <List className="w-4 h-4" />
        </button>
        <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600">
          <ListOrdered className="w-4 h-4" />
        </button>
        <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600">
          <Link className="w-4 h-4" />
        </button>
      </div>
      
      {/* Text Area */}
      <textarea
        value={value}
        onChange={onChange}
        rows="4"
        className="w-full px-3 py-2 border border-gray-300 border-t-0 rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        placeholder={placeholder}
      />
    </div>
  );
}

export default RichTextEditor;