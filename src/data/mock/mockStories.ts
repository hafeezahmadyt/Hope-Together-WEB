import { AdminStory } from '../../types/admin';

export const initialMockStories: AdminStory[] = [
  {
    id: 'story-1',
    title: 'Sample Field Dispatch: Empowering Youth Through Applied Craft (Demo)',
    slug: 'sample-field-dispatch-empowering-youth',
    excerpt: 'An editorial overview of grassroots vocational learning and peer mentorship sessions conducted this quarter.',
    content: `Community empowerment begins by listening to the aspirations of youth. During our recent exploratory workshops, local participants shared ideas on sustainable livelihood practices and responsible community leadership.\n\nBy uniting traditional values with modern vocational toolsets, Hope Together Organization continues supporting pathways for generational resilience across Khyber Pakhtunkhwa.`,
    category: 'Field Stories',
    isPublished: true,
    publishedDate: '2026-09-20',
  },
  {
    id: 'story-2',
    title: 'Sample Announcement: Environmental Action Coalition Formed (Demo)',
    slug: 'sample-announcement-environmental-action-coalition',
    excerpt: 'Highlighting collaborative efforts between local elders and youth volunteers to strengthen ecological conservation.',
    content: `Climate vulnerability in northern Pakistan necessitates proactive, community-owned solutions. In partnership with local volunteer groups, we have launched preliminary ecological discussions on preserving indigenous water channels and organizing sapling nurseries.\n\nEvery sustainable transition is rooted in shared regional dignity and shared civic stewardship.`,
    category: 'Announcements',
    isPublished: true,
    publishedDate: '2026-09-28',
  },
  {
    id: 'story-3',
    title: 'Draft Article: Community Safety Framework & Child Welfare (Demo)',
    slug: 'draft-article-community-safety-framework',
    excerpt: 'A draft discussion paper on reinforcing localized child protection safety nets.',
    content: `Draft content awaiting review by the governance board before official release.`,
    category: 'Research & Insights',
    isPublished: false,
  },
];
