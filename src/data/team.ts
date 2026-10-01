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
    id: 'Leadership',
    title: 'Leadership & Governance',
    description: 'Executive committee and supervisory board providing strategic stewardship.',
    placeholderCount: 3,
  },
  {
    id: 'Team',
    title: 'Core Team & Field Coordinators',
    description: 'Dedicated professionals spearheading local initiatives and community relations.',
    placeholderCount: 3,
  },
  {
    id: 'Volunteers',
    title: 'Community Volunteers & Advocates',
    description: 'Passionate grassroots volunteers driving frontline change across Khyber Pakhtunkhwa.',
    placeholderCount: 4,
  },
];
