import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Configuración del sitio',
  admin: {
    group: 'Configuración',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            {
              name: 'siteName',
              label: 'Nombre del sitio',
              type: 'text',
              required: true,
            },
            {
              name: 'siteUrl',
              label: 'URL del sitio',
              type: 'text',
              required: true,
              admin: {
                description: 'URL pública sin barra final, por ejemplo https://example.com',
              },
            },
            {
              name: 'contact',
              label: 'Contacto',
              type: 'group',
              fields: [
                { name: 'email', label: 'Correo', type: 'email' },
                { name: 'location', label: 'Ubicación', type: 'text', localized: true },
              ],
            },
            {
              name: 'socialLinks',
              label: 'Canales',
              type: 'array',
              fields: [
                {
                  name: 'platform',
                  label: 'Canal',
                  type: 'select',
                  options: ['instagram', 'whatsapp', 'linkedin'],
                  required: true,
                },
                { name: 'label', label: 'Usuario o texto', type: 'text', required: true },
                { name: 'url', label: 'URL', type: 'text', required: true },
              ],
            },
            {
              name: 'footer',
              label: 'Pie de página',
              type: 'group',
              fields: [
                { name: 'descriptor', label: 'Descripción', type: 'textarea', localized: true },
                { name: 'quote', label: 'Cita', type: 'text', localized: true },
                { name: 'legal', label: 'Texto legal', type: 'text', localized: true },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'titleTemplate',
              label: 'Plantilla del título',
              type: 'text',
              localized: true,
              defaultValue: '%s | Nombre del sitio',
              admin: {
                description: 'Usa %s donde debe aparecer el título de cada página.',
              },
            },
            {
              name: 'defaultMetaTitle',
              label: 'Título SEO predeterminado',
              type: 'text',
              localized: true,
              maxLength: 60,
              required: true,
            },
            {
              name: 'defaultMetaDescription',
              label: 'Descripción SEO predeterminada',
              type: 'textarea',
              localized: true,
              maxLength: 160,
              required: true,
            },
            {
              name: 'defaultShareImage',
              label: 'Imagen social predeterminada',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'allowIndexing',
              label: 'Permitir indexación',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Desactívalo para indicar noindex y nofollow desde el frontend.',
              },
            },
          ],
        },
      ],
    },
  ],
}
