import { processHeaderData, processSectionData } from "../../utils/resumeDataProcessors";

// Template styles
const styles = {
  document: {
    fontFamily: 'Times, "Times New Roman", serif',
    fontSize: '11pt',
    lineHeight: '1.2',
    color: '#000'
  },
  name: {
    fontSize: "16pt",
    fontWeight: "bold",
    marginBottom: "8pt",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  jobTitle: {
    fontSize: "11pt",
    marginBottom: "4pt"
  },
  contact: {
    fontSize: "10pt",
    color: "#333"
  },
  sectionTitle: {
    fontSize: "12pt",
    fontWeight: "bold",
    marginBottom: "8pt",
    textTransform: "uppercase",
    borderBottom: "1px solid #000",
    paddingBottom: "2pt",
  },
  itemHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: "4pt",
  },
  itemTitle: {
    fontSize: "11pt",
    fontWeight: "bold"
  },
  itemDate: {
    fontSize: "10pt",
    color: "#333"
  },
  itemDescription: {
    fontSize: "11pt",
    lineHeight: "1.3",
    marginLeft: "12pt",
    textAlign: "justify",
  },
  bulletPoints: {
    fontSize: "11pt",
    lineHeight: "1.3",
    marginLeft: "12pt",
    marginTop: "4pt",
  },
  inlineList: {
    fontSize: "11pt",
    lineHeight: "1.3"
  }
};

// Header Component
const HeaderSection = ({ data }) => (
  <div className="text-center mb-6 pb-4 border-b border-black">
    <h1 style={styles.name}>
      {data.fullName.toUpperCase()}
    </h1>

    {data.jobTitle && (
      <div style={styles.jobTitle}>
        {data.jobTitle}
      </div>
    )}

    <div style={styles.contact}>
      {data.contact.location && <span>{data.contact.location}</span>}
      {data.contact.location && (data.contact.phone || data.contact.email) && <span> • </span>}
      {data.contact.phone && <span>{data.contact.phone}</span>}
      {data.contact.phone && data.contact.email && <span> • </span>}
      {data.contact.email && <span>{data.contact.email}</span>}
    </div>
  </div>
);

// Text Section Component (for summary)
const TextSection = ({ data }) => {
  if (data.isEmpty) return null;
  
  return (
    <div className="mb-6">
      <h2 style={styles.sectionTitle}>{data.title}</h2>
      <p style={styles.itemDescription}>
        {data.content}
      </p>
    </div>
  );
};

