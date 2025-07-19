import React from 'react';
import InputField from './InputField';
import TextAreaField from './TextAreaField';

function FormSection({ formData, onInputChange }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        Fill Your Information
      </h2>
      
      <div className="space-y-4">
        <InputField
          label="Full Name"
          type="text"
          value={formData.fullName}
          onChange={(value) => onInputChange('fullName', value)}
          placeholder="Enter your full name"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(value) => onInputChange('email', value)}
            placeholder="your.email@example.com"
          />
          <InputField
            label="Phone"
            type="tel"
            value={formData.phone}
            onChange={(value) => onInputChange('phone', value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <InputField
          label="Address"
          type="text"
          value={formData.address}
          onChange={(value) => onInputChange('address', value)}
          placeholder="Your address"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Date of Birth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(value) => onInputChange('dateOfBirth', value)}
          />
          <InputField
            label="Occupation"
            type="text"
            value={formData.occupation}
            onChange={(value) => onInputChange('occupation', value)}
            placeholder="Your occupation"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Company"
            type="text"
            value={formData.company}
            onChange={(value) => onInputChange('company', value)}
            placeholder="Your company"
          />
          <InputField
            label="Experience"
            type="text"
            value={formData.experience}
            onChange={(value) => onInputChange('experience', value)}
            placeholder="Years of experience"
          />
        </div>

        <TextAreaField
          label="Skills"
          value={formData.skills}
          onChange={(value) => onInputChange('skills', value)}
          placeholder="List your skills separated by commas"
          rows={3}
        />

        <TextAreaField
          label="About"
          value={formData.about}
          onChange={(value) => onInputChange('about', value)}
          placeholder="Tell us about yourself"
          rows={4}
        />
      </div>
    </div>
  );
}

export default FormSection;