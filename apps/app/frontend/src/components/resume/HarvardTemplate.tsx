import { processHeaderData, processSectionData } from '../../utils/resumeDataProcessors';
import type { FormData, SidebarItem } from '../../types/resume';

// ---------------------------------------------------------------------------
// Internal types
// ---------------------------------------------------------------------------

interface SectionItem {
  id?: string;
  // Employment / Internship
  jobTitle?: string;
  company?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  bulletPoints?: string[];
  // Education
  degree?: string;
  institution?: string;
  dateRange?: string;
  // Projects
  name?: string;
  url?: string;
  // Links
  linkTitle?: string;
  // References
  referentName?: string;
  referentCompany?: string;
  position?: string;
  referentPhone?: string;
  referentEmail?: string;
  // Skills / Tech / Hobbies / Courses / Languages
  skillName?: string;
  technologiesSkillName?: string;
  language?: string;
  proficiency?: string;
  hobbyName?: string;
  courseName?: string;
  // Custom sections
  header?: string;
  subheader?: string;
}

interface ProcessedData {
  isEmpty: boolean;
  title: string;
  items?: SectionItem[];
  content?: string;
  displayType?: 'inline';
}

type SectionProcessor = (formData: FormData) => ProcessedData;

// ---------------------------------------------------------------------------
// Template styles
// ---------------------------------------------------------------------------

