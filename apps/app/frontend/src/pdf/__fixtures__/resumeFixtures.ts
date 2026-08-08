import { FileText } from 'lucide-react';
import type { FormData, SidebarItem } from '../../types/resume';

/**
 * Shared inputs for model, PDF-byte, and visual-regression tests. They are
 * deliberately plain persisted-form data, rather than renderer-specific JSX.
 */
export interface ResumePdfFixture {
  id: string;
  locale: 'en' | 'es';
  expectedMinimumPages: number;
  formData: FormData;
  sidebarItems: SidebarItem[];
}

function emptyFormData(): FormData {
  return {
    firstName: '',
    lastName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    portfolio: '',
    about: '',
    projects: [],
    skills: [],
    technologiesSkills: [],
    education: [],
    employment: [],
    languages: [],
    internships: [],
    courses: [],
    references: [],
    links: [],
    hobbies: [],
  };
}

function sidebarItem(id: string, order: number, label: string, fixed = false): SidebarItem {
  return { id, order, label, fixed, icon: FileText };
}

function fullSidebar(customId: string, customLabel: string): SidebarItem[] {
  return [
    sidebarItem('personal', 0, 'Personal details', true),
    sidebarItem('contact', 1, 'Contact information', true),
    // Normal sections intentionally use a non-default order.
    sidebarItem('projects', 2, 'Projects'),
    sidebarItem('summary', 3, 'Professional summary'),
    sidebarItem(customId, 4, customLabel),
    sidebarItem('employment', 5, 'Employment history'),
    sidebarItem('education', 6, 'Education'),
    sidebarItem('internships', 7, 'Internships'),
    sidebarItem('links', 8, 'Links'),
    sidebarItem('references', 9, 'References'),
    // Combined groups are deliberately interleaved in sidebar order; the
    // document model must move the single combined section to the end.
    sidebarItem('languages', 10, 'Languages'),
    sidebarItem('courses', 11, 'Courses'),
    sidebarItem('skills', 12, 'Skills'),
    sidebarItem('technologiesSkills', 13, 'Technologies'),
    sidebarItem('hobbies', 14, 'Hobbies'),
  ];
}

const longEnglishBullet =
  'Led a cross-functional delivery program spanning research, product, design, engineering, operations, and customer success; established a measurable release process that reduced handoff time while keeping accessibility, reliability, and customer feedback visible in every decision.';

const longSpanishBullet =
  'Lideré un programa de entrega multifuncional entre investigación, producto, diseño, ingeniería, operaciones y éxito del cliente; establecí un proceso de lanzamiento medible que redujo el tiempo de traspaso y mantuvo la accesibilidad, la confiabilidad y los comentarios de clientes visibles en cada decisión.';

export const onePageEnglishResumeFixture: ResumePdfFixture = {
  id: 'one-page-en',
  locale: 'en',
  expectedMinimumPages: 1,
  formData: {
    ...emptyFormData(),
    firstName: 'Alex',
    lastName: 'Morgan',
    jobTitle: 'Product Designer',
    email: 'alex.morgan@example.com',
    phone: '+1 (415) 555-0136',
    location: 'San Francisco, CA',
    portfolio: 'alexmorgan.design',
    about: 'Product designer who turns complex workflows into calm, accessible experiences.',
    employment: [{
      id: 'en-one-employment-1',
      jobTitle: 'Senior Product Designer',
      company: 'Northstar',
      startDate: 'Jan 2022',
      endDate: 'Present',
      location: 'San Francisco, CA',
      description: 'Own the end-to-end design of a collaborative planning product.',
      bulletPoints: ['Increased weekly active teams by 24% through a redesigned onboarding flow.'],
      isCurrentJob: true,
    }],
    skills: [{ id: 'en-one-skill-1', skillName: 'Product strategy' }, { id: 'en-one-skill-2', skillName: 'Figma' }],
  },
  sidebarItems: [
    sidebarItem('personal', 0, 'Personal details', true),
    sidebarItem('contact', 1, 'Contact information', true),
    sidebarItem('summary', 2, 'Professional summary'),
    sidebarItem('employment', 3, 'Employment history'),
    sidebarItem('skills', 4, 'Skills'),
  ],
};

