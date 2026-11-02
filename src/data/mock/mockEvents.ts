import { AdminEvent } from '../../types/admin';

export const initialMockEvents: AdminEvent[] = [
  {
    id: 'event-2',
    title: 'Sample Women Digital Literacy Seminar',
    slug: 'sample-women-digital-literacy-seminar',
    description: 'An educational workshop introducing foundational digital safety and online tools for local women.',
    eventDate: '2026-12-05',
    eventTime: '11:00 AM - 03:00 PM',
    location: 'Peshawar Training Center (Demo)',
    coverImageUrl: '/assets/hero-bg.jpg',
    images: ['/assets/hero-bg.jpg'],
    registrationUrl: 'https://example.org/register/digital',
    status: 'Published',
  },
  {
    id: 'event-3',
    title: 'Draft Ecological Tree Planting Drive',
    slug: 'draft-ecological-tree-planting-drive',
    description: 'Planning session for grassroots youth volunteer tree plantation in flood-resilient zones.',
    eventDate: '2027-01-20',
    eventTime: '09:00 AM - 01:00 PM',
    location: 'District Green Belt (Demo)',
    coverImageUrl: '/assets/hero-bg.jpg',
    images: ['/assets/hero-bg.jpg'],
    status: 'Draft',
  },
];
