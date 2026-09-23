import type { Locale } from './routing'

type SiteCopy = {
  sections: {
    hero: string
    manifesto: string
    craft: string
    research: string
    sensoryProfile: string
    entrepreneurship: string
    community: string
    journey: string
    contact: string
  }
  navigation: Array<{ href: string; label: string }>
  footerNavigation: Array<{ href: string; label: string }>
  heroActions: Array<{ href: string; label: string }>
  primaryAction: { href: string; label: string }
  journeyAction: { href: string; label: string }
}

const siteCopy: Record<Locale, SiteCopy> = {
  es: {
    sections: {
      hero: 'Monografía Vol. 01 · Perfil de oficio',
      manifesto: '02 · Manifiesto de trazabilidad',
      craft: '03 · Fundamentos técnicos',
      research: '04 · Enfoque científico y práctico',
      sensoryProfile: 'Ficha de observación sensorial',
      entrepreneurship: '05 · Emprendimiento local',
      community: '06 · Impacto social',
      journey: '07 · Eje internacional',
      contact: '08 · Colaboraciones y servicios',
    },
    navigation: [
      { label: 'Historia', href: '/historia' },
      { label: 'Experiencia', href: '/experiencia' },
      { label: 'Servicios', href: '/servicios' },
      { label: 'Dónde Conejo', href: '/donde-conejo' },
    ],
    footerNavigation: [
      { label: 'Inicio', href: '/' },
      { label: 'Historia', href: '/historia' },
      { label: 'Experiencia', href: '/experiencia' },
      { label: 'Servicios', href: '/servicios' },
      { label: 'Dónde Conejo', href: '/donde-conejo' },
      { label: 'Formación', href: '/formacion' },
      { label: 'Comunidad', href: '/comunidad' },
      { label: 'Francia', href: '/colombia-francia' },
      { label: 'Contacto', href: '/contacto' },
    ],
    heroActions: [
      { label: 'Conoce mi historia', href: '/historia' },
      { label: 'Ver mi experiencia', href: '/experiencia' },
    ],
    primaryAction: { label: 'Hablemos de café', href: '/contacto' },
    journeyAction: { label: 'Ver la bitácora Francia', href: '/colombia-francia' },
  },
  fr: {
    sections: {
      hero: 'Monographie Vol. 01 · Profil professionnel',
      manifesto: '02 · Manifeste de traçabilité',
      craft: '03 · Fondements techniques',
      research: '04 · Approche scientifique et pratique',
      sensoryProfile: "Fiche d'observation sensorielle",
      entrepreneurship: '05 · Entrepreneuriat local',
      community: '06 · Impact social',
      journey: '07 · Axe international',
      contact: '08 · Collaborations et services',
    },
    navigation: [
      { label: 'Histoire', href: '/historia' },
      { label: 'Expérience', href: '/experiencia' },
      { label: 'Services', href: '/servicios' },
      { label: 'Dónde Conejo', href: '/donde-conejo' },
    ],
    footerNavigation: [
      { label: 'Accueil', href: '/' },
      { label: 'Histoire', href: '/historia' },
      { label: 'Expérience', href: '/experiencia' },
      { label: 'Services', href: '/servicios' },
      { label: 'Dónde Conejo', href: '/donde-conejo' },
      { label: 'Formation', href: '/formacion' },
      { label: 'Communauté', href: '/comunidad' },
      { label: 'France', href: '/colombia-francia' },
      { label: 'Contact', href: '/contacto' },
    ],
    heroActions: [
      { label: 'Découvrir mon histoire', href: '/historia' },
      { label: 'Voir mon expérience', href: '/experiencia' },
    ],
    primaryAction: { label: 'Parlons café', href: '/contacto' },
    journeyAction: { label: 'Voir le carnet France', href: '/colombia-francia' },
  },
  en: {
    sections: {
      hero: 'Monograph Vol. 01 · Professional profile',
      manifesto: '02 · Traceability manifesto',
      craft: '03 · Technical foundations',
      research: '04 · Scientific and practical approach',
      sensoryProfile: 'Sensory observation sheet',
      entrepreneurship: '05 · Local entrepreneurship',
      community: '06 · Social impact',
      journey: '07 · International journey',
      contact: '08 · Collaborations and services',
    },
    navigation: [
      { label: 'Story', href: '/historia' },
      { label: 'Experience', href: '/experiencia' },
      { label: 'Services', href: '/servicios' },
      { label: 'Dónde Conejo', href: '/donde-conejo' },
    ],
    footerNavigation: [
      { label: 'Home', href: '/' },
      { label: 'Story', href: '/historia' },
      { label: 'Experience', href: '/experiencia' },
      { label: 'Services', href: '/servicios' },
      { label: 'Dónde Conejo', href: '/donde-conejo' },
      { label: 'Training', href: '/formacion' },
      { label: 'Community', href: '/comunidad' },
      { label: 'France', href: '/colombia-francia' },
      { label: 'Contact', href: '/contacto' },
    ],
    heroActions: [
      { label: 'Discover my story', href: '/historia' },
      { label: 'View my experience', href: '/experiencia' },
    ],
    primaryAction: { label: 'Let’s talk coffee', href: '/contacto' },
    journeyAction: { label: 'View the France journal', href: '/colombia-francia' },
  },
}

export const getSiteCopy = (locale: Locale) => siteCopy[locale]