export const multiPageEnglishResumeFixture: ResumePdfFixture = {
  id: 'multi-page-en',
  locale: 'en',
  expectedMinimumPages: 2,
  formData: {
    ...emptyFormData(),
    firstName: 'Taylor',
    lastName: 'Bennett',
    jobTitle: 'Staff Product Manager',
    email: 'taylor.bennett@example.com',
    phone: '+1 (212) 555-0198',
    location: 'Brooklyn, NY',
    portfolio: 'https://taylor-bennett.example.com/work?source=resume&campaign=2026',
    about: 'Staff product manager with nine years of experience building trusted tools for complex, regulated workflows. I combine customer research, systems thinking, and pragmatic delivery to help teams make high-quality decisions at scale.',
    employment: [
      {
        id: 'en-employment-1',
        jobTitle: 'Staff Product Manager',
        company: 'Northstar Health',
        startDate: 'Mar 2022',
        endDate: 'Present',
        location: 'New York, NY',
        description: 'Lead strategy and execution for a clinical operations platform used by more than 6,000 care coordinators across three countries.',
        bulletPoints: [
          longEnglishBullet,
          'Partnered with clinicians and compliance leaders to launch an audit trail that cut manual evidence gathering from two days to under thirty minutes.',
          'Established quarterly outcome reviews with clear success metrics, enabling the team to retire low-value work and focus investment on the highest-impact care journeys.',
          'Mentored four product managers through discovery planning, narrative writing, and stakeholder communication.',
        ],
        isCurrentJob: true,
      },
      {
        id: 'en-employment-2',
        jobTitle: 'Senior Product Manager',
        company: 'Atlas Commerce',
        startDate: 'Jun 2018',
        endDate: 'Feb 2022',
        location: 'Remote',
        description: 'Owned the merchant insights portfolio for a global payments platform.',
        bulletPoints: [
          longEnglishBullet,
          'Launched configurable reporting for enterprise merchants, increasing self-service adoption by 31% and reducing support tickets by 18%.',
          'Coordinated a migration from fragmented dashboards to a unified event model without interrupting month-end reporting.',
        ],
        isCurrentJob: false,
      },
      {
        id: 'en-employment-3',
        jobTitle: 'Product Manager',
        company: 'CityLab',
        startDate: 'Aug 2015',
        endDate: 'May 2018',
        location: 'Boston, MA',
        description: 'Built civic technology products with municipal agencies and residents.',
        bulletPoints: [
          'Shipped a mobile permit experience that made application status clear for more than 90,000 residents.',
          longEnglishBullet,
        ],
        isCurrentJob: false,
      },
    ],
    internships: [{
      id: 'en-internship-1',
      jobTitle: 'Product Operations Intern',
      company: 'Harbor Studio',
      startDate: 'May 2015',
      endDate: 'Aug 2015',
      location: 'Boston, MA',
      description: 'Supported customer research and release coordination for a small design consultancy.',
      bulletPoints: ['Synthesized twenty-five interview transcripts into a prioritized opportunity map.'],
    }],
    education: [{
      id: 'en-education-1',
      institution: 'Northeastern University',
      degree: 'B.S. in Information Design',
      dateRange: '2011 - 2015',
      location: 'Boston, MA',
      bulletPoints: ['Graduated magna cum laude; coursework included systems design, research methods, and information visualization.'],
    }],
    projects: [
      {
        id: 'en-project-1',
        name: 'Accessible Service Blueprint Kit',
        url: 'github.com/taylorbennett/service-blueprint-kit',
        dateRange: '2025',
        bulletPoints: [longEnglishBullet, 'Published open templates and facilitation guides used by product teams in twelve organizations.'],
      },
      {
        id: 'en-project-2',
        name: '',
        url: 'https://example.com/case-studies/long-url-that-keeps-going?utm_source=resume&utm_medium=pdf&utm_campaign=leadership-portfolio',
        dateRange: '',
        bulletPoints: [],
      },
    ],
    links: [
      { id: 'en-link-1', linkTitle: 'Portfolio', url: 'taylor-bennett.example.com/case-studies/clinical-operations-platform' },
      { id: 'en-link-2', linkTitle: 'Writing', url: 'https://medium.example.com/@taylor-bennett/how-to-measure-product-outcomes-without-vanity-metrics' },
    ],
    references: [
      { id: 'en-reference-1', referentName: 'Jordan Lee', referentCompany: 'Northstar Health', referentEmail: 'jordan.lee@example.com', referentPhone: '+1 212 555 0123' },
      { id: 'en-reference-2', referentName: 'Morgan Rivera', referentCompany: 'Atlas Commerce', referentEmail: 'morgan.rivera@example.com', referentPhone: '+1 646 555 0141' },
    ],
    courses: [{ id: 'en-course-1', courseName: 'Designing for Accessibility' }, { id: 'en-course-2', courseName: 'Healthcare Product Leadership' }],
    skills: [{ id: 'en-skill-1', skillName: 'Product strategy' }, { id: 'en-skill-2', skillName: 'Customer research' }, { id: 'en-skill-3', skillName: 'Roadmapping' }],
    technologiesSkills: [{ id: 'en-tech-1', technologiesSkillName: 'SQL' }, { id: 'en-tech-2', technologiesSkillName: 'Amplitude' }, { id: 'en-tech-3', technologiesSkillName: 'Figma' }],
    languages: [{ id: 'en-language-1', language: 'English', proficiency: 'Native' }, { id: 'en-language-2', language: 'Spanish', proficiency: 'Advanced' }],
    hobbies: [{ id: 'en-hobby-1', hobbyName: 'Community radio' }, { id: 'en-hobby-2', hobbyName: 'Long-distance cycling' }],
    ['customEntries_custom-2']: [{
      id: 'en-custom-1',
      header: 'Volunteer board member',
      subheader: 'Open Streets Coalition',
      description: 'Advise a neighborhood nonprofit on inclusive transportation programs and community partnerships.',
      bulletPoints: ['Organized a public workshop series that brought together residents, local businesses, and city planners.'],
    }],
  },
  sidebarItems: fullSidebar('custom-2', 'Community Leadership'),
};

