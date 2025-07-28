import { useState } from 'react';
import { ChevronUp, ChevronDown, Trash2, Bold, Italic, List, MoreHorizontal, Link, Plus } from 'lucide-react';

function EmploymentHistoryForm() {
  const [experiences, setExperiences] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});

  const addExperience = () => {
    const newId = Date.now().toString();
    const newExperience = {
      id: newId,
      jobTitle: '',
      company: '',
      startDate: '',
      endDate: '',
      location: '',
      description: ''
    };
    
    setExperiences(prev => [...prev, newExperience]);
    setExpandedItems(prev => ({ ...prev, [newId]: true }));
  };

  const removeExperience = (id) => {
    setExperiences(prev => prev.filter(exp => exp.id !== id));
    setExpandedItems(prev => {
      const newExpanded = { ...prev };
      delete newExpanded[id];
      return newExpanded;
    });
  };

  const updateExperience = (id, field, value) => {
    setExperiences(prev => 
      prev.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  const toggleExpanded = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Employment history</h1>
        <button className="p-2 text-gray-400 hover:text-gray-600">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      
      <p className="text-gray-600 mb-8">
        Show employers your past experience and what you have accomplished. Include simple, clear examples with action verbs to demonstrate your skills.
      </p>
      
      <div className="space-y-4">
        {experiences.map((experience) => (
          <div key={experience.id} className="border border-gray-200 rounded-lg">
            {/* Experience Entry Header */}
            <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <h3 className="font-medium text-gray-900">
                  {experience.jobTitle || 'Untitled'}
                </h3>
                <button
                  onClick={() => toggleExpanded(experience.id)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  {expandedItems[experience.id] ? 
                    <ChevronUp className="w-4 h-4" /> : 
                    <ChevronDown className="w-4 h-4" />
                  }
                </button>
              </div>
              <button 
                onClick={() => removeExperience(experience.id)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Experience Entry Form */}
            {expandedItems[experience.id] && (
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job title</label>
                    <input
                      type="text"
                      value={experience.jobTitle}
                      onChange={(e) => updateExperience(experience.id, 'jobTitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Product Designer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company name</label>
                    <input
                      type="text"
                      value={experience.company}
                      onChange={(e) => updateExperience(experience.id, 'company', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Apple Inc."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start date</label>
                    <input
                      type="text"
                      value={experience.startDate}
                      onChange={(e) => updateExperience(experience.id, 'startDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Jan 2016"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End date</label>
                    <input
                      type="text"
                      value={experience.endDate}
                      onChange={(e) => updateExperience(experience.id, 'endDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Feb 2019"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={experience.location}
                      onChange={(e) => updateExperience(experience.id, 'location', e.target.value)}
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
                    value={experience.description}
                    onChange={(e) => updateExperience(experience.id, 'description', e.target.value)}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 border-t-0 rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="• Designed user-friendly interfaces for web and mobile applications.&#10;• Worked with teams to improve product features and overall user experience."
                  />
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add Experience Button */}
        <button 
          onClick={addExperience}
          className="w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:border-gray-400 hover:bg-gray-100 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2 text-gray-600 font-medium">
            <Plus className="w-5 h-5" />
            Add work experience
          </div>
        </button>
      </div>
    </div>
  );
}

export default EmploymentHistoryForm;