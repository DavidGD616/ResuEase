import type { FormData } from '../types/resume';

export const processHeaderData = (formData: FormData) => ({
  fullName: (formData.firstName + " " + formData.lastName).trim() || "",
  jobTitle: formData.jobTitle || "",
  contact: {
    location: formData.location,
    phone: formData.phone,
    email: formData.email,
    portfolio: formData.portfolio,
  },
});

export const processSectionData = {
  summary: (formData: FormData) => ({
    title: "Professional Summary",
    content: formData.about,
    isEmpty: !formData.about,
  }),

  employment: (formData: FormData) => ({
    title: "Professional Experience",
    items: formData.employment || [],
    isEmpty: !formData.employment?.length,
  }),

  internships: (formData: FormData) => ({
    title: "Internship Experience",
    items: formData.internships || [],
    isEmpty: !formData.internships?.length,
  }),

  education: (formData: FormData) => ({
    title: "Education",
    items: formData.education || [],
    isEmpty: !formData.education?.length,
  }),

  projects: (formData: FormData) => ({
    title: "Projects",
    items: formData.projects || [],
    isEmpty: !formData.projects?.length,
  }),

  languages: (formData: FormData) => ({
    title: "Languages",
    items: formData.languages || [],
    isEmpty: !formData.languages?.length,
    displayType: "inline" as const,
  }),

  courses: (formData: FormData) => ({
    title: "Professional Development",
    items: formData.courses || [],
    isEmpty: !formData.courses?.length,
  }),

  skills: (formData: FormData) => ({
    title: "Skills",
    items: formData.skills?.filter((skill) => skill?.skillName) || [],
    isEmpty: !formData.skills?.length,
    displayType: "inline" as const,
  }),

  technologiesSkills: (formData: FormData) => ({
    title: "Technologies",
    items:
      formData.technologiesSkills?.filter(
        (tech) => tech?.technologiesSkillName
      ) || [],
    isEmpty: !formData.technologiesSkills?.length,
    displayType: "inline" as const,
  }),

  hobbies: (formData: FormData) => ({
    title: "Interests",
    items: formData.hobbies?.filter((hobby) => hobby?.hobbyName) || [],
    isEmpty: !formData.hobbies?.length,
    displayType: "inline" as const,
  }),

  links: (formData: FormData) => ({
    title: "Portfolio & Links",
    items: formData.links || [],
    isEmpty: !formData.links?.length,
  }),

  references: (formData: FormData) => ({
    title: "References",
    items: formData.references || [],
    isEmpty: !formData.references?.length,
  }),

  // Handle custom sections
  custom: (formData: FormData, sectionId: string) => {
    const sectionKey = `customEntries_${sectionId}`;
    const entries = (formData as Record<string, unknown[]>)[sectionKey] || [];

    return {
      title: "Custom Section",
      items: entries,
      isEmpty: !entries.length,
    };
  },
};
