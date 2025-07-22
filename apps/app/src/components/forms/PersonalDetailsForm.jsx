import { Camera, Plus } from 'lucide-react';

function PersonalDetailsForm({ formData, handleInputChange, showAdditional, setShowAdditional }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Personal details
      </h1>
      <p className="text-gray-600 mb-8">
        Personal details such as name and job title are essential in a resume to
        give the recruiter a quick overview of the candidate.
      </p>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First name
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="David"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Guerrero Diaz"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job title
          </label>
          <input
            type="text"
            value={formData.jobTitle}
            onChange={(e) => handleInputChange("jobTitle", e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Frontend developer"
          />
        </div>

        <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-100">
          <Camera className="w-5 h-5 text-gray-500" />
          <span className="text-gray-700 font-medium">Add photo</span>
        </div>

        <button
          onClick={() => setShowAdditional(!showAdditional)}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
        >
          {showAdditional ? (
            <span className="w-4 h-4 flex items-center justify-center text-lg leading-none">
              −
            </span>
          ) : (
            <Plus className="w-4 h-4" />
          )}
          {showAdditional
            ? "Hide additional details"
            : "Show additional details"}
        </button>

        {showAdditional && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nationality
                </label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) =>
                    handleInputChange("nationality", e.target.value)
                  }
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="American"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Driver's License
                </label>
                <input
                  type="text"
                  value={formData.driversLicense}
                  onChange={(e) =>
                    handleInputChange("driversLicense", e.target.value)
                  }
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="D74837465"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Birth date
              </label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange("birthDate", e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PersonalDetailsForm;