// List Section Component (for employment, education, etc.)
const ListSection = ({ data, sectionId }) => {
  if (data.isEmpty) return null;

  const renderItem = (item, index) => {
    switch (sectionId) {
      case 'employment':
      case 'internships':
        return (
          <div key={item.id || index} style={{ marginBottom: "12pt" }}>
            <div style={styles.itemHeader}>
              <div>
                <strong style={styles.itemTitle}>
                  {item.jobTitle || "Position Title"}
                </strong>
                {item.company && (
                  <span style={styles.itemTitle}>
                    {" "}at <em>{item.company}</em>
                  </span>
                )}
                {item.location && (
                  <span style={styles.itemDate}>
                    {", "}{item.location}
                  </span>
                )}
              </div>
              <div style={styles.itemDate}>
                {item.startDate && item.endDate && 
                  `${item.startDate} - ${item.endDate}`}
              </div>
            </div>
            {item.description && (
              <div style={styles.itemDescription}>
                {item.description}
              </div>
            )}
            {item.bulletPoints && item.bulletPoints.length > 0 && (
              <div style={styles.bulletPoints}>
                {item.bulletPoints.map((bullet, bulletIndex) => (
                  <div key={bulletIndex} style={{ marginBottom: "2pt" }}>
                    • {bullet}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'education':
        return (
          <div key={item.id || index} style={{ marginBottom: "8pt" }}>
            <div style={styles.itemHeader}>
              <div>
                <strong style={styles.itemTitle}>
                  {item.degree || "Degree"}
                </strong>
                {item.institution && (
                  <span style={styles.itemTitle}>
                    {", "}{item.institution}
                  </span>
                )}
                {item.location && (
                  <span style={styles.itemDate}>
                    {", "}{item.location}
                  </span>
                )}
              </div>
              <div style={styles.itemDate}>
                {item.dateRange || "Date"}
              </div>
            </div>
            {item.description && (
              <div style={styles.itemDescription}>
                {item.description}
              </div>
            )}
            {item.bulletPoints && item.bulletPoints.length > 0 && (
              <div style={styles.bulletPoints}>
                {item.bulletPoints.map((bullet, bulletIndex) => (
                  <div key={bulletIndex} style={{ marginBottom: "2pt" }}>
                    • {bullet}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'projects':
        return (
          <div key={item.id || index} style={{ marginBottom: "12pt" }}>
            <div style={styles.itemHeader}>
              <div>
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      ...styles.itemTitle,
                      color: "#000",
                      textDecoration: "underline",
                    }}
                  >
                    {item.name || "Project Name"}
                  </a>
                ) : (
                  <strong style={styles.itemTitle}>
                    {item.name || "Project Name"}
                  </strong>
                )}
              </div>
              <div style={styles.itemDate}>
                {item.dateRange}
              </div>
            </div>
            {item.bulletPoints && item.bulletPoints.length > 0 && (
              <div style={styles.bulletPoints}>
                {item.bulletPoints.map((bullet, bulletIndex) => (
                  <div key={bulletIndex} style={{ marginBottom: "2pt" }}>
                    • {bullet}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'courses':
        return (
          <div key={item.id || index} style={{ marginBottom: "6pt" }}>
            <strong style={styles.itemTitle}>
              {item.courseName || "Course Name"}
            </strong>
          </div>
        );

      case 'links':
        return (
          <div key={item.id || index} style={{ marginBottom: "6pt" }}>
            <div style={styles.itemTitle}>
              <strong>{item.linkTitle || "Link"}</strong>
              {item.url && (
                <span style={styles.itemDate}>
                  {": "}{item.url}
                </span>
              )}
            </div>
          </div>
        );

      case 'references':
        return (
          <div key={item.id || index} style={{ marginBottom: "8pt" }}>
            <div style={styles.itemTitle}>
              <strong>{item.referentName || "Reference Name"}</strong>
              {item.referentCompany && (
                <span>
                  {", "}{item.position ? `${item.position} at ` : ""}{item.referentCompany}
                </span>
              )}
            </div>
            <div style={styles.itemDate}>
              {item.referentPhone && <span>{item.referentPhone}</span>}
              {item.referentPhone && item.referentEmail && <span> • </span>}
              {item.referentEmail && <span>{item.referentEmail}</span>}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mb-6">
      <h2 style={styles.sectionTitle}>{data.title}</h2>
      {data.items.map(renderItem)}
    </div>
  );
};

// Inline Section Component (for skills, technologies, hobbies)
const InlineSection = ({ data, sectionId }) => {
  if (data.isEmpty) return null;

  const renderInlineContent = () => {
    switch (sectionId) {
      case 'languages':
        return data.items.map((language, index) => {
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
              {index < data.items.length - 1 ? " • " : ""}
            </span>
          );
        });

      case 'skills':
        return (
          <>
            <strong>Skills:</strong>{" "}
            {data.items.map((skill, index) => (
              <span key={skill.id || index}>
                {skill.skillName}
                {index < data.items.length - 1 ? "; " : ""}
              </span>
            ))}
          </>
        );

      case 'technologiesSkills':
        return (
          <>
            <strong>Technologies:</strong>{" "}
            {data.items.map((tech, index) => (
              <span key={tech.id || index}>
                {tech.technologiesSkillName}
                {index < data.items.length - 1 ? "; " : ""}
              </span>
            ))}
          </>
        );

      case 'hobbies':
        return (
          <>
            <strong>Interests:</strong>{" "}
            {data.items.map((hobby, index) => (
              <span key={hobby.id || index}>
                {hobby.hobbyName}
                {index < data.items.length - 1 ? "; " : ""}
              </span>
            ))}
          </>
        );

      default:
        return null;
    }
  };

  // Languages get full section treatment, others are inline
  if (sectionId === 'languages') {
    return (
      <div className="mb-6">
        <h2 style={styles.sectionTitle}>{data.title}</h2>
        <div style={styles.inlineList}>
          {renderInlineContent()}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div style={styles.inlineList}>
        {renderInlineContent()}
      </div>
    </div>
  );
};

// Custom Section Component
const CustomSection = ({ data }) => {
  if (data.isEmpty) return null;

  return (
    <div className="mb-6">
      <h2 style={styles.sectionTitle}>{data.title}</h2>
      {data.items.map((entry, index) => (
        <div key={entry.id || index} style={{ marginBottom: "12pt" }}>
          {/* Entry Header and Subheader */}
          {(entry.header || entry.subheader) && (
            <div style={{ marginBottom: "4pt" }}>
              {entry.header && (
                <strong style={styles.itemTitle}>
                  {entry.header}
                </strong>
              )}
              {entry.subheader && (
                <span style={{ ...styles.itemTitle, fontStyle: "italic" }}>
                  {entry.header ? " - " : ""}
                  {entry.subheader}
                </span>
              )}
            </div>
          )}

          {/* Entry Description */}
          {entry.description && (
            <div style={styles.itemDescription}>
              {entry.description}
            </div>
          )}

          {/* Entry Bullet Points */}
          {entry.bulletPoints && entry.bulletPoints.length > 0 && (
            <div style={styles.bulletPoints}>
              {entry.bulletPoints.map((bullet, bulletIndex) => (
                <div key={bulletIndex} style={{ marginBottom: "2pt" }}>
                  • {bullet}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Main Template Component
export const HarvardTemplate = ({ formData, sidebarItems }) => {
  // Process header data
  const headerData = processHeaderData(formData);
  
  // Get ordered sections
  const orderedSections = sidebarItems
    .filter(item => !item.fixed && item.id !== 'additional')
    .sort((a, b) => a.order - b.order)
    .map(item => item.id);

  // Render section based on type
  const renderSection = (sectionId) => {
    // Handle custom sections
    if (sectionId.startsWith('custom-')) {
      const sectionData = processSectionData.custom(formData, sectionId);
      return <CustomSection key={sectionId} data={sectionData} sectionId={sectionId} />;
    }

    // Get processor for this section
    const processor = processSectionData[sectionId];
    if (!processor) return null;

    const sectionData = processor(formData);
    if (sectionData.isEmpty) return null;

    // Determine component type based on section
    if (sectionId === 'summary') {
      return <TextSection key={sectionId} data={sectionData} />;
    } else if (['skills', 'technologiesSkills', 'hobbies', 'languages'].includes(sectionId)) {
      return <InlineSection key={sectionId} data={sectionData} sectionId={sectionId} />;
    } else {
      return <ListSection key={sectionId} data={sectionData} sectionId={sectionId} />;
    }
  };

  return (
    <div style={styles.document}>
      {/* Always render header first */}
      <HeaderSection data={headerData} />
      
      {/* Render sections in sidebar order */}
      {orderedSections.map(renderSection)}
    </div>
  );
};

export default HarvardTemplate;