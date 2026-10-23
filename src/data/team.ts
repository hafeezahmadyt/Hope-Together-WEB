import { TeamMember } from '../types';

/**
 * Official team members data extracted from Hope Together Organization (@hopetogetherorganization)
 * and verified community channels across Khyber Pakhtunkhwa.
 */
export const teamMembersData: TeamMember[] = [
  // --- Executive Body ---
  {
    id: 'hafeez-ahmad',
    name: 'Hafeez Ahmad',
    position: 'Vice President',
    category: 'Executive Body',
    bio: 'Executive leadership and strategic stewardship for Hope Together Organization, spearheading institutional partnerships, collaborative MoUs, and youth empowerment initiatives across Khyber Pakhtunkhwa.',
    socialLinks: [
      {
        platform: 'instagram',
        url: 'https://www.instagram.com/hopetogetherorganization/',
      },
      {
        platform: 'facebook',
        url: 'https://www.facebook.com/HopeTogetherKP/',
      },
    ],
  },
  {
    id: 'maheen-kamran',
    name: 'Maheen Kamran',
    position: 'General Secretary',
    category: 'Executive Body',
    image: '/assets/team/maheen-kamran.jpg',
    bio: 'A gold medalist in Peace and Conflict Studies, dedicated to advancing peace, social cohesion, and human rights through conflict resolution, diplomacy, and community stewardship.',
    socialLinks: [
      {
        platform: 'instagram',
        url: 'https://www.instagram.com/p/DShz8wliAes/',
      },
    ],
  },
  {
    id: 'mehnaz-javed',
    name: 'Mehnaz Javed',
    position: 'Executive Director',
    category: 'Executive Body',
    bio: 'Provides strategic guidance on peacebuilding, public health awareness, youth leadership, and non-profit collaborations across regional community networks.',
    socialLinks: [
      {
        platform: 'instagram',
        url: 'https://www.instagram.com/hopetogetherorganization/',
      },
    ],
  },
  {
    id: 'jibran-shah',
    name: 'Jibran Shah',
    position: 'President / Regional Affairs',
    category: 'Executive Body',
    bio: 'Leads community welfare projects and regional stakeholder outreach, coordinating vital development programs including clean water and youth infrastructure across Charsadda and KP.',
    socialLinks: [
      {
        platform: 'facebook',
        url: 'https://www.facebook.com/HopeTogetherKP/',
      },
    ],
  },

  // --- Core Team ---
  {
    id: 'afeefa-akram',
    name: 'Afeefa Akram',
    position: 'Director Women Forum',
    category: 'Core Team',
    image: '/assets/team/afeefa-akram.jpg',
    bio: 'A passionate law student deeply committed to women’s education, climate change advocacy, and social welfare. Experienced with UNICEF initiatives addressing child marriage and promoting girls’ education.',
    socialLinks: [
      {
        platform: 'instagram',
        url: 'https://www.instagram.com/p/DTlGbvpDNpY/',
      },
    ],
  },
  {
    id: 'umar-farooq',
    name: 'Umar Farooq',
    position: 'Director Programs',
    category: 'Core Team',
    bio: 'Directs grassroots program execution, educational workshops, youth capacity-building camps, and community outreach operations.',
    socialLinks: [
      {
        platform: 'instagram',
        url: 'https://www.instagram.com/hopetogetherorganization/',
      },
    ],
  },
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
