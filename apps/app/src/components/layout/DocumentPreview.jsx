import { useState, useEffect, useRef, useMemo } from 'react';

function DocumentPreview({ formData, sidebarItems = [] }) {
  const [pages, setPages] = useState([]);
  const contentRef = useRef(null);

  // Memoize ordered sections to prevent infinite re-renders
  const orderedSections = useMemo(() => {
    return sidebarItems
      .filter(item => !item.fixed && item.id !== 'additional')
      .sort((a, b) => a.order - b.order)
      .map(item => item.id);
  }, [sidebarItems]);

  // Calculate pages based on content height
  useEffect(() => {
    // Add a small delay to ensure content is rendered
    const calculatePages = () => {
      if (!contentRef.current) return;

      const pageHeight = 11 * 96 - (0.75 * 2 * 96); // 11 inches minus top/bottom margins in pixels
      const content = contentRef.current;
      const contentHeight = content.scrollHeight;
      
      if (contentHeight <= pageHeight) {
        setPages([1]);
      } else {
        const numberOfPages = Math.ceil(contentHeight / pageHeight);
        setPages(Array.from({ length: numberOfPages }, (_, i) => i + 1));
      }
    };

    // Use setTimeout to ensure DOM is updated before calculating
    const timeoutId = setTimeout(calculatePages, 100);
    return () => clearTimeout(timeoutId);
  }, [formData, orderedSections]);

  // Helper function to render individual sections
  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        return formData.about ? (
          <div className="mb-6">
            <h2
              style={{
                fontSize: "12pt",
                fontWeight: "bold",
                marginBottom: "8pt",
                textTransform: "uppercase",
                borderBottom: "1px solid #000",
                paddingBottom: "2pt",
              }}
            >
              Professional Summary
            </h2>
            <p
              style={{
                fontSize: "11pt",
                lineHeight: "1.3",
                textAlign: "justify",
              }}
            >
              {formData.about}
            </p>
          </div>
        ) : null;

      case 'employment':
        return formData.employment && formData.employment.length > 0 ? (
          <div className="mb-6">
            <h2
              style={{
                fontSize: "12pt",
                fontWeight: "bold",
                marginBottom: "8pt",
                textTransform: "uppercase",
                borderBottom: "1px solid #000",
                paddingBottom: "2pt",
              }}
            >
              Professional Experience
            </h2>
            {formData.employment.map((job, index) => (
              <div key={job.id || index} style={{ marginBottom: "12pt" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: "4pt",
                  }}
                >
                  <div>
                    <strong style={{ fontSize: "11pt" }}>
                      {job.jobTitle || "Position Title"}
                    </strong>
                    {job.company && (
                      <span style={{ fontSize: "11pt" }}>
                        {" "}
                        at <em>{job.company}</em>
                      </span>
                    )}
                    {job.location && (
                      <span style={{ fontSize: "10pt", color: "#333" }}>
                        {", "}
                        {job.location}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "10pt", color: "#333" }}>
                    {job.startDate &&
                      job.endDate &&
                      `${job.startDate} - ${job.endDate}`}
                  </div>
                </div>
                {job.description && (
                  <div
                    style={{
                      fontSize: "11pt",
                      lineHeight: "1.3",
                      marginLeft: "12pt",
                      textAlign: "justify",
                    }}
                  >
                    {job.description}
                  </div>
                )}
                {job.bulletPoints && job.bulletPoints.length > 0 && (
                  <div
                    style={{
                      fontSize: "11pt",
                      lineHeight: "1.3",
                      marginLeft: "12pt",
                      marginTop: "4pt",
                    }}
                  >
                    {job.bulletPoints.map((bullet, bulletIndex) => (
                      <div key={bulletIndex} style={{ marginBottom: "2pt" }}>
                        • {bullet}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : null;

      case 'internships':
        return formData.internships && formData.internships.length > 0 ? (
          <div className="mb-6">
            <h2
              style={{
                fontSize: "12pt",
                fontWeight: "bold",
                marginBottom: "8pt",
                textTransform: "uppercase",
                borderBottom: "1px solid #000",
                paddingBottom: "2pt",
              }}
            >
              Internship Experience
            </h2>
            {formData.internships.map((internship, index) => (
              <div key={internship.id || index} style={{ marginBottom: "12pt" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: "4pt",
                  }}
                >
                  <div>
                    <strong style={{ fontSize: "11pt" }}>
                      {internship.jobTitle || "Internship Position"}
                    </strong>
                    {internship.company && (
                      <span style={{ fontSize: "11pt" }}>
                        {" "}
                        at <em>{internship.company}</em>
                      </span>
                    )}
                    {internship.location && (
                      <span style={{ fontSize: "10pt", color: "#333" }}>
                        {", "}
                        {internship.location}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "10pt", color: "#333" }}>
                    {internship.startDate &&
                      internship.endDate &&
                      `${internship.startDate} - ${internship.endDate}`}
                  </div>
                </div>
                {internship.description && (
                  <div
                    style={{
                      fontSize: "11pt",
                      lineHeight: "1.3",
                      marginLeft: "12pt",
                      textAlign: "justify",
                    }}
                  >
                    {internship.description}
                  </div>
                )}
                {internship.bulletPoints &&
                  internship.bulletPoints.length > 0 && (
                    <div
                      style={{
                        fontSize: "11pt",
                        lineHeight: "1.3",
                        marginLeft: "12pt",
                        marginTop: "4pt",
                      }}
                    >
                      {internship.bulletPoints.map((bullet, bulletIndex) => (
                        <div key={bulletIndex} style={{ marginBottom: "2pt" }}>
                          • {bullet}
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>
        ) : null;

      case 'education':
        return formData.education && formData.education.length > 0 ? (
          <div className="mb-6">
            <h2
              style={{
                fontSize: "12pt",
                fontWeight: "bold",
                marginBottom: "8pt",
                textTransform: "uppercase",
                borderBottom: "1px solid #000",
                paddingBottom: "2pt",
              }}
            >
              Education
            </h2>
            {formData.education.map((edu, index) => (
              <div key={edu.id || index} style={{ marginBottom: "8pt" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <div>
                    <strong style={{ fontSize: "11pt" }}>
                      {edu.degree || "Degree"}
                    </strong>
                    {edu.institution && (
                      <span style={{ fontSize: "11pt" }}>
                        {", "}
                        {edu.institution}
                      </span>
                    )}
                    {edu.location && (
                      <span style={{ fontSize: "10pt", color: "#333" }}>
                        {", "}
                        {edu.location}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "10pt", color: "#333" }}>
                    {edu.dateRange || "Date"}
                  </div>
                </div>
                {edu.description && (
                  <div
                    style={{
                      fontSize: "11pt",
                      lineHeight: "1.3",
                      marginLeft: "12pt",
                      marginTop: "4pt",
                    }}
                  >
                    {edu.description}
                  </div>
                )}
                {edu.bulletPoints && edu.bulletPoints.length > 0 && (
                  <div
                    style={{
                      fontSize: "11pt",
                      lineHeight: "1.3",
                      marginLeft: "12pt",
                      marginTop: "4pt",
                    }}
                  >
                    {edu.bulletPoints.map((bullet, bulletIndex) => (
                      <div key={bulletIndex} style={{ marginBottom: "2pt" }}>
                        • {bullet}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : null;

      case 'projects':
        return formData.projects && formData.projects.length > 0 ? (
          <div className="mb-6">
            <h2
              style={{
                fontSize: "12pt",
                fontWeight: "bold",
                marginBottom: "8pt",
                textTransform: "uppercase",
                borderBottom: "1px solid #000",
                paddingBottom: "2pt",
              }}
            >
              Projects
            </h2>
            {formData.projects.map((project, index) => (
              <div key={project.id || index} style={{ marginBottom: "12pt" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: "4pt",
                  }}
                >
                  <div>
                    {project.url ? (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: "11pt",
                          fontWeight: "bold",
                          color: "#000",
                          textDecoration: "underline",
                        }}
                      >
                        {project.name || "Project Name"}
                      </a>
                    ) : (
                      <strong style={{ fontSize: "11pt" }}>
                        {project.name || "Project Name"}
                      </strong>
                    )}
                  </div>
                  <div style={{ fontSize: "10pt", color: "#333" }}>
                    {project.dateRange}
                  </div>
                </div>
                {project.bulletPoints && project.bulletPoints.length > 0 && (
                  <div
                    style={{
                      fontSize: "11pt",
                      lineHeight: "1.3",
                      marginLeft: "12pt",
                      marginTop: "4pt",
                    }}
                  >
                    {project.bulletPoints.map((bullet, bulletIndex) => (
                      <div key={bulletIndex} style={{ marginBottom: "2pt" }}>
                        • {bullet}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : null;

      case 'languages':
        return formData.languages && formData.languages.length > 0 ? (
          <div className="mb-6">
            <h2
              style={{
                fontSize: "12pt",
                fontWeight: "bold",
                marginBottom: "8pt",
                textTransform: "uppercase",
                borderBottom: "1px solid #000",
                paddingBottom: "2pt",
              }}
            >
              Languages
            </h2>
            <div style={{ fontSize: "11pt", lineHeight: "1.3" }}>
              {formData.languages.map((language, index) => {
                // Handle both object format (new) and string format (legacy)
                const languageText =
                  typeof language === "object" && language !== null
                    ? language.language &&
                      language.proficiency &&
                      language.proficiency !== "Not applicable"
                      ? `${language.language} (${language.proficiency})`
                      : language.language || ""
                    : String(language || "");

                return (
                  <span key={language.id || index}>
                    {languageText}
                    {index < formData.languages.length - 1 ? " • " : ""}
                  </span>
                );
              })}
            </div>
          </div>
        ) : null;
      
      case 'courses':
        return formData.courses && formData.courses.length > 0 ? (
          <div className="mb-6">
            <h2
              style={{
                fontSize: "12pt",
                fontWeight: "bold",
                marginBottom: "8pt",
                textTransform: "uppercase",
                borderBottom: "1px solid #000",
                paddingBottom: "2pt",
              }}
            >
              Professional Development
            </h2>
            {formData.courses.map((course, index) => (
              <div key={course.id || index} style={{ marginBottom: "6pt" }}>
                <strong style={{ fontSize: "11pt" }}>
                  {course.courseName || "Course Name"}
                </strong>
                {course.institution && (
                  <span style={{ fontSize: "11pt" }}>
                    {", "}
                    {course.institution}
                  </span>
                )}
                {course.startDate && course.endDate && (
                  <span style={{ fontSize: "10pt", color: "#333" }}>
                    {" ("}
                    {course.startDate} - {course.endDate}
                    {")"}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : null;

      case 'skills':
        return formData.skills && Array.isArray(formData.skills) && formData.skills.length > 0 ? (
          <div className="mb-6">
            <div style={{ fontSize: "11pt", lineHeight: "1.3" }}>
              <strong>Skills:</strong>{" "}
              {formData.skills
                .filter(skill => skill && skill.skillName)
                .map((skill, index, filteredArray) => (
                  <span key={skill.id || index}>
                    {skill.skillName}
                    {index < filteredArray.length - 1 ? "; " : ""}
                  </span>
                ))}
            </div>
          </div>
        ) : null;

      case 'technologiesSkills':
        return formData.technologiesSkills && Array.isArray(formData.technologiesSkills) && formData.technologiesSkills.length > 0 ? (
          <div className="mb-6">
            <div style={{ fontSize: "11pt", lineHeight: "1.3" }}>
              <strong>Technologies:</strong>{" "}
              {formData.technologiesSkills
                .filter(techSkill => techSkill && techSkill.technologiesSkillName)
                .map((techSkill, index, filteredArray) => (
                  <span key={techSkill.id || index}>
                    {techSkill.technologiesSkillName}
                    {index < filteredArray.length - 1 ? "; " : ""}
                  </span>
                ))}
            </div>
          </div>
        ) : null;

      case 'hobbies':
        return formData.hobbies && Array.isArray(formData.hobbies) && formData.hobbies.length > 0 ? (
          <div className="mb-6">
            <div style={{ fontSize: "11pt", lineHeight: "1.3" }}>
              <strong>Interests:</strong>{" "}
              {formData.hobbies
                .filter(hobby => hobby && hobby.hobbyName)
                .map((hobby, index, filteredArray) => (
                  <span key={hobby.id || index}>
                    {hobby.hobbyName}
                    {index < filteredArray.length - 1 ? "; " : ""}
                  </span>
                ))}
            </div>
          </div>
        ) : null;

      case 'links':
        return formData.links && formData.links.length > 0 ? (
          <div className="mb-6">
            <h2
              style={{
                fontSize: "12pt",
                fontWeight: "bold",
                marginBottom: "8pt",
                textTransform: "uppercase",
                borderBottom: "1px solid #000",
                paddingBottom: "2pt",
              }}
            >
              Portfolio & Links
            </h2>
            {formData.links.map((link, index) => (
              <div key={link.id || index} style={{ marginBottom: "6pt" }}>
                <div style={{ fontSize: "11pt" }}>
                  <strong>{link.linkTitle || "Link"}</strong>
                  {link.url && (
                    <span style={{ fontSize: "10pt", color: "#333" }}>
                      {": "}
                      {link.url}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : null;
      
      case 'references':
        return formData.references && formData.references.length > 0 ? (
          <div className="mb-6">
            <h2
              style={{
                fontSize: "12pt",
                fontWeight: "bold",
                marginBottom: "8pt",
                textTransform: "uppercase",
                borderBottom: "1px solid #000",
                paddingBottom: "2pt",
              }}
            >
              References
            </h2>
            {formData.references.map((ref, index) => (
              <div key={ref.id || index} style={{ marginBottom: "8pt" }}>
                <div style={{ fontSize: "11pt" }}>
                  <strong>{ref.referentName || "Reference Name"}</strong>
                  {ref.referentCompany && (
                    <span>
                      {", "}
                      {ref.position ? `${ref.position} at ` : ""}
                      {ref.referentCompany}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: "10pt", color: "#333" }}>
                  {ref.referentPhone && <span>{ref.referentPhone}</span>}
                  {ref.referentPhone && ref.referentEmail && <span> • </span>}
                  {ref.referentEmail && <span>{ref.referentEmail}</span>}
                </div>
              </div>
            ))}
          </div>
        ) : null;

      // Handle custom sections
      default:
        if (sectionId.startsWith('custom-')) {
          const sectionKey = `customEntries_${sectionId}`;
          const entries = formData[sectionKey];
          
          if (entries && Array.isArray(entries) && entries.length > 0) {
            return (
              <div className="mb-6">
                <h2
                  style={{
                    fontSize: "12pt",
                    fontWeight: "bold",
                    marginBottom: "8pt",
                    textTransform: "uppercase",
                    borderBottom: "1px solid #000",
                    paddingBottom: "2pt",
                  }}
                >
                  Custom Section
                </h2>
                {entries.map((entry, index) => (
                  <div key={entry.id || index} style={{ marginBottom: "12pt" }}>
                    {/* Entry Header and Subheader */}
                    {(entry.header || entry.subheader) && (
                      <div style={{ marginBottom: "4pt" }}>
                        {entry.header && (
                          <strong style={{ fontSize: "11pt" }}>
                            {entry.header}
                          </strong>
                        )}
                        {entry.subheader && (
                          <span
                            style={{ fontSize: "11pt", fontStyle: "italic" }}
                          >
                            {entry.header ? " - " : ""}
                            {entry.subheader}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Entry Description */}
                    {entry.description && (
                      <div
                        style={{
                          fontSize: "11pt",
                          lineHeight: "1.3",
                          marginLeft: "12pt",
                          marginBottom: "4pt",
                          textAlign: "justify",
                        }}
                      >
                        {entry.description}
                      </div>
                    )}

                    {/* Entry Bullet Points */}
                    {entry.bulletPoints && entry.bulletPoints.length > 0 && (
                      <div
                        style={{
                          fontSize: "11pt",
                          lineHeight: "1.3",
                          marginLeft: "12pt",
                          marginTop: "4pt",
                        }}
                      >
                        {entry.bulletPoints.map((bullet, bulletIndex) => (
                          <div
                            key={bulletIndex}
                            style={{ marginBottom: "2pt" }}
                          >
                            • {bullet}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          }
        }
        return null;
    }
  };

  const renderContent = () => {
    return (
      <div ref={contentRef}>
        {/* Header Section - Always first */}
        <div className="text-center mb-6 pb-4 border-b border-black">
          <h1
            style={{
              fontSize: "16pt",
              fontWeight: "bold",
              marginBottom: "8pt",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {(formData.firstName + " " + formData.lastName).toUpperCase() ||
              "DAVID GUERRERO DIAZ"}
          </h1>

          <div style={{ fontSize: "11pt", marginBottom: "4pt" }}>
            {formData.jobTitle || ""}
          </div>

          <div style={{ fontSize: "10pt", color: "#333" }}>
            {formData.location && <span>{formData.location}</span>}
            {formData.location && (formData.phone || formData.email) && <span> • </span>}
            {formData.phone && <span>{formData.phone}</span>}
            {formData.phone && formData.email && <span> • </span>}
            {formData.email && <span>{formData.email}</span>}
          </div>

          {/* Additional personal details */}
          {(formData.nationality ||
            formData.driversLicense ||
            formData.birthDate) && (
            <div style={{ fontSize: "10pt", color: "#333", marginTop: "4pt" }}>
              {formData.nationality && (
                <span>Nationality: {formData.nationality}</span>
              )}
              {formData.nationality && formData.driversLicense && (
                <span> • </span>
              )}
              {formData.driversLicense && (
                <span>License: {formData.driversLicense}</span>
              )}
              {(formData.nationality || formData.driversLicense) &&
                formData.birthDate && <span> • </span>}
              {formData.birthDate && <span>DOB: {formData.birthDate}</span>}
            </div>
          )}
        </div>

        {/* Render sections in sidebar order */}
        {orderedSections.map(sectionId => {
          const section = renderSection(sectionId);
          return section ? <div key={sectionId}>{section}</div> : null;
        })}
      </div>
    );
  };

  return (
    <div style={{
      fontFamily: 'Times, "Times New Roman", serif',
      fontSize: '11pt',
      lineHeight: '1.2',
      color: '#000'
    }}>
      {pages.map((pageNum) => (
        <div key={pageNum} className="bg-white" style={{
          width: '8.5in',
          height: '11in',
          padding: '0.75in',
          pageBreakAfter: pageNum < pages.length ? 'always' : 'avoid',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            height: '100%',
            overflow: 'hidden',
            transform: `translateY(-${(pageNum - 1) * (11 * 96 - 0.75 * 2 * 96)}px)`
          }}>
            {pageNum === 1 ? renderContent() : null}
          </div>
        </div>
      ))}
      
      {/* Hidden content for measurement */}
      <div style={{ 
        position: 'absolute', 
        left: '-9999px', 
        width: '8.5in', 
        padding: '0.75in' 
      }}>
        {renderContent()}
      </div>
    </div>
  );
}

export default DocumentPreview;