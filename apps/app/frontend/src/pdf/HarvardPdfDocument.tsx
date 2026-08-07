import type { ComponentProps } from 'react';
import { Document, Font, Link, Page, Text, View } from '@react-pdf/renderer';
import liberationSerifBold from '../assets/fonts/liberation-serif/LiberationSerif-Bold.ttf';
import liberationSerifBoldItalic from '../assets/fonts/liberation-serif/LiberationSerif-BoldItalic.ttf';
import liberationSerifItalic from '../assets/fonts/liberation-serif/LiberationSerif-Italic.ttf';
import liberationSerifRegular from '../assets/fonts/liberation-serif/LiberationSerif-Regular.ttf';
import {
  sanitizeLinkTarget,
  type ResumeCombinedSkillsSection,
  type ResumeCustomItem,
  type ResumeCustomSection,
  type ResumeDisplayLink,
  type ResumeDocumentModel,
  type ResumeDocumentSection,
  type ResumeEducationItem,
  type ResumeEducationSection,
  type ResumeLinkItem,
  type ResumeLinksSection,
  type ResumeProjectItem,
  type ResumeProjectsSection,
  type ResumeReferenceItem,
  type ResumeReferencesSection,
  type ResumeSummarySection,
  type ResumeWorkItem,
  type ResumeWorkSection,
} from './resumeDocumentModel';

const FONT_FAMILY = 'Liberation Serif';
export const HARVARD_PAGE_MARGIN = 36;

// Liberation Serif 2.1.5 is metrically compatible with Times. Register every
// face explicitly so generated PDFs never fall back to a browser font.
Font.register({
  family: FONT_FAMILY,
  fonts: [
    { src: liberationSerifRegular, fontWeight: 400, fontStyle: 'normal' },
    { src: liberationSerifBold, fontWeight: 700, fontStyle: 'normal' },
    { src: liberationSerifItalic, fontWeight: 400, fontStyle: 'italic' },
    { src: liberationSerifBoldItalic, fontWeight: 700, fontStyle: 'italic' },
  ],
});

type PdfStyle = NonNullable<ComponentProps<typeof Page>['style']>;

