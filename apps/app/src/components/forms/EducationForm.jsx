import { useState } from 'react';
import { ChevronUp, ChevronDown, Trash2, Bold, Italic, List, MoreHorizontal, Link } from 'lucide-react';

function EducationForm({ formData, handleInputChange }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [educationData, setEducationData] = useState({
    institution: 'Harvard University',
    degree: "Bachelor's Degree in Design",
    startDate: 'Jan 2016',
    endDate: 'Feb 2019',
    location: 'Washington, D.C.',
    description: 'Graduated with honors, recognized for outstanding achievement in Product Design.'
  });

  const handleEducationChange = (field, value) => {
    setEducationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Education</h1>
        <button className="p-2 text-gray-400 hover:text-gray-600">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      
      <p className="text-gray-600 mb-8">
        Add the name of your school, where it is located, what degree you obtained, your field of study, and your graduation year.
      </p>
      
      <div className="border border-gray-200 rounded-lg">
        {/* Education Entry Header */}
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <h3 className="font-medium text-gray-900">Untitled</h3>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Education Entry Form */}
        {isExpanded && (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
                <input
                  type="text"
                  value={educationData.institution}
                  onChange={(e) => handleEducationChange('institution', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Harvard University"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Degree</label>
                <input
                  type="text"
                  value={educationData.degree}
                  onChange={(e) => handleEducationChange('degree', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Bachelor's Degree in Design"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start date</label>
                <input
                  type="text"
                  value={educationData.startDate}
                  onChange={(e) => handleEducationChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Jan 2016"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End date</label>
                <input
                  type="text"
                  value={educationData.endDate}
                  onChange={(e) => handleEducationChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Feb 2019"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={educationData.location}
                  onChange={(e) => handleEducationChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Washington, D.C."
                />
              </div>
            </div>

            {/* Rich Text Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              
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
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600">
                  <Link className="w-4 h-4" />
                </button>
              </div>
              
              {/* Text Area */}
              <textarea
                value={educationData.description}
                onChange={(e) => handleEducationChange('description', e.target.value)}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 border-t-0 rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Graduated with honors, recognized for outstanding achievement in Product Design."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EducationForm;