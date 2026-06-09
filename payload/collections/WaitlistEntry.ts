import type { CollectionConfig } from 'payload'

export const WaitlistEntry: CollectionConfig = {
  slug: 'waitlist-entries',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'source', 'subscribed', 'createdAt'],
    group: 'Operations',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,     // server action creates entries without an admin session
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'source',
      type: 'text',
      defaultValue: 'website-waitlist',
      admin: {
        description: 'Origin of this signup — used for segmentation in Loops.',
      },
    },
    {
      name: 'subscribed',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Mirrors the subscriber status in Loops. Uncheck to suppress future sends.',
      },
    },
  ],
  timestamps: true,
}
