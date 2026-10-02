import type { Field, GlobalConfig } from 'payload'

import { revalidatePageContent } from '@/hooks/revalidate-page-content'

const sectionIntro = (): Field[] => [
  {
    name: 'title',
    label: 'Título principal de la sección',
    type: 'text',
    localized: true,
    required: true,
    admin: {
      description: 'Es el encabezado grande que verá el visitante.',
    },
  },
  {
    name: 'description',
    label: 'Texto introductorio',
    type: 'textarea',
    localized: true,
    admin: {
      description: 'Un párrafo breve que explica esta sección.',
    },
  },
]

const makeFieldsOptional = (fields: Field[]): Field[] =>
  fields.map((field) => {
    const optionalField = { ...field } as Field & { minRows?: number; required?: boolean }
    delete optionalField.minRows
    delete optionalField.required

    if (optionalField.type === 'tabs') {
      return {
        ...optionalField,
        tabs: optionalField.tabs.map((tab) => ({
          ...tab,
          fields: makeFieldsOptional(tab.fields),
        })),
      }
    }

    if ('fields' in optionalField && Array.isArray(optionalField.fields)) {
      return {
        ...optionalField,
        fields: makeFieldsOptional(optionalField.fields),
      } as Field
    }

    return optionalField
  })

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Home',
  admin: {
    group: 'Páginas',
    description: 'Puedes guardar y publicar únicamente los campos que necesites completar.',
    components: {
      elements: {
        beforeDocumentControls: ['/components/admin/PreviewFocusBridge#PreviewFocusBridge'],
      },
    },
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    afterChange: [revalidatePageContent],
  },
  fields: makeFieldsOptional([
    {
      type: 'tabs',
      tabs: [
        {
          label: '01 · Hero',
          fields: [
            {
              name: 'hero',
              label: 'Presentación',
              type: 'group',
              fields: [
                {
                  name: 'title',
                  label: 'Nombre completo',
                  type: 'text',
                  required: true,
                  admin: {
                    description:
                      'Aparece sobre el nombre destacado, por ejemplo: Juan David Conejo Acuña.',
                  },
                },
                {
                  name: 'description',
                  label: 'Presentación profesional',
                  type: 'textarea',
                  localized: true,
                  required: true,
                  admin: {
                    description: 'Resumen visible en la primera pantalla de la web.',
                  },
                },
                {
                  name: 'name',
                  label: 'Nombre corto destacado',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'El texto de mayor tamaño, por ejemplo: Conejo.',
                  },
                },
                {
                  name: 'roles',
                  label: 'Oficios',
                  type: 'array',
                  maxRows: 4,
                  fields: [
                    {
                      name: 'label',
                      label: 'Oficio o rol',
                      type: 'text',
                      localized: true,
                      required: true,
                    },
                  ],
                },
                {
                  name: 'quote',
                  label: 'Manifiesto breve',
                  type: 'textarea',
                  localized: true,
                  required: true,
                },
                {
                  name: 'portrait',
                  label: 'Retrato principal',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'imageCaption',
                  label: 'Información sobre la fotografía',
                  type: 'group',
                  fields: [
                    { name: 'eyebrow', label: 'Contexto', type: 'text', localized: true },
                    {
                      name: 'title',
                      label: 'Título de la fotografía',
                      type: 'text',
                      localized: true,
                    },
                    {
                      name: 'technicalValue',
                      label: 'Dato técnico',
                      type: 'text',
                      admin: { description: 'Ejemplo: 93.5 °C · 9.2 bar.' },
                    },
                  ],
                },
                {
                  name: 'metrics',
                  label: 'Indicadores',
                  type: 'array',
                  maxRows: 4,
                  fields: [
                    { name: 'value', label: 'Cifra o valor', type: 'text', required: true },
                    {
                      name: 'label',
                      label: 'Qué representa',
                      type: 'text',
                      localized: true,
                      required: true,
                    },
                    {
                      name: 'accent',
                      label: 'Mostrar con color destacado',
                      type: 'checkbox',
                      defaultValue: false,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: '02 · Manifiesto',
          fields: [
            {
              name: 'manifesto',
              label: 'Trazabilidad',
              type: 'group',
              fields: [
                {
                  name: 'quote',
                  label: 'Frase principal',
                  type: 'textarea',
                  localized: true,
                  required: true,
                },
                {
                  name: 'principles',
                  label: 'Principios',
                  type: 'array',
                  minRows: 2,
                  maxRows: 2,
                  fields: [
                    {
                      name: 'text',
                      label: 'Texto del principio',
                      type: 'textarea',
                      localized: true,
                      required: true,
                    },
                  ],
                },
                {
                  name: 'facts',
                  label: 'Fichas laterales',
                  type: 'array',
                  maxRows: 3,
                  fields: [
                    {
                      name: 'label',
                      label: 'Categoría',
                      type: 'text',
                      localized: true,
                      required: true,
                    },
                    {
                      name: 'value',
                      label: 'Dato principal',
                      type: 'text',
                      localized: true,
                      required: true,
                    },
                    { name: 'detail', label: 'Detalle adicional', type: 'text', localized: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: '03 · Oficio',
          fields: [
            {
              name: 'craft',
              label: 'Fundamentos técnicos',
              type: 'group',
              fields: [
                ...sectionIntro(),
                {
                  name: 'pillars',
                  label: 'Pilares',
                  type: 'array',
                  minRows: 2,
                  maxRows: 3,
                  fields: [
                    {
                      name: 'eyebrow',
                      label: 'Categoría técnica',
                      type: 'text',
                      localized: true,
                      required: true,
                    },
                    {
                      name: 'badge',
                      label: 'Certificación o experiencia',
                      type: 'text',
                      localized: true,
                    },
                    {
                      name: 'title',
                      label: 'Nombre del pilar',
                      type: 'text',
                      localized: true,
                      required: true,
                    },
                    {
                      name: 'description',
                      label: 'Descripción',
                      type: 'textarea',
                      localized: true,
                      required: true,
                    },
                    { name: 'image', label: 'Imagen', type: 'upload', relationTo: 'media' },
                    {
                      name: 'parameters',
                      label: 'Parámetros',
                      type: 'array',
                      maxRows: 4,
                      fields: [
                        {
                          name: 'label',
                          label: 'Nombre del parámetro',
                          type: 'text',
                          localized: true,
                          required: true,
                        },
                        { name: 'value', label: 'Valor técnico', type: 'text', required: true },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: '04 · Investigación',
          fields: [
            {
              name: 'research',
              label: 'Investigación sensorial',
              type: 'group',
              fields: [
                ...sectionIntro(),
                {
                  name: 'topics',
                  label: 'Líneas de observación',
                  type: 'array',
                  maxRows: 4,
                  fields: [
                    {
                      name: 'icon',
                      label: 'Icono',
                      type: 'select',
                      options: [
                        { label: 'Laboratorio', value: 'flask' },
                        { label: 'Grano de café', value: 'bean' },
                        { label: 'Agua', value: 'droplets' },
                        { label: 'Temperatura', value: 'thermometer' },
                      ],
                      required: true,
                    },
                    { name: 'title', label: 'Tema', type: 'text', localized: true, required: true },
                    {
                      name: 'description',
                      label: 'Explicación',
                      type: 'textarea',
                      localized: true,
                      required: true,
                    },
                  ],
                },
                {
                  name: 'sensoryProfile',
                  label: 'Ficha sensorial',
                  type: 'group',
                  fields: [
                    {
                      name: 'title',
                      label: 'Nombre del lote o muestra',
                      type: 'text',
                      localized: true,
                      required: true,
                    },
                    {
                      name: 'score',
                      label: 'Puntaje',
                      type: 'number',
                      min: 0,
                      max: 100,
                      required: true,
                    },
                    { name: 'flavorNotes', label: 'Notas', type: 'text', localized: true },
                    {
                      name: 'attributes',
                      label: 'Radar sensorial',
                      type: 'array',
                      minRows: 6,
                      maxRows: 6,
                      fields: [
                        {
                          name: 'label',
                          label: 'Atributo sensorial',
                          type: 'text',
                          localized: true,
                          required: true,
                        },
                        {
                          name: 'value',
                          label: 'Puntuación de 0 a 10',
                          type: 'number',
                          min: 0,
                          max: 10,
                          required: true,
                        },
                      ],
                    },
                    {
                      name: 'measurements',
                      label: 'Mediciones',
                      type: 'array',
                      maxRows: 6,
                      fields: [
                        {
                          name: 'label',
                          label: 'Medición',
                          type: 'text',
                          localized: true,
                          required: true,
                        },
                        {
                          name: 'value',
                          label: 'Resultado y unidad',
                          type: 'text',
                          required: true,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: '05–06 · Proyecto',
          fields: [
            {
              name: 'entrepreneurship',
              label: 'Dónde Conejo',
              type: 'group',
              fields: [
                ...sectionIntro(),
                { name: 'quote', label: 'Frase destacada', type: 'textarea', localized: true },
                {
                  name: 'locations',
                  label: 'Sedes destacadas',
                  type: 'relationship',
                  relationTo: 'locations',
                  hasMany: true,
                  maxRows: 4,
                },
              ],
            },
            {
              name: 'community',
              label: 'Comunidad',
              type: 'group',
              fields: [
                ...sectionIntro(),
                {
                  name: 'initiative',
                  label: 'Iniciativa destacada',
                  type: 'group',
                  fields: [
                    { name: 'title', type: 'text', localized: true, required: true },
                    { name: 'description', type: 'textarea', localized: true, required: true },
                  ],
                },
                {
                  name: 'metrics',
                  label: 'Resultados destacados',
                  type: 'array',
                  maxRows: 4,
                  fields: [
                    { name: 'value', label: 'Cifra o valor', type: 'text', required: true },
                    {
                      name: 'label',
                      label: 'Qué representa',
                      type: 'text',
                      localized: true,
                      required: true,
                    },
                    {
                      name: 'description',
                      label: 'Explicación breve',
                      type: 'textarea',
                      localized: true,
                    },
                  ],
                },
                { name: 'quote', label: 'Frase destacada', type: 'textarea', localized: true },
              ],
            },
          ],
        },
        {
          label: '07–08 · Proyección',
          fields: [
            {
              name: 'journey',
              label: 'Colombia → Francia',
              type: 'group',
              fields: [
                ...sectionIntro(),
                {
                  name: 'chapters',
                  label: 'Etapas',
                  type: 'array',
                  maxRows: 5,
                  fields: [
                    { name: 'period', label: 'Año o periodo', type: 'text', required: true },
                    {
                      name: 'title',
                      label: 'Nombre de la etapa',
                      type: 'text',
                      localized: true,
                      required: true,
                    },
                    {
                      name: 'description',
                      label: 'Resumen de la etapa',
                      type: 'textarea',
                      localized: true,
                      required: true,
                    },
                  ],
                },
              ],
            },
            {
              name: 'contact',
              label: 'Cierre comercial',
              type: 'group',
              fields: [
                ...sectionIntro(),
                {
                  name: 'services',
                  label: 'Servicios destacados',
                  type: 'array',
                  maxRows: 6,
                  fields: [
                    {
                      name: 'label',
                      label: 'Nombre del servicio',
                      type: 'text',
                      localized: true,
                      required: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seo',
              label: 'SEO de Home',
              type: 'group',
              admin: {
                description:
                  'Personaliza cómo aparece Home en buscadores y redes. Los campos vacíos usan la configuración general del sitio.',
              },
              fields: [
                {
                  name: 'metaTitle',
                  label: 'Título SEO',
                  type: 'text',
                  localized: true,
                  maxLength: 60,
                },
                {
                  name: 'metaDescription',
                  label: 'Descripción SEO',
                  type: 'textarea',
                  localized: true,
                  maxLength: 160,
                },
                {
                  name: 'shareImage',
                  label: 'Imagen para compartir',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'indexing',
                  label: 'Indexación',
                  type: 'select',
                  defaultValue: 'inherit',
                  options: [
                    { label: 'Heredar configuración general', value: 'inherit' },
                    { label: 'Permitir indexación', value: 'index' },
                    { label: 'No indexar esta página', value: 'noindex' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ]),
  versions: {
    drafts: {
      autosave: {
        interval: 500,
      },
    },
  },
}
