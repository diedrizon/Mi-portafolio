/* ============================================================
 * profile.js — ÚNICA fuente de contenido del portafolio.
 * Edita aquí: contacto, proyectos, stack, indicadores y textos.
 * ============================================================ */

export const SITE_URL = 'https://portafolio-de-diedrizon.netlify.app';

export const IDENTITY = {
  firstName: 'Diedrizon',
  lastName: 'Fargas',
  fullName: 'Diedrizon Domingo Fargas Barrera',
  role: 'Desarrollador de software · Analista de datos BI',
  location: 'Juigalpa, Nicaragua',
  coords: '12.10° N · 85.36° O',
  availability: 'Disponible para proyectos',
  education: 'UNAN · Ing. en Sistemas de la Información',
  educationYears: '2022 — 2026',
  freelanceSince: '2022',
};

export const EMAIL = 'diedrinzonfargas@gmail.com';
export const PHONE_DISPLAY = '+505 8825 7506';

export const SOCIALS = [
  { id: 'github', label: 'GitHub', href: 'https://github.com/diedrizon' },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/diedrizon-fargas-a65181238',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    href: 'https://wa.me/50588257506',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    href: 'https://www.facebook.com/share/1ax1NVEDe8/',
  },
  { id: 'mail', label: 'Email', href: `mailto:${EMAIL}` },
];

export const NAV = [
  { id: 'perfil', index: '02', label: 'Perfil' },
  { id: 'stack', index: '03', label: 'Stack' },
  { id: 'proyectos', index: '04', label: 'Proyectos' },
  { id: 'contacto', index: '05', label: 'Contacto' },
];

/* Indicadores reales y verificables — sin métricas infladas. */
export const STATS = [
  { value: 4, suffix: '+', label: 'Años desarrollando', note: 'Freelance desde 2022' },
  { value: 8, suffix: '', label: 'Sistemas construidos', note: 'Web · móvil · BI' },
  { value: 4, suffix: '', label: 'Sectores atendidos', note: 'Salud · finanzas · comercio · educación' },
  { value: 3, suffix: '', label: 'Plataformas', note: 'Web · móvil · datos' },
];

export const DOMAINS = [
  'Salud pública',
  'Finanzas personales',
  'Comercio y restaurantes',
  'Educación',
];

export const SKILL_GROUPS = [
  {
    title: 'Desarrollo',
    items: ['Java', 'Spring Boot', 'React', 'TypeScript', 'React Native', 'Flutter', 'Node.js'],
  },
  {
    title: 'BI & Visualización',
    items: ['Power BI', 'Tableau', 'Pentaho'],
  },
  {
    title: 'Análisis & ML',
    items: ['Python', 'R', 'Google Colab', 'K-Means', 'Regresión lineal y no lineal'],
  },
  {
    title: 'Bases de datos',
    items: ['PostgreSQL', 'MySQL', 'SQL / PL-pgSQL', 'Supabase', 'Firebase'],
  },
  {
    title: 'Herramientas',
    items: ['Git', 'Vite', 'AWS', 'Figma'],
  },
];

export const TICKER = [
  'React',
  'TypeScript',
  'Spring Boot',
  'Java',
  'Flutter',
  'Power BI',
  'PostgreSQL',
  'MySQL',
  'Supabase',
  'Python',
  'R',
  'Tableau',
  'Pentaho',
  'Node.js',
  'Firebase',
  'AWS',
];

/* ------------------------------------------------------------
 * Proyectos.
 * featured: true  → fila grande tipo caso de estudio
 * links: [{label, href}] — un proyecto puede tener 0, 1 o 2 enlaces
 * status: etiqueta corta (EN PRODUCCIÓN, ACADÉMICO, HACKATHON…)
 * ------------------------------------------------------------ */
export const PROJECTS = [
  {
    id: 'rica-tentacion',
    name: 'Rica Tentación',
    featured: true,
    status: 'Académico · BI end-to-end',
    desc:
      'Sistema de inteligencia de negocios para un restaurante: PWA en React + TypeScript, backend sobre Supabase y MySQL, y capa de análisis con dashboards de KPIs en Power BI. Incluye control de acceso por roles y controles de seguridad alineados a ISO/IEC 27001.',
    tech: ['React', 'TypeScript', 'Supabase', 'MySQL', 'Power BI'],
    links: [],
  },
  {
    id: 'apfine',
    name: 'APFINE',
    featured: true,
    status: 'En producción',
    desc:
      'Plataforma de gestión de finanzas personales: registro de gastos con comprobantes, metas de ahorro y métricas para entender el comportamiento financiero.',
    tech: ['React', 'Vite', 'Firebase'],
    links: [{ label: 'Ver sitio', href: 'https://apfine.com/' }],
  },
  {
    id: 'siven',
    name: 'SIVEN — Vigilancia Epidemiológica',
    featured: true,
    status: 'Sector salud · En equipo',
    desc:
      'Plataforma de vigilancia epidemiológica nacional: API REST en Spring Boot para la gestión de datos del sector salud y aplicación móvil en Flutter que la consume.',
    tech: ['Spring Boot', 'Java', 'Flutter', 'REST'],
    links: [
      { label: 'API', href: 'https://github.com/Alvaro-Hernandez/backend-SIVEN.git' },
      { label: 'App móvil', href: 'https://github.com/Alvaro-Hernandez/SIVEN_APP.git' },
    ],
  },
  {
    id: 'ebenezer',
    name: 'Colegio Ebenezer · BI',
    status: 'Educación',
    desc:
      'Sistema de calificaciones estudiantiles con capa completa de reportería: ETL en Pentaho y reportes en Power BI y Tableau.',
    tech: ['Pentaho', 'Power BI', 'Tableau'],
    links: [
      {
        label: 'Repositorio',
        href: 'https://github.com/JiniethM/Proyecto-Colegio-Bautista-Ebenezer_BI-2',
      },
    ],
  },
  {
    id: 'truequeya',
    name: 'TruequeYA',
    status: 'Hackathon Nicaragua 2026',
    desc:
      'PWA mobile-first de trueque digital entre emprendedores, con sistema de créditos e integración con WhatsApp. Desarrollado en equipo para el hN10.',
    tech: ['React', 'PWA', 'Supabase'],
    links: [],
  },
  {
    id: 'bicicletas',
    name: 'Reparaciones de Bicicleta',
    status: 'Móvil',
    desc: 'App móvil para gestionar órdenes de reparación: estados, clientes e historial.',
    tech: ['React Native', 'Expo', 'Firebase'],
    links: [
      {
        label: 'Repositorio',
        href: 'https://github.com/diedrizon/Reparaciones-de-bicicleta-',
      },
    ],
  },
  {
    id: 'farmacia',
    name: 'Farmacia Rosales',
    status: 'Escritorio',
    desc: 'Gestión farmacéutica con control de inventario y ventas sobre base de datos relacional.',
    tech: ['Java', 'MySQL'],
    links: [
      {
        label: 'Repositorio',
        href: 'https://github.com/diedrizon/Repositorio-Farmacia-Rosales..git',
      },
    ],
  },
  {
    id: 'chontal-grill',
    name: 'Chontal Grill',
    status: 'Móvil',
    desc: 'Control de pedidos y mesas para restaurante, pensado para la operación del día a día.',
    tech: ['React Native', 'MySQL'],
    links: [
      { label: 'Repositorio', href: 'https://github.com/diedrizon/Chontal_Grill.git' },
    ],
  },
];
