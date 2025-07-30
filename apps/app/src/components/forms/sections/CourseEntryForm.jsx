function CourseEntryForm({ course, onUpdate }) {
  const handleChange = (field, value) => {
    onUpdate(course.id, field, value);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Institution */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
        <input
          type="text"
          value={course.institution}
          onChange={(e) => handleChange('institution', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Harvard University"
        />
      </div>

      {/* Start Date and End Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Start date</label>
          <input
            type="text"
            value={course.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Jan 2016"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">End date</label>
          <input
            type="text"
            value={course.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Feb 2019"
          />
        </div>
      </div>

      {/* Course Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
        <input
          type="text"
          value={course.courseName}
          onChange={(e) => handleChange('courseName', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Advanced Product Design"
        />
      </div>
    </div>
  );
}

export default CourseEntryForm;