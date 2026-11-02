import { AdminEvent } from '../../types/admin';

export const initialMockEvents: AdminEvent[] = [
  {
    id: 'event-1793657382629',
    title: 'Team Orientation',
    slug: 'team-orientation',
    description:
      "Hope Together Organization held an orientation session to welcome its new team members and introduce them to the organization's vision, mission, values, and objectives. The session provided an opportunity to discuss the organization's goals, responsibilities, and commitment to community development, youth empowerment, and social inclusion. A formal oath-taking ceremony was also conducted, during which all team members pledged to uphold the organization's values, fulfill their responsibilities with honesty and dedication, and work collectively towards creating positive and lasting change in society.",
    eventDate: '2025-12-19',
    eventTime: '10:00 AM - 01:00 PM',
    location: 'Khyber Pakhtunkhwa',
    coverImageUrl: '/assets/events/team-orientation-1.jpg',
    images: [
      '/assets/events/team-orientation-1.jpg',
      '/assets/events/team-orientation-2.jpg',
      '/assets/events/team-orientation-3.jpg',
      '/assets/events/team-orientation-4.jpg',
      '/assets/events/team-orientation-5.jpg',
    ],
    registrationUrl: '',
    status: 'Published',
  },
];
