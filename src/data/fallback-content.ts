import type { Homepage, Location, SiteSetting } from '@/payload-types'

const now = new Date(0).toISOString()

export const fallbackLocations: Location[] = [
  {
    id: 'fallback-centro',
    name: 'Dónde Conejo — Estación Centro',
    code: 'Sede 01',
    status: 'open',
    description:
      'Barra de paso ágil, servicio de espresso matutino y café tostado de productores tolimenses. Un espacio de conversación vecinal y calibración diaria.',
    city: 'Ibagué, Tolima',
    schedule: 'Lun — Sáb · 07:30–18:30',
    updatedAt: now,
    createdAt: now,
    _status: 'published',
  },
  {
    id: 'fallback-filtrados',
    name: 'Dónde Conejo — Barra de Filtrados',
    code: 'Sede 02',
    status: 'open',
    description:
      'Catas pausadas, métodos manuales y talleres introductorios. Un laboratorio accesible donde cada taza cuenta con una ficha técnica de procedencia.',
    city: 'Zona universitaria · Ibagué',
    schedule: 'Mar — Dom · 09:00–20:00',
    updatedAt: now,
    createdAt: now,
    _status: 'published',
  },
]

export const fallbackSiteSettings: SiteSetting = {
  id: 'fallback-site-settings',
  siteName: 'Conejo',
  siteUrl: 'http://localhost:3000',
  contact: {
    email: 'contacto@conejobarista.com',
    location: 'Ibagué, Tolima, Colombia · Rennes, Francia',
  },
  socialLinks: [
    {
      platform: 'instagram',
      label: '@conejo.barista',
      url: 'https://instagram.com/conejo.barista',
    },
    { platform: 'whatsapp', label: 'Mensajería directa', url: 'https://wa.me/' },
    { platform: 'linkedin', label: 'Juan David Conejo Acuña', url: 'https://linkedin.com' },
  ],
  footer: {
    descriptor:
      'Barista profesional certificado SCA, investigador sensorial y emprendedor de café de especialidad.',
    quote: 'Café, aprendizaje y camino.',
    legal: '© 2026 Juan David Conejo Acuña.',
  },
  titleTemplate: '%s | Conejo',
  defaultMetaTitle: 'Conejo — Barista SCA',
  defaultMetaDescription:
    'Barista profesional colombiano, investigador sensorial y emprendedor de café de especialidad entre Tolima y Francia.',
  allowIndexing: true,
}

