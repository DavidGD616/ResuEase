export const processHeaderData = (formData) => ({
  fullName: (formData.firstName + " " + formData.lastName).trim() || "",
  jobTitle: formData.jobTitle || "",
  contact: {
    location: formData.location,
    phone: formData.phone,
    email: formData.email
  },
  additionalInfo: {
    nationality: formData.nationality,
    driversLicense: formData.driversLicense,
    birthDate: formData.birthDate
  }
});

export const processSectionData = {
  summary: (formData) => ({
    title: "Professional Summary",
    content: formData.about,
    isEmpty: !formData.about
  }),

  employment: (formData) => ({
    title: "Professional Experience",
    items: formData.employment || [],
    isEmpty: !formData.employment?.length
  }),

  internships: (formData) => ({
    title: "Internship Experience", 
    items: formData.internships || [],
    isEmpty: !formData.internships?.length
  }),

  education: (formData) => ({
    title: "Education",
    items: formData.education || [],
    isEmpty: !formData.education?.length
  }),

  projects: (formData) => ({
    title: "Projects",
    items: formData.projects || [],
    isEmpty: !formData.projects?.length
  }),

  languages: (formData) => ({
    title: "Languages",
    items: formData.languages || [],
    isEmpty: !formData.languages?.length,
    displayType: 'inline'
  }),

  courses: (formData) => ({
    title: "Professional Development",
    items: formData.courses || [],
    isEmpty: !formData.courses?.length
  }),

  skills: (formData) => ({
    title: "Skills",
    items: formData.skills?.filter(skill => skill?.skillName) || [],
    isEmpty: !formData.skills?.length,
    displayType: 'inline'
  }),

  technologiesSkills: (formData) => ({
    title: "Technologies", 
    items: formData.technologiesSkills?.filter(tech => tech?.technologiesSkillName) || [],
    isEmpty: !formData.technologiesSkills?.length,
    displayType: 'inline'
  }),

  hobbies: (formData) => ({
    title: "Interests",
    items: formData.hobbies?.filter(hobby => hobby?.hobbyName) || [],
    isEmpty: !formData.hobbies?.length,
    displayType: 'inline'
  }),

  links: (formData) => ({
    title: "Portfolio & Links",
    items: formData.links || [],
    isEmpty: !formData.links?.length
  }),

  references: (formData) => ({
    title: "References",
    items: formData.references || [],
    isEmpty: !formData.references?.length
  }),

  // Handle custom sections
  custom: (formData, sectionId) => {
    const sectionKey = `customEntries_${sectionId}`;
    const entries = formData[sectionKey] || [];
    
    return {
      title: "Custom Section",
      items: entries,
      isEmpty: !entries.length
    };
  }
};