const styles = {
  document: {
    fontFamily: 'Times, "Times New Roman", serif',
    fontSize: '11pt',
    lineHeight: '1.2',
    color: '#000',
  },
  name: {
    fontSize: '16pt',
    fontWeight: 'bold',
    marginBottom: '8pt',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
  },
  jobTitle: {
    fontSize: '11pt',
    marginBottom: '4pt',
  },
  contact: {
    fontSize: '10pt',
    color: '#333',
  },
  sectionTitle: {
    fontSize: '12pt',
    fontWeight: 'bold',
    marginBottom: '8pt',
    textTransform: 'uppercase' as const,
    borderBottom: '1px solid #000',
    paddingBottom: '2pt',
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: '4pt',
  },
  itemTitle: {
    fontSize: '11pt',
    fontWeight: 'bold',
  },
  itemDate: {
    fontSize: '10pt',
    color: '#333',
  },
  itemDescription: {
    fontSize: '11pt',
    lineHeight: '1.3',
    marginLeft: '12pt',
    textAlign: 'justify' as const,
  },
  bulletPoints: {
    fontSize: '11pt',
    lineHeight: '1.3',
    marginLeft: '12pt',
    marginTop: '4pt',
  },
  inlineList: {
    fontSize: '11pt',
    lineHeight: '1.3',
  },
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

type HeaderData = ReturnType<typeof processHeaderData>;

const HeaderSection = ({ data }: { data: HeaderData }) => (
  <div style={{ textAlign: 'center', marginBottom: '24pt', paddingBottom: '16pt', borderBottom: '1px solid #000' }}>
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
      {data.contact.location && (data.contact.phone || data.contact.email || data.contact.portfolio) && <span> • </span>}
      {data.contact.phone && <span>{data.contact.phone}</span>}
      {data.contact.phone && (data.contact.email || data.contact.portfolio) && <span> • </span>}
      {data.contact.email && <span>{data.contact.email}</span>}
      {data.contact.email && data.contact.portfolio && <span> • </span>}
      {data.contact.portfolio && (
        <a
          href={data.contact.portfolio.startsWith('http') ? data.contact.portfolio : `https://${data.contact.portfolio}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#333', textDecoration: 'underline' }}
        >
          {data.contact.portfolio}
        </a>
      )}
    </div>
  </div>
);

const TextSection = ({ data }: { data: ProcessedData }) => {
  if (data.isEmpty) return null;

  return (
    <div style={{ marginBottom: '24pt' }}>
      <h2 style={styles.sectionTitle}>{data.title}</h2>
      <p style={styles.itemDescription}>
        {data.content}
      </p>
    </div>
  );
};

const ListSection = ({ data, sectionId }: { data: ProcessedData; sectionId: string }) => {
  if (data.isEmpty) return null;

  const items = (data.items ?? []) as SectionItem[];

  const renderItem = (item: SectionItem, index: number) => {
    switch (sectionId) {
      case 'employment':
      case 'internships':
        return (
          <div key={item.id ?? index} style={{ marginBottom: '12pt' }}>
            <div style={styles.itemHeader}>
              <div>
                <strong style={styles.itemTitle}>
                  {item.jobTitle ?? 'Position Title'}
                </strong>
                {item.company && (
                  <span style={styles.itemTitle}>
                    {' '}at <em>{item.company}</em>
                  </span>
                )}
                {item.location && (
                  <span style={styles.itemDate}>
                    {', '}{item.location}
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
                  <div key={bulletIndex} style={{ marginBottom: '2pt' }}>
                    • {bullet}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'education':
        return (
          <div key={item.id ?? index} style={{ marginBottom: '8pt' }}>
            <div style={styles.itemHeader}>
              <div>
                <strong style={styles.itemTitle}>
                  {item.degree ?? 'Degree'}
                </strong>
                {item.institution && (
                  <span style={styles.itemTitle}>
                    {', '}{item.institution}
                  </span>
                )}
                {item.location && (
                  <span style={styles.itemDate}>
                    {', '}{item.location}
                  </span>
                )}
              </div>
              <div style={styles.itemDate}>
                {item.dateRange ?? 'Date'}
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
                  <div key={bulletIndex} style={{ marginBottom: '2pt' }}>
                    • {bullet}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'projects':
        return (
          <div key={item.id ?? index} style={{ marginBottom: '12pt' }}>
            <div style={styles.itemHeader}>
              <div>
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ ...styles.itemTitle, color: '#000', textDecoration: 'underline' }}
                  >
                    {item.name ?? 'Project Name'}
                  </a>
                ) : (
                  <strong style={styles.itemTitle}>
                    {item.name ?? 'Project Name'}
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
                  <div key={bulletIndex} style={{ marginBottom: '2pt' }}>
                    • {bullet}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'links':
        return (
          <div key={item.id ?? index} style={{ marginBottom: '6pt' }}>
            <div style={styles.itemTitle}>
              <strong>{item.linkTitle ?? 'Link'}</strong>
              {item.url && (
                <span style={styles.itemDate}>
                  {': '}{item.url}
                </span>
              )}
            </div>
          </div>
        );

      case 'references':
        return (
          <div key={item.id ?? index} style={{ marginBottom: '8pt' }}>
            <div style={styles.itemTitle}>
              <strong>{item.referentName ?? 'Reference Name'}</strong>
              {item.referentCompany && (
                <span>
                  {', '}{item.position ? `${item.position} at ` : ''}{item.referentCompany}
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
    <div style={{ marginBottom: '24pt' }}>
      <h2 style={styles.sectionTitle}>{data.title}</h2>
      {items.map(renderItem)}
    </div>
  );
};

const CombinedSkillsSection = ({
  formData,
  availableSections,
}: {
  formData: FormData;
  availableSections: string[];
}) => {
  const sectionMap: Record<string, { title: string; key: string }> = {
    courses: { title: 'CERTIFICATIONS', key: 'courses' },
    skills: { title: 'SKILLS', key: 'skills' },
    technologiesSkills: { title: 'TECHNOLOGIES', key: 'technologiesSkills' },
    languages: { title: 'LANGUAGES', key: 'languages' },
    hobbies: { title: 'INTERESTS', key: 'hobbies' },
  };

  const sectionsWithData: string[] = [];
  const sectionData: Record<string, ProcessedData> = {};

  availableSections.forEach((sectionId) => {
    if (sectionMap[sectionId]) {
      const processor = (processSectionData as unknown as Record<string, SectionProcessor | undefined>)[sectionId];
      if (processor) {
        const data = processor(formData);
        if (!data.isEmpty) {
          sectionsWithData.push(sectionMap[sectionId].title);
          sectionData[sectionId] = data;
        }
      }
    }
  });

  if (sectionsWithData.length === 0) return null;

  let combinedTitle: string;
  if (sectionsWithData.length === 1) {
    combinedTitle = sectionsWithData[0];
  } else if (sectionsWithData.length === 2) {
    combinedTitle = sectionsWithData.join(' & ');
  } else {
    const last = sectionsWithData.pop()!;
    combinedTitle = sectionsWithData.join(', ') + ' & ' + last;
  }

  const renderInlineContent = (sectionId: string, data: ProcessedData) => {
    const items = (data.items ?? []) as SectionItem[];

    switch (sectionId) {
      case 'courses':
        return (
          <>
            <strong>Certifications:</strong>{' '}
            {items.map((course, index) => (
              <span key={course.id ?? index}>
                {course.courseName}
                {index < items.length - 1 ? '; ' : ''}
              </span>
            ))}
          </>
        );

      case 'skills':
        return (
          <>
            <strong>Skills:</strong>{' '}
            {items.map((skill, index) => (
              <span key={skill.id ?? index}>
                {skill.skillName}
                {index < items.length - 1 ? '; ' : ''}
              </span>
            ))}
          </>
        );

      case 'technologiesSkills':
        return (
          <>
            <strong>Technologies:</strong>{' '}
            {items.map((tech, index) => (
              <span key={tech.id ?? index}>
                {tech.technologiesSkillName}
                {index < items.length - 1 ? '; ' : ''}
              </span>
            ))}
          </>
        );

      case 'languages':
        return (
          <>
            <strong>Languages:</strong>{' '}
            {items.map((language, index) => {
              const languageText =
                language.language && language.proficiency && language.proficiency !== 'Not applicable'
                  ? `${language.language} (${language.proficiency})`
                  : language.language ?? '';

              return (
                <span key={language.id ?? index}>
                  {languageText}
                  {index < items.length - 1 ? '; ' : ''}
                </span>
              );
            })}
          </>
        );

      case 'hobbies':
        return (
          <>
            <strong>Interests:</strong>{' '}
            {items.map((hobby, index) => (
              <span key={hobby.id ?? index}>
                {hobby.hobbyName}
                {index < items.length - 1 ? '; ' : ''}
              </span>
            ))}
          </>
        );

      default:
        return null;
    }
  };

  const sectionEntries = Object.entries(sectionData);

  return (
    <div style={{ marginBottom: '24pt' }}>
      <h2 style={styles.sectionTitle}>{combinedTitle}</h2>
      <div style={styles.inlineList}>
        {sectionEntries.map(([sectionId, data], index) => (
          <div key={sectionId} style={{ marginBottom: index < sectionEntries.length - 1 ? '8pt' : '0' }}>
            {renderInlineContent(sectionId, data)}
          </div>
        ))}
      </div>
    </div>
  );
};

const CustomSection = ({ data }: { data: ProcessedData }) => {
  if (data.isEmpty) return null;

  const items = (data.items ?? []) as SectionItem[];

  return (
    <div style={{ marginBottom: '24pt' }}>
      <h2 style={styles.sectionTitle}>{data.title}</h2>
      {items.map((entry, index) => (
        <div key={entry.id ?? index} style={{ marginBottom: '12pt' }}>
          {(entry.header || entry.subheader) && (
            <div style={{ marginBottom: '4pt' }}>
              {entry.header && (
                <strong style={styles.itemTitle}>
                  {entry.header}
                </strong>
              )}
              {entry.subheader && (
                <span style={{ ...styles.itemTitle, fontStyle: 'italic' }}>
                  {entry.header ? ' - ' : ''}
                  {entry.subheader}
                </span>
              )}
            </div>
          )}

          {entry.description && (
            <div style={styles.itemDescription}>
              {entry.description}
            </div>
          )}

          {entry.bulletPoints && entry.bulletPoints.length > 0 && (
            <div style={styles.bulletPoints}>
              {entry.bulletPoints.map((bullet, bulletIndex) => (
                <div key={bulletIndex} style={{ marginBottom: '2pt' }}>
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

// ---------------------------------------------------------------------------
// Main template
// ---------------------------------------------------------------------------

interface HarvardTemplateProps {
  formData: FormData;
  sidebarItems: SidebarItem[];
}

export const HarvardTemplate = ({ formData, sidebarItems }: HarvardTemplateProps) => {
  const headerData = processHeaderData(formData);

  const combinedSkillsSections = ['courses', 'skills', 'technologiesSkills', 'languages', 'hobbies'];

  const orderedSections = sidebarItems
    .filter((item) => !item.fixed && item.id !== 'additional' && !combinedSkillsSections.includes(item.id))
    .sort((a, b) => a.order - b.order)
    .map((item) => item.id);

  const availableCombinedSections = sidebarItems
    .filter((item) => combinedSkillsSections.includes(item.id))
    .sort((a, b) => a.order - b.order)
    .map((item) => item.id);

  const renderSection = (sectionId: string) => {
    if (sectionId.startsWith('custom-')) {
      const sectionData = processSectionData.custom(formData, sectionId);
      return <CustomSection key={sectionId} data={sectionData as ProcessedData} />;
    }

    const processor = (processSectionData as unknown as Record<string, SectionProcessor | undefined>)[sectionId];
    if (!processor) return null;

    const sectionData = processor(formData);
    if (sectionData.isEmpty) return null;

    if (sectionId === 'summary') {
      return <TextSection key={sectionId} data={sectionData} />;
    } else {
      return <ListSection key={sectionId} data={sectionData} sectionId={sectionId} />;
    }
  };

  return (
    <div style={styles.document}>
      <HeaderSection data={headerData} />

      {orderedSections.map(renderSection)}

      {availableCombinedSections.length > 0 && (
        <CombinedSkillsSection
          formData={formData}
          availableSections={availableCombinedSections}
        />
      )}
    </div>
  );
};

export default HarvardTemplate;
