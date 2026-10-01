import { Objective } from '../types';

export const objectivesData: Objective[] = [
  {
    id: 'youth-empowerment',
    number: '01',
    title: 'Youth Empowerment',
    description:
      'Fostering the next generation of leaders by equipping young minds with the essential tools, skills, and values needed to thrive in a dynamic world.',
    focusAreas: [
      'Civic Education & Responsible Citizenship',
      'Vocational & Technical Training',
      'Leadership & Professional Development',
    ],
    accentColor: 'blue',
  },
  {
    id: 'women-empowerment',
    number: '02',
    title: 'Women Empowerment & Protection',
    description:
      "Championing gender equity, dignity, and autonomy by advancing women's social, legal, and financial independence across communities.",
    focusAreas: [
      'Legal Awareness & Rights Advocacy',
      'Digital Literacy & Online Safety',
      'Economic Independence',
      'Safe Environments & Anti-Harassment',
    ],
    accentColor: 'green',
  },
  {
    id: 'child-rights',
    number: '03',
    title: 'Child Rights & Protection',
    description:
      'Safeguarding vulnerable children and upholding their fundamental rights to safety, health, and education.',
    focusAreas: ['Child Welfare & Mentoring'],
    accentColor: 'blue',
  },
  {
    id: 'climate-action',
    number: '04',
    title: 'Climate Change & Environmental Action',
    description:
      'Building climate-resilient communities through education, grassroots action, and sustainable ecological practices.',
    focusAreas: [
      'Disaster Preparedness & Youth Volunteerism',
      'Environmental Conservation & Sustainability',
    ],
    accentColor: 'green',
  },
];
