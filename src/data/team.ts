import { TeamMember } from '../types';

/**
 * Team members default dataset.
 * Populated dynamically through the Admin Portal (/admin/team).
 */
export const teamMembersData: TeamMember[] = [];

export const teamCategories = [
  {
    id: 'Core Team',
    title: 'Core Team',
    description: 'Dedicated professionals spearheading local initiatives, program operations, and community engagement.',
    placeholderCount: 4,
  },
  {
    id: 'Executive Body',
    title: 'Executive Body',
    description: 'Executive committee and governing leadership providing strategic stewardship and organizational direction.',
    placeholderCount: 4,
  },
];
