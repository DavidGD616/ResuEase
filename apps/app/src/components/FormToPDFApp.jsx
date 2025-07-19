import React, { useState } from 'react';
import FormSection from './FormSection';
import PreviewSection from './PreviewSection';


function FormToPDFApp() {
    const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    occupation: '',
    company: '',
    experience: '',
    skills: '',
    about: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Form to PDF Generator</h1>
          <p className="text-gray-600">Fill out the form and see live preview, then export to PDF</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <FormSection 
            formData={formData} 
            onInputChange={handleInputChange} 
          />
          <PreviewSection 
            formData={formData} 
          />
        </div>
      </div>
    </div>
  );
}

export default FormToPDFApp;