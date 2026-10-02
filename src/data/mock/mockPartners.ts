import { AdminPartner } from '../../types/admin';

export const initialMockPartners: AdminPartner[] = [
  {
    id: 'partner-1',
    name: 'Sample Community Foundation',
    category: 'Community Partners',
    categorySubtitle: '[Grassroots Network]',
    description: 'Sample community alliance supporting grassroots awareness and youth engagement.',
    websiteUrl: 'https://example.org',
    displayOrder: 1,
    isActive: true,
  },
  {
    id: 'partner-2',
    name: 'Sample Academic Institute',
    category: 'Education Partners',
    categorySubtitle: '[Higher Education Alliance]',
    description: 'Sample university partnership for vocational curriculum guidance and digital training.',
    websiteUrl: 'https://example.edu',
    displayOrder: 2,
    isActive: true,
  },
  {
    id: 'partner-3',
    name: 'Sample Regional Development Council',
    category: 'Institutional Partners',
    categorySubtitle: '[Civic Coalition]',
    description: 'Sample regional coalition collaborating on disaster preparedness protocols.',
    websiteUrl: 'https://example.gov.local',
    displayOrder: 3,
    isActive: true,
  },
  {
    id: 'partner-4',
    name: 'Sample Environmental Action Trust',
    category: 'Development Partners',
    categorySubtitle: '[Ecological Coalition]',
    description: 'Sample civil society partner focused on climate resilience and eco-restoration.',
    websiteUrl: 'https://example.org/eco',
    displayOrder: 4,
    isActive: false,
  },
];