export const fallbackHomepage: Homepage = {
  id: 'fallback-homepage',
  hero: {
    title: 'Juan David Conejo Acuña',
    description:
      'Barista profesional colombiano de Ibagué, certificado SCA y especializado en espresso y métodos de filtrado. Una trayectoria que une investigación sensorial, formación comunitaria y emprendimiento entre Colombia y Francia.',
    name: 'Conejo',
    roles: [{ label: 'Barista' }, { label: 'Investigador' }, { label: 'Emprendedor' }],
    quote: 'El café como oficio, aprendizaje y búsqueda constante.',
    imageCaption: {
      eyebrow: 'Registro de barra · 2026',
      title: 'Calibración y extracción matutina',
      technicalValue: '93.5 °C · 9.2 bar',
    },
    metrics: [
      { value: '2.5', label: 'Años de oficio' },
      { value: '02', label: 'Barras activas', accent: true },
      { value: '05', label: 'Becarios Crecemos' },
      { value: 'COL → FR', label: 'Puente vivo' },
    ],
  },
  manifesto: {
    quote: 'Cada taza comienza mucho antes de llegar al consumidor.',
    principles: [
      {
        text: 'El barista no es el centro ni el héroe del café; es un intérprete. Todo grano porta el esfuerzo de familias campesinas, los ciclos de lluvia, la sombra y la fermentación en cereza.',
      },
      {
        text: 'Nuestra responsabilidad en la estación es no arruinar lo que la naturaleza y el caficultor tardaron un año en construir. La especialidad exige transparencia, remuneración justa y servicio sin pedestal.',
      },
    ],
    facts: [
      { label: 'Protocolo origen', value: 'Tolima Terroir', detail: '1.750–2.100 msnm' },
      { label: 'Ética de barra', value: 'Puente activo', detail: 'Del recolector a la mesa' },
    ],
  },
  craft: {
    title: 'En la barra: oficio y extracción',
    description:
      'Dos disciplinas complementarias construidas sobre calibración metódica y análisis sensorial en servicio real.',
    pillars: [
      {
        eyebrow: 'Pilar 01 · Presión y solubilidad',
        badge: 'SCA Espresso Skills',
        title: 'Máquina de espresso',
        description:
          'Calibración dinámica según clima, humedad y descanso del lote. Control de gramaje, tiempo de contacto y canalización para resaltar una acidez viva y un cuerpo sedoso.',
        parameters: [
          { label: 'Dosis seca', value: '18.5 g' },
          { label: 'Rendimiento', value: '39.0 g' },
          { label: 'Contacto', value: '27 s' },
        ],
      },
      {
        eyebrow: 'Pilar 02 · Goteo y claridad',
        badge: 'The Champs Experience',
        title: 'Métodos manuales de filtrado',
        description:
          'Vertidos medidos, ratios calculados y geometrías de molienda para revelar capas aromáticas, desde varietales Geisha hasta fermentaciones anaeróbicas del Tolima.',
        parameters: [
          { label: 'Métodos', value: 'V60 · Origami' },
          { label: 'Ratio', value: '1:15–1:16.5' },
          { label: 'Agua', value: '92 °C' },
        ],
      },
    ],
  },
  research: {
    title: 'Entender antes de servir.',
    description:
      'La barra funciona como una mesa de laboratorio donde el rigor sensorial dialoga con la química cotidiana. Agua, tueste y molienda determinan juntos el perfil final.',
    topics: [
      {
        icon: 'droplets',
        title: 'Mineralización del agua',
        description: 'Monitoreo de dureza y bicarbonatos para preservar acidez sin aspereza.',
      },
      {
        icon: 'bean',
        title: 'Densidad y variedad botánica',
        description: 'Ajustes de flujo y temperatura para Caturra, Castillo y Bourbon Rosado.',
      },
    ],
    sensoryProfile: {
      title: 'Tolima Sur · Lote anaeróbico 72 h',
      score: 87.5,
      flavorNotes: 'Maracuyá, cacao nibs y panela',
      attributes: [
        { label: 'Fragancia', value: 9 },
        { label: 'Acidez', value: 8.5 },
        { label: 'Cuerpo', value: 7.5 },
        { label: 'Balance', value: 8 },
        { label: 'Postgusto', value: 8 },
        { label: 'Limpieza', value: 9 },
      ],
      measurements: [
        { label: 'TDS extraído', value: '1.42%' },
        { label: 'Rendimiento', value: '20.4%' },
        { label: 'Dureza de agua', value: '110 ppm' },
        { label: 'Temperatura', value: '92.0 °C' },
      ],
    },
  },
  entrepreneurship: {
    title: 'Dónde Conejo: dos barras en Ibagué',
    description:
      'Una propuesta de especialidad barrial que desmitifica el café fino. Cercanía cotidiana y precios honestos convierten el hábito de consumo en comunidad.',
    quote: 'No tienes que ser rico para tomar un buen café.',
    locations: fallbackLocations,
  },
  community: {
    title: 'Fundación Crecemos y formación comunitaria',
    description:
      'El conocimiento adquiere valor cuando se transfiere. Cinco personas recibieron formación en técnicas de barista, servicio y calibración sensorial.',
    initiative: {
      title: 'Proyecto Pasaporte del Café',
      description:
        'Una iniciativa para recorrer y visibilizar barras locales, fortalecer el ecosistema cafetero de Ibagué y premiar el consumo de origen.',
    },
    metrics: [
      {
        value: '05',
        label: 'Jóvenes graduados',
        description: 'Formación técnica para inserción laboral.',
      },
      {
        value: '12+',
        label: 'Barras vinculadas',
        description: 'Un mapa vivo de especialidad local.',
      },
    ],
    quote:
      'Capacitar no es enseñar recetas, es cultivar el amor propio por la disciplina de servir bien.',
  },
  journey: {
    title: 'Un puente de ida y vuelta: Colombia → Francia',
    description:
      'La vocación nació observando cafeterías independientes en Francia y regresó a Colombia para comprender la tierra del Tolima, los procesos de beneficio y el oficio certificado.',
    chapters: [
      {
        period: '2023',
        title: 'Francia · El despertar',
        description: 'Cultura del café pausado y pastelería fina.',
      },
      {
        period: '2024–26',
        title: 'Tolima · El oficio',
        description: 'Finca, barra, emprendimiento y certificación SCA.',
      },
      {
        period: '2026+',
        title: 'Rennes / París · La proyección',
        description: 'Origen campesino conectado con barras europeas.',
      },
    ],
  },
  contact: {
    title: '¿Hablamos de café?',
    description:
      'Dirección técnica de barras, calibración de cartas, formación de equipos, catas corporativas y alianzas con tostadores internacionales.',
    services: [
      { label: 'Capacitación SCA' },
      { label: 'Asesoría de aperturas' },
      { label: 'Eventos sensoriales' },
    ],
  },
  _status: 'published',
}

export const fallbackImages = {
  hero: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBB2lYQZG5BEUSByWSTrv8iI6bikSpdYMvUsP611IGNh7N8rQwXcbBBE5D_7UZsB86vZgZEw10hpGpqN3qpZGgV7a_TuMWm4_IYCS0JgGivQ_xFotgRZ3lJl8wvMgfXUvnFmRaFOhVagf5HLnU8EqoLQVDlJqxRK822CqPMJhOkWXR8VMz4hM3mugyzVwjwwhT4NfOpXjc0TMWcOVsm9CtbBXvvwWRGZVY9Jr7L7dSYxkBfpS9dJcVN',
  filter:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCGuX3QUJ7zgWAuXndEi37mETuQBFG8Y_HyVOaUN0oUZlnMXyg0uMMPjNtpgqe9_uaDYVu8QPTl-2e2UDPdD-NnEZcUDT5QRVLPYjzG2pA7OV1DbECf5GlOsELLK-Zi8RMx6qDwh-6bhQOEpZxounasS8xwQA49EuaO8Iht-NDPHsteBeEI5ywD7B9es7a2dlcqkXjTLUPjQOuWGgwXCMXBK9Fuz54wItPbPa5TVYzbOm6aWEhkba2G',
} as const