export const multiPageSpanishResumeFixture: ResumePdfFixture = {
  id: 'multi-page-es',
  locale: 'es',
  expectedMinimumPages: 2,
  formData: {
    ...emptyFormData(),
    firstName: 'Lucía',
    lastName: 'Hernández Núñez',
    jobTitle: 'Gerente Senior de Producto',
    email: 'lucia.hernandez@example.com',
    phone: '+52 55 5555 0148',
    location: 'Ciudad de México, CDMX',
    portfolio: 'luciahernandez.mx/portafolio/producto-y-accesibilidad?idioma=español',
    about: 'Gerente de producto con ocho años de experiencia creando servicios digitales inclusivos para organizaciones complejas. Conecto la investigación con clientes, los datos operativos y la entrega responsable para que los equipos tomen mejores decisiones.',
    employment: [
      {
        id: 'es-employment-1',
        jobTitle: 'Gerente Senior de Producto',
        company: 'Salud Cercana',
        startDate: 'Mar 2022',
        endDate: 'Present',
        location: 'Ciudad de México, CDMX',
        description: 'Dirijo la estrategia y la ejecución de una plataforma de operaciones clínicas usada por más de seis mil coordinadores de atención.',
        bulletPoints: [
          longSpanishBullet,
          'Colaboré con personal médico y especialistas de cumplimiento para lanzar un historial de auditoría que redujo la recopilación manual de evidencia de dos días a menos de treinta minutos.',
          'Implementé revisiones trimestrales de resultados con métricas claras, lo que permitió retirar trabajo de bajo valor y concentrar la inversión en los recorridos de atención con mayor impacto.',
          'Acompañé a cuatro gerentes de producto en planeación de descubrimiento, redacción de narrativas y comunicación con partes interesadas.',
        ],
        isCurrentJob: true,
      },
      {
        id: 'es-employment-2',
        jobTitle: 'Gerente de Producto',
        company: 'Comercio Atlas',
        startDate: 'Jun 2018',
        endDate: 'Feb 2022',
        location: 'Remoto',
        description: 'Gestioné el portafolio de información para comercios de una plataforma global de pagos.',
        bulletPoints: [
          longSpanishBullet,
          'Lancé reportes configurables para comercios empresariales, aumentando la adopción de autoservicio en 31% y reduciendo solicitudes de soporte en 18%.',
          'Coordiné una migración de paneles fragmentados a un modelo único de eventos sin interrumpir los reportes de cierre mensual.',
        ],
        isCurrentJob: false,
      },
      {
        id: 'es-employment-3',
        jobTitle: 'Product Manager',
        company: 'Laboratorio Cívico',
        startDate: 'Ago 2015',
        endDate: 'May 2018',
        location: 'Puebla, PUE',
        description: 'Construí productos de tecnología cívica en colaboración con dependencias municipales y residentes.',
        bulletPoints: ['Publiqué una experiencia móvil de permisos que aclaró el estado de solicitudes para más de 90,000 residentes.', longSpanishBullet],
        isCurrentJob: false,
      },
    ],
    internships: [{
      id: 'es-internship-1',
      jobTitle: 'Practicante de Operaciones de Producto',
      company: 'Estudio Puerto',
      startDate: 'May 2015',
      endDate: 'Ago 2015',
      location: 'Puebla, PUE',
      description: 'Apoyé investigación con clientes y coordinación de lanzamientos para una consultora de diseño.',
      bulletPoints: ['Sinteticé veinticinco entrevistas en un mapa de oportunidades priorizadas.'],
    }],
    education: [{
      id: 'es-education-1',
      institution: 'Universidad Iberoamericana',
      degree: 'Licenciatura en Diseño de Información',
      dateRange: '2011 - 2015',
      location: 'Ciudad de México, CDMX',
      bulletPoints: ['Egresada con honores; cursos en diseño de sistemas, métodos de investigación y visualización de información.'],
    }],
    projects: [
      {
        id: 'es-project-1',
        name: 'Kit de mapas de servicio accesibles',
        url: 'github.com/luciahernandez/kit-mapas-servicio',
        dateRange: '2025',
        bulletPoints: [longSpanishBullet, 'Publiqué plantillas abiertas y guías de facilitación utilizadas por equipos de producto en doce organizaciones.'],
      },
      {
        id: 'es-project-2',
        name: '',
        url: 'https://ejemplo.mx/casos/una-url-muy-larga-para-probar-el-ajuste-de-linea?origen=currículum&medio=pdf&campaña=portafolio',
        dateRange: '',
        bulletPoints: [],
      },
    ],
    links: [
      { id: 'es-link-1', linkTitle: 'Portafolio', url: 'luciahernandez.mx/portafolio/casos-de-estudio-operaciones-clínicas' },
      { id: 'es-link-2', linkTitle: 'Artículos', url: 'https://medio.ejemplo.mx/@luciahernandez/como-medir-resultados-de-producto-sin-métricas-de-vanidad' },
    ],
    references: [
      { id: 'es-reference-1', referentName: 'Sofía Ramírez', referentCompany: 'Salud Cercana', referentEmail: 'sofia.ramirez@example.com', referentPhone: '+52 55 5555 0160' },
      { id: 'es-reference-2', referentName: 'Andrés Muñoz', referentCompany: 'Comercio Atlas', referentEmail: 'andres.munoz@example.com', referentPhone: '+52 55 5555 0172' },
    ],
    courses: [{ id: 'es-course-1', courseName: 'Diseño para accesibilidad' }, { id: 'es-course-2', courseName: 'Liderazgo de producto en salud' }],
    skills: [{ id: 'es-skill-1', skillName: 'Estrategia de producto' }, { id: 'es-skill-2', skillName: 'Investigación con clientes' }, { id: 'es-skill-3', skillName: 'Planeación de producto' }],
    technologiesSkills: [{ id: 'es-tech-1', technologiesSkillName: 'SQL' }, { id: 'es-tech-2', technologiesSkillName: 'Amplitude' }, { id: 'es-tech-3', technologiesSkillName: 'Figma' }],
    languages: [{ id: 'es-language-1', language: 'Español', proficiency: 'Native' }, { id: 'es-language-2', language: 'Inglés', proficiency: 'Advanced' }],
    hobbies: [{ id: 'es-hobby-1', hobbyName: 'Radio comunitaria' }, { id: 'es-hobby-2', hobbyName: 'Ciclismo de larga distancia' }],
    ['customEntries_custom-3']: [{
      id: 'es-custom-1',
      header: 'Consejera voluntaria',
      subheader: 'Coalición Calles Abiertas',
      description: 'Asesoro a una organización vecinal sin fines de lucro sobre programas de transporte inclusivo y alianzas comunitarias.',
      bulletPoints: ['Organicé una serie de talleres públicos que reunió a residentes, comercios locales y personal de planeación urbana.'],
    }],
  },
  sidebarItems: fullSidebar('custom-3', 'Liderazgo comunitario'),
};

export const resumePdfFixtures = [
  onePageEnglishResumeFixture,
  multiPageEnglishResumeFixture,
  multiPageSpanishResumeFixture,
] as const;
