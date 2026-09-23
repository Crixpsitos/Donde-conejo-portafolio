import type { CollectionConfig } from 'payload'

export const Locations: CollectionConfig = {
  slug: 'locations',
  labels: {
    singular: 'Sede',
    plural: 'Sedes',
  },
  admin: {
    group: 'Contenido',
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'city', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'name',
      label: 'Nombre',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'code',
      label: 'Código editorial',
      type: 'text',
      required: true,
    },
    {
      name: 'status',
      label: 'Estado',
      type: 'select',
      defaultValue: 'open',
      options: [
        { label: 'Abierta', value: 'open' },
        { label: 'Próximamente', value: 'coming-soon' },
        { label: 'Cerrada temporalmente', value: 'temporarily-closed' },
      ],
      required: true,
    },
    {
      name: 'description',
      label: 'Descripción',
      type: 'textarea',
      localized: true,
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'city',
          label: 'Ciudad',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'address',
          label: 'Dirección',
          type: 'text',
          localized: true,
        },
      ],
    },
    {
      name: 'schedule',
      label: 'Horario',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'mapUrl',
      label: 'Enlace de mapa',
      type: 'text',
    },
    {
      name: 'image',
      label: 'Imagen',
      type: 'upload',
      relationTo: 'media',
    },
  ],
  versions: {
    drafts: true,
  },
}