// These values intentionally mirror HarvardTemplate's existing CSS. CSS point
// measurements stay as points, and CSS pixels are converted at 0.75pt/px.
const styles = {
  page: {
    fontFamily: FONT_FAMILY,
    fontSize: 11,
    lineHeight: 13.2,
    color: '#000000',
    padding: HARVARD_PAGE_MARGIN,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 0.75,
    borderBottomColor: '#000000',
  },
  name: {
    fontSize: 16,
    lineHeight: 19.2,
    fontWeight: 700,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.75,
    textAlign: 'center',
  },
  jobTitle: {
    fontSize: 11,
    lineHeight: 13.2,
    marginBottom: 4,
    textAlign: 'center',
  },
  contact: {
    fontSize: 10,
    lineHeight: 12,
    color: '#333333',
    textAlign: 'center',
  },
  contactLink: {
    color: '#333333',
    textDecoration: 'underline',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    lineHeight: 14.4,
    fontWeight: 700,
    marginBottom: 8,
    textTransform: 'uppercase',
    borderBottomWidth: 0.75,
    borderBottomColor: '#000000',
    paddingBottom: 2,
  },
  item: {
    marginBottom: 12,
  },
  compactItem: {
    marginBottom: 8,
  },
  linkItem: {
    marginBottom: 6,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  itemHeaderText: {
    flexGrow: 1,
    flexShrink: 1,
    paddingRight: 8,
  },
  itemTitle: {
    fontSize: 11,
    lineHeight: 13.2,
    fontWeight: 700,
  },
  itemCompany: {
    fontSize: 11,
    lineHeight: 13.2,
    fontStyle: 'italic',
  },
  itemDate: {
    fontSize: 10,
    lineHeight: 12,
    color: '#333333',
  },
  itemDescription: {
    fontSize: 11,
    lineHeight: 14.3,
    marginLeft: 12,
    textAlign: 'justify',
  },
  bulletList: {
    marginLeft: 12,
    marginTop: 4,
  },
  bullet: {
    fontSize: 11,
    lineHeight: 14.3,
    marginBottom: 2,
  },
  projectLink: {
    fontSize: 11,
    lineHeight: 13.2,
    fontWeight: 700,
    color: '#000000',
    textDecoration: 'underline',
  },
  inlineList: {
    fontSize: 11,
    lineHeight: 14.3,
  },
  inlineGroup: {
    marginBottom: 8,
  },
  customSubheader: {
    fontSize: 11,
    lineHeight: 13.2,
    fontStyle: 'italic',
  },
  customHeader: {
    marginBottom: 4,
  },
} satisfies Record<string, PdfStyle>;

/**
 * The model sanitizes targets, but the renderer keeps this last defensive
 * check so a manually-created model can never turn an unsafe value into a PDF
 * annotation. Visible text is always rendered independently.
 */
export function safePdfLinkTarget(linkTarget?: string): string | undefined {
  return linkTarget ? sanitizeLinkTarget(linkTarget) : undefined;
}

interface DisplayLinkProps {
  value: ResumeDisplayLink;
  style: PdfStyle;
}

function DisplayLink({ value, style }: DisplayLinkProps) {
  const target = safePdfLinkTarget(value.linkTarget);

  if (!target) {
    return <Text style={style}>{value.displayText}</Text>;
  }

  return <Link src={target} style={style}>{value.displayText}</Link>;
}

function ContactValue({ value }: { value: ResumeDisplayLink }) {
  const target = safePdfLinkTarget(value.linkTarget);

  if (!target) return <>{value.displayText}</>;
  return <Link src={target} style={styles.contactLink}>{value.displayText}</Link>;
}

function HeaderSection({ model }: { model: ResumeDocumentModel }) {
  const { header } = model;
  const contactValues = [
    header.contact.location,
    header.contact.phone,
    header.contact.email,
    header.contact.portfolio,
  ].filter((value): value is string | ResumeDisplayLink => Boolean(value));

  return (
    <View style={styles.header}>
      <Text style={styles.name}>{header.fullName}</Text>
      {header.jobTitle && <Text style={styles.jobTitle}>{header.jobTitle}</Text>}
      {contactValues.length > 0 && (
        <Text style={styles.contact}>
          {contactValues.map((value, index) => (
            <Text key={`${typeof value === 'string' ? value : value.displayText}-${index}`}>
              {index > 0 ? ' • ' : ''}
              {typeof value === 'string' ? value : <ContactValue value={value} />}
            </Text>
          ))}
        </Text>
      )}
    </View>
  );
}

function SectionHeading({ title }: { title: string }) {
  return <Text style={styles.sectionTitle} minPresenceAhead={36}>{title}</Text>;
}

function Description({ content }: { content: string }) {
  if (!content) return null;
  return (
    <Text style={styles.itemDescription} orphans={2} widows={2}>
      {content}
    </Text>
  );
}

function BulletList({ bulletPoints }: { bulletPoints: string[] }) {
  if (bulletPoints.length === 0) return null;
  return (
    <View style={styles.bulletList}>
      {bulletPoints.map((bullet, index) => (
        <Text key={`${bullet}-${index}`} style={styles.bullet} orphans={2} widows={2}>
          {'• '}{bullet}
        </Text>
      ))}
    </View>
  );
}

function WorkItem({ item }: { item: ResumeWorkItem }) {
  const dateRange = item.startDate && item.endDate ? `${item.startDate} - ${item.endDate}` : '';

  return (
    <View style={styles.item}>
      <View style={styles.itemHeader} minPresenceAhead={36}>
        <Text style={styles.itemHeaderText}>
          <Text style={styles.itemTitle}>{item.jobTitle || 'Position Title'}</Text>
          {item.company && <Text style={styles.itemTitle}> at <Text style={styles.itemCompany}>{item.company}</Text></Text>}
          {item.location && <Text style={styles.itemDate}>, {item.location}</Text>}
        </Text>
        {dateRange && <Text style={styles.itemDate}>{dateRange}</Text>}
      </View>
      <Description content={item.description} />
      <BulletList bulletPoints={item.bulletPoints} />
    </View>
  );
}

function WorkSection({ section }: { section: ResumeWorkSection }) {
  return (
    <View style={styles.section}>
      <SectionHeading title={section.title} />
      {section.items.map((item, index) => <WorkItem key={index} item={item} />)}
    </View>
  );
}

function EducationItem({ item }: { item: ResumeEducationItem }) {
  return (
    <View style={styles.compactItem}>
      <View style={styles.itemHeader} minPresenceAhead={36}>
        <Text style={styles.itemHeaderText}>
          <Text style={styles.itemTitle}>{item.degree || 'Degree'}</Text>
          {item.institution && <Text style={styles.itemTitle}>, {item.institution}</Text>}
          {item.location && <Text style={styles.itemDate}>, {item.location}</Text>}
        </Text>
        <Text style={styles.itemDate}>{item.dateRange || 'Date'}</Text>
      </View>
      <Description content={item.description} />
      <BulletList bulletPoints={item.bulletPoints} />
    </View>
  );
}

function EducationSection({ section }: { section: ResumeEducationSection }) {
  return (
    <View style={styles.section}>
      <SectionHeading title={section.title} />
      {section.items.map((item, index) => <EducationItem key={index} item={item} />)}
    </View>
  );
}

function ProjectItem({ item }: { item: ResumeProjectItem }) {
  const name = item.name.displayText || 'Project Name';
  const target = safePdfLinkTarget(item.name.linkTarget);

  return (
    <View style={styles.item}>
      <View style={styles.itemHeader} minPresenceAhead={36}>
        <Text style={styles.itemHeaderText}>
          {target ? <Link src={target} style={styles.projectLink}>{name}</Link> : <Text style={styles.itemTitle}>{name}</Text>}
        </Text>
        {item.dateRange && <Text style={styles.itemDate}>{item.dateRange}</Text>}
      </View>
      <BulletList bulletPoints={item.bulletPoints} />
    </View>
  );
}

function ProjectsSection({ section }: { section: ResumeProjectsSection }) {
  return (
    <View style={styles.section}>
      <SectionHeading title={section.title} />
      {section.items.map((item, index) => <ProjectItem key={index} item={item} />)}
    </View>
  );
}

function LinkItem({ item }: { item: ResumeLinkItem }) {
  return (
    <View style={styles.linkItem} minPresenceAhead={36}>
      <Text style={styles.itemTitle}>
        {item.title || 'Link'}
        {item.url && (
          <>
            <Text style={styles.itemDate}>: </Text>
            <DisplayLink value={item.url} style={styles.itemDate} />
          </>
        )}
      </Text>
    </View>
  );
}

function LinksSection({ section }: { section: ResumeLinksSection }) {
  return (
    <View style={styles.section}>
      <SectionHeading title={section.title} />
      {section.items.map((item, index) => <LinkItem key={index} item={item} />)}
    </View>
  );
}

function ReferenceItem({ item }: { item: ResumeReferenceItem }) {
  return (
    <View style={styles.compactItem}>
      <Text style={styles.itemTitle} minPresenceAhead={36}>
        {item.referentName || 'Reference Name'}
        {item.referentCompany && <Text>, {item.position ? `${item.position} at ` : ''}{item.referentCompany}</Text>}
      </Text>
      {(item.phone || item.email) && (
        <Text style={styles.itemDate} orphans={2} widows={2}>
          {item.phone && <ContactValue value={item.phone} />}
          {item.phone && item.email && ' • '}
          {item.email && <ContactValue value={item.email} />}
        </Text>
      )}
    </View>
  );
}

function ReferencesSection({ section }: { section: ResumeReferencesSection }) {
  return (
    <View style={styles.section}>
      <SectionHeading title={section.title} />
      {section.items.map((item, index) => <ReferenceItem key={index} item={item} />)}
    </View>
  );
}

function SummarySection({ section }: { section: ResumeSummarySection }) {
  return (
    <View style={styles.section}>
      <SectionHeading title={section.title} />
      <Description content={section.content} />
    </View>
  );
}

function CombinedSkillsSection({ section }: { section: ResumeCombinedSkillsSection }) {
  return (
    <View style={styles.section}>
      <SectionHeading title={section.title} />
      <View style={styles.inlineList}>
        {section.groups.map((group, index) => (
          <Text
            key={group.id}
            style={index < section.groups.length - 1 ? styles.inlineGroup : undefined}
            orphans={2}
            widows={2}
          >
            <Text style={styles.itemTitle}>{group.label}:</Text>{' '}{group.items.join('; ')}
          </Text>
        ))}
      </View>
    </View>
  );
}

function CustomItem({ item }: { item: ResumeCustomItem }) {
  return (
    <View style={styles.item}>
      {(item.header || item.subheader) && (
        <Text style={styles.customHeader} minPresenceAhead={36}>
          {item.header && <Text style={styles.itemTitle}>{item.header}</Text>}
          {item.subheader && <Text style={styles.customSubheader}>{item.header ? ' - ' : ''}{item.subheader}</Text>}
        </Text>
      )}
      <Description content={item.description} />
      <BulletList bulletPoints={item.bulletPoints} />
    </View>
  );
}

function CustomSection({ section }: { section: ResumeCustomSection }) {
  return (
    <View style={styles.section}>
      <SectionHeading title={section.title} />
      {section.items.map((item, index) => <CustomItem key={index} item={item} />)}
    </View>
  );
}

function renderSection(section: ResumeDocumentSection) {
  switch (section.kind) {
    case 'summary':
      return <SummarySection key={section.id} section={section} />;
    case 'employment':
    case 'internships':
      return <WorkSection key={section.id} section={section} />;
    case 'education':
      return <EducationSection key={section.id} section={section} />;
    case 'projects':
      return <ProjectsSection key={section.id} section={section} />;
    case 'links':
      return <LinksSection key={section.id} section={section} />;
    case 'references':
      return <ReferencesSection key={section.id} section={section} />;
    case 'combinedSkills':
      return <CombinedSkillsSection key={section.id} section={section} />;
    case 'custom':
      return <CustomSection key={section.id} section={section} />;
  }
}

export interface HarvardPdfDocumentProps {
  model: ResumeDocumentModel;
}

/**
 * A renderer-only A4 implementation of the existing Harvard resume template.
 * It receives an already-localized document model and intentionally contains
 * no hooks, DOM measurements, browser APIs, or translation lookups.
 */
export function HarvardPdfDocument({ model }: HarvardPdfDocumentProps) {
  return (
    <Document
      title={model.metadata.title}
      author={model.metadata.author}
      creator={model.metadata.creator}
      producer={model.metadata.producer}
      language={model.metadata.language}
    >
      <Page size="A4" style={styles.page} wrap>
        <HeaderSection model={model} />
        {model.sections.map(renderSection)}
      </Page>
    </Document>
  );
}

export default HarvardPdfDocument;
