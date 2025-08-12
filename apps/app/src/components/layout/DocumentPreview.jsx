import { useState, useEffect, useRef } from 'react';

function DocumentPreview({ formData }) {
  const [pages, setPages] = useState([]);
  const contentRef = useRef(null);

  // Calculate pages based on content height
  useEffect(() => {
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
  }, [formData]);

  const renderContent = () => (
    <div ref={contentRef}>
      {/* Header Section */}
      <div className="text-center mb-6 pb-4 border-b border-black">
        <h1 style={{ 
          fontSize: '16pt', 
          fontWeight: 'bold',
          marginBottom: '8pt',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          {(formData.firstName + ' ' + formData.lastName).toUpperCase() || 'DAVID GUERRERO DIAZ'}
        </h1>
        
        <div style={{ fontSize: '11pt', marginBottom: '4pt' }}>
          {formData.jobTitle || 'Your Professional Title'}
        </div>
        
        <div style={{ fontSize: '10pt', color: '#333' }}>
          {formData.address && <span>{formData.address}</span>}
          {formData.city && <span>{formData.address ? ', ' : ''}{formData.city}</span>}
          {formData.country && <span>{(formData.address || formData.city) ? ', ' : ''}{formData.country}</span>}
          {formData.postalCode && <span> {formData.postalCode}</span>}
          {(formData.address || formData.city || formData.country || formData.postalCode) && <span> • </span>}
          {formData.phone && <span>{formData.phone} • </span>}
          {formData.email && <span>{formData.email}</span>}
        </div>
        
        {/* Additional personal details */}
        {(formData.nationality || formData.driversLicense || formData.birthDate) && (
          <div style={{ fontSize: '10pt', color: '#333', marginTop: '4pt' }}>
            {formData.nationality && <span>Nationality: {formData.nationality}</span>}
            {formData.nationality && formData.driversLicense && <span> • </span>}
            {formData.driversLicense && <span>License: {formData.driversLicense}</span>}
            {(formData.nationality || formData.driversLicense) && formData.birthDate && <span> • </span>}
            {formData.birthDate && <span>DOB: {formData.birthDate}</span>}
          </div>
        )}
      </div>

      {/* Professional Summary */}
      {formData.about && (
        <div className="mb-6">
          <h2 style={{ 
            fontSize: '12pt', 
            fontWeight: 'bold',
            marginBottom: '8pt',
            textTransform: 'uppercase',
            borderBottom: '1px solid #000',
            paddingBottom: '2pt'
          }}>
            Professional Summary
          </h2>
          <p style={{ 
            fontSize: '11pt', 
            lineHeight: '1.3',
            textAlign: 'justify'
          }}>
            {formData.about}
          </p>
        </div>
      )}

      {/* Skills */}
      {formData.skills && formData.skills.length > 0 && (
        <div className="mb-6">
          <h2 style={{ 
            fontSize: '12pt', 
            fontWeight: 'bold',
            marginBottom: '8pt',
            textTransform: 'uppercase',
            borderBottom: '1px solid #000',
            paddingBottom: '2pt'
          }}>
            Core Competencies
          </h2>
          <div style={{ fontSize: '11pt', lineHeight: '1.3' }}>
            {Array.isArray(formData.skills) 
              ? formData.skills.join(' • ')
              : formData.skills}
          </div>
        </div>
      )}

      {/* Professional Experience */}
      {formData.employment && formData.employment.length > 0 && (
        <div className="mb-6">
          <h2 style={{ 
            fontSize: '12pt', 
            fontWeight: 'bold',
            marginBottom: '8pt',
            textTransform: 'uppercase',
            borderBottom: '1px solid #000',
            paddingBottom: '2pt'
          }}>
            Professional Experience
          </h2>
          {formData.employment.map((job, index) => (
            <div key={job.id || index} style={{ marginBottom: '12pt' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: '4pt'
              }}>
                <div>
                  <strong style={{ fontSize: '11pt' }}>
                    {job.jobTitle || 'Position Title'}
                  </strong>
                  {job.company && (
                    <span style={{ fontSize: '11pt' }}>
                      {' '}at <em>{job.company}</em>
                    </span>
                  )}
                  {job.location && (
                    <span style={{ fontSize: '10pt', color: '#333' }}>
                      {', '}{job.location}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '10pt', color: '#333' }}>
                  {job.startDate && job.endDate && 
                    `${job.startDate} - ${job.endDate}`}
                </div>
              </div>
              {job.description && (
                <div style={{ 
                  fontSize: '11pt', 
                  lineHeight: '1.3',
                  marginLeft: '12pt',
                  textAlign: 'justify'
                }}>
                  {job.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Internships */}
      {formData.internships && formData.internships.length > 0 && (
        <div className="mb-6">
          <h2 style={{ 
            fontSize: '12pt', 
            fontWeight: 'bold',
            marginBottom: '8pt',
            textTransform: 'uppercase',
            borderBottom: '1px solid #000',
            paddingBottom: '2pt'
          }}>
            Internship Experience
          </h2>
          {formData.internships.map((internship, index) => (
            <div key={internship.id || index} style={{ marginBottom: '12pt' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: '4pt'
              }}>
                <div>
                  <strong style={{ fontSize: '11pt' }}>
                    {internship.jobTitle || 'Internship Position'}
                  </strong>
                  {internship.company && (
                    <span style={{ fontSize: '11pt' }}>
                      {' '}at <em>{internship.company}</em>
                    </span>
                  )}
                  {internship.location && (
                    <span style={{ fontSize: '10pt', color: '#333' }}>
                      {', '}{internship.location}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '10pt', color: '#333' }}>
                  {internship.startDate && internship.endDate && 
                    `${internship.startDate} - ${internship.endDate}`}
                </div>
              </div>
              {internship.description && (
                <div style={{ 
                  fontSize: '11pt', 
                  lineHeight: '1.3',
                  marginLeft: '12pt',
                  textAlign: 'justify'
                }}>
                  {internship.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {formData.education && formData.education.length > 0 && (
        <div className="mb-6">
          <h2 style={{ 
            fontSize: '12pt', 
            fontWeight: 'bold',
            marginBottom: '8pt',
            textTransform: 'uppercase',
            borderBottom: '1px solid #000',
            paddingBottom: '2pt'
          }}>
            Education
          </h2>
          {formData.education.map((edu, index) => (
            <div key={edu.id || index} style={{ marginBottom: '8pt' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'baseline'
              }}>
                <div>
                  <strong style={{ fontSize: '11pt' }}>
                    {edu.degree || 'Degree'}
                  </strong>
                  {edu.institution && (
                    <span style={{ fontSize: '11pt' }}>
                      {', '}{edu.institution}
                    </span>
                  )}
                  {edu.location && (
                    <span style={{ fontSize: '10pt', color: '#333' }}>
                      {', '}{edu.location}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '10pt', color: '#333' }}>
                  {edu.startDate && edu.endDate 
                    ? `${edu.startDate} - ${edu.endDate}`
                    : edu.endDate || edu.startDate}
                </div>
              </div>
              {edu.description && (
                <div style={{ 
                  fontSize: '11pt', 
                  lineHeight: '1.3',
                  marginLeft: '12pt',
                  marginTop: '4pt'
                }}>
                  {edu.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Languages - FIXED */}
      {formData.languages && formData.languages.length > 0 && (
        <div className="mb-6">
          <h2 style={{ 
            fontSize: '12pt', 
            fontWeight: 'bold',
            marginBottom: '8pt',
            textTransform: 'uppercase',
            borderBottom: '1px solid #000',
            paddingBottom: '2pt'
          }}>
            Languages
          </h2>
          <div style={{ fontSize: '11pt', lineHeight: '1.3' }}>
            {formData.languages.map((lang, index) => {
              // Handle both object format (new) and string format (legacy)
              const languageText = typeof lang === 'object' && lang !== null
                ? (lang.language && lang.proficiency && lang.proficiency !== 'Not applicable' 
                  ? `${lang.language} (${lang.proficiency})`
                  : lang.language || '')
                : String(lang || '');
              
              return (
                <span key={lang.id || index}>
                  {languageText}
                  {index < formData.languages.length - 1 ? ' • ' : ''}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Professional Development / Courses */}
      {formData.courses && formData.courses.length > 0 && (
        <div className="mb-6">
          <h2 style={{ 
            fontSize: '12pt', 
            fontWeight: 'bold',
            marginBottom: '8pt',
            textTransform: 'uppercase',
            borderBottom: '1px solid #000',
            paddingBottom: '2pt'
          }}>
            Professional Development
          </h2>
          {formData.courses.map((course, index) => (
            <div key={course.id || index} style={{ marginBottom: '6pt' }}>
              <strong style={{ fontSize: '11pt' }}>
                {course.courseName || 'Course Name'}
              </strong>
              {course.institution && (
                <span style={{ fontSize: '11pt' }}>
                  {', '}{course.institution}
                </span>
              )}
              {course.startDate && course.endDate && (
                <span style={{ fontSize: '10pt', color: '#333' }}>
                  {' ('}{course.startDate} - {course.endDate}{')'}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Links / Portfolio */}
      {formData.links && formData.links.length > 0 && (
        <div className="mb-6">
          <h2 style={{ 
            fontSize: '12pt', 
            fontWeight: 'bold',
            marginBottom: '8pt',
            textTransform: 'uppercase',
            borderBottom: '1px solid #000',
            paddingBottom: '2pt'
          }}>
            Portfolio & Links
          </h2>
          {formData.links.map((link, index) => (
            <div key={link.id || index} style={{ marginBottom: '6pt' }}>
              <div style={{ fontSize: '11pt' }}>
                <strong>{link.linkTitle || 'Link'}</strong>
                {link.url && (
                  <span style={{ fontSize: '10pt', color: '#333' }}>
                    {': '}{link.url}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hobbies & Interests */}
      {formData.hobbies && (
        <div className="mb-6">
          <h2 style={{ 
            fontSize: '12pt', 
            fontWeight: 'bold',
            marginBottom: '8pt',
            textTransform: 'uppercase',
            borderBottom: '1px solid #000',
            paddingBottom: '2pt'
          }}>
            Interests & Hobbies
          </h2>
          <div style={{ 
            fontSize: '11pt', 
            lineHeight: '1.3'
          }}>
            {formData.hobbies}
          </div>
        </div>
      )}

      {/* Custom Sections */}
      {formData.customSections && Object.keys(formData.customSections).length > 0 && (
        Object.entries(formData.customSections).map(([sectionName, sectionContent], index) => (
          <div key={index} className="mb-6">
            <h2 style={{ 
              fontSize: '12pt', 
              fontWeight: 'bold',
              marginBottom: '8pt',
              textTransform: 'uppercase',
              borderBottom: '1px solid #000',
              paddingBottom: '2pt'
            }}>
              {sectionName}
            </h2>
            <div style={{ 
              fontSize: '11pt', 
              lineHeight: '1.3'
            }}>
              {sectionContent}
            </div>
          </div>
        ))
      )}

      {/* References */}
      {formData.references && formData.references.length > 0 && (
        <div className="mb-6">
          <h2 style={{ 
            fontSize: '12pt', 
            fontWeight: 'bold',
            marginBottom: '8pt',
            textTransform: 'uppercase',
            borderBottom: '1px solid #000',
            paddingBottom: '2pt'
          }}>
            References
          </h2>
          {formData.references.map((ref, index) => (
            <div key={ref.id || index} style={{ marginBottom: '8pt' }}>
              <div style={{ fontSize: '11pt' }}>
                <strong>{ref.referentName || 'Reference Name'}</strong>
                {ref.position && ref.referentCompany && (
                  <span>{', '}{ref.position} at {ref.referentCompany}</span>
                )}
              </div>
              <div style={{ fontSize: '10pt', color: '#333' }}>
                {ref.referentPhone && <span>{ref.referentPhone}</span>}
                {ref.referentPhone && ref.referentEmail && <span> • </span>}
                {ref.referentEmail && <span>{ref.referentEmail}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

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