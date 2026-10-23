import { TeamMember } from '../types';

/**
 * Team members data structure.
 * Ready for official profiles to be provided by Hope Together Organization leadership.
 * No fake names, stock photos, or fabricated roles are included.
 */
export const teamMembersData: TeamMember[] = [
  // Example structure when populated:
  // {
  //   id: 'leader-1',
  //   name: 'Official Name',
  //   position: 'Designation / Role',
  //   category: 'Leadership',
  //   image: '/assets/team/photo.jpg',
  //   bio: 'Official biography statement.',
  // }
];

export const teamCategories = [
  {
    id: 'Executive Body',
    title: 'Executive Body',
    description: 'Executive committee and governing leadership providing strategic stewardship and organizational direction.',
    placeholderCount: 4,
  },
  {
    id: 'Core Team',
    title: 'Core Team',
    description: 'Dedicated professionals spearheading local initiatives, program operations, and community engagement.',
    placeholderCount: 4,
  },
];
