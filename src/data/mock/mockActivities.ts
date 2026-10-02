import { AdminActivityLog } from '../../types/admin';

export const initialMockActivities: AdminActivityLog[] = [
  {
    id: 'act-1',
    action: 'published',
    entity: 'Story',
    entityTitle: 'Sample Field Dispatch: Empowering Youth',
    timestamp: '2 hours ago',
    user: 'Admin',
  },
  {
    id: 'act-2',
    action: 'updated',
    entity: 'Project',
    entityTitle: 'Sample Vocational Skill Incubation',
    timestamp: '5 hours ago',
    user: 'Admin',
  },
  {
    id: 'act-3',
    action: 'received',
    entity: 'Message',
    entityTitle: 'Partnership Inquiry for Vocational Training',
    timestamp: 'Yesterday',
    user: 'Public Visitor',
  },
  {
    id: 'act-4',
    action: 'added',
    entity: 'Partner',
    entityTitle: 'Sample Academic Institute',
    timestamp: '2 days ago',
    user: 'Admin',
  },
  {
    id: 'act-5',
    action: 'created',
    entity: 'Event',
    entityTitle: 'Example Community Dialogue & Civic Workshop',
    timestamp: '3 days ago',
    user: 'Admin',
  },
];
