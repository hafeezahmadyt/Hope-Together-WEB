import { AdminContactMessage } from '../../types/admin';

export const initialMockMessages: AdminContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Sample Inquirer (Demo)',
    email: 'inquirer.demo@example.com',
    phone: '+92 300 1234567',
    subject: 'Partnership Inquiry for Vocational Training',
    message: 'Hello, our community institute is interested in exploring potential alignment with Hope Together Organization regarding youth skills workshops in Khyber Pakhtunkhwa. We look forward to your correspondence.',
    receivedDate: '2026-10-01T14:32:00Z',
    status: 'Unread',
  },
  {
    id: 'msg-2',
    name: 'Sample Volunteer Candidate (Demo)',
    email: 'volunteer.demo@example.com',
    phone: '+92 333 7654321',
    subject: 'Volunteer Application — Environmental Action',
    message: 'I am a university student in environmental sciences and would love to volunteer time for community tree plantation and flood resilience initiatives. Please let me know how I can contribute.',
    receivedDate: '2026-09-29T10:15:00Z',
    status: 'Read',
  },
  {
    id: 'msg-3',
    name: 'Sample Research Partner (Demo)',
    email: 'researcher.demo@example.edu',
    subject: 'Academic Collaboration Inquiry',
    message: 'Greetings. We are preparing a regional study on community-led child rights frameworks and would appreciate learning more about your grassroots methodology.',
    receivedDate: '2026-09-22T08:45:00Z',
    status: 'Archived',
  },
];
