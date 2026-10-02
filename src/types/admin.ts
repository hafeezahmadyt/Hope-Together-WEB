export type OfficialObjective =
  | 'Youth Empowerment'
  | 'Women Empowerment & Protection'
  | 'Child Rights & Protection'
  | 'Climate Change & Environmental Action';

export const OFFICIAL_OBJECTIVES: OfficialObjective[] = [
  'Youth Empowerment',
  'Women Empowerment & Protection',
  'Child Rights & Protection',
  'Climate Change & Environmental Action',
];

export type PartnerCategory =
  | 'Community Partners'
  | 'Institutional Partners'
  | 'Education Partners'
  | 'Development Partners';

export const PARTNER_CATEGORIES: PartnerCategory[] = [
  'Community Partners',
  'Institutional Partners',
  'Education Partners',
  'Development Partners',
];

export type ContentStatus = 'Draft' | 'Published' | 'Completed' | 'Archived';
export type MessageStatus = 'Unread' | 'Read' | 'Archived';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'editor';
}

export interface AdminTeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  photoUrl?: string;
  email?: string;
  linkedinUrl?: string;
  facebookUrl?: string;
  displayOrder: number;
  isActive: boolean;
  category: 'Leadership' | 'Team' | 'Volunteers';
}

export interface AdminPartner {
  id: string;
  name: string;
  logoUrl?: string;
  category: PartnerCategory | string;
  categorySubtitle?: string;
  description?: string;
  websiteUrl?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface AdminEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  eventDate: string;
  eventTime?: string;
  location: string;
  coverImageUrl?: string;
  registrationUrl?: string;
  status: ContentStatus;
}

export interface AdminProject {
  id: string;
  title: string;
  slug: string;
  objective: OfficialObjective;
  description: string;
  location: string;
  startDate: string;
  endDate?: string;
  coverImageUrl?: string;
  status: ContentStatus;
}

export interface AdminStory {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  category: string;
  isPublished: boolean;
  publishedDate?: string;
}

export interface AdminContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  receivedDate: string;
  status: MessageStatus;
}

export interface AdminSiteSettings {
  organizationName: string;
  shortDescription: string;
  contactEmail: string;
  phone: string;
  address: string;
  facebookUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  youtubeUrl: string;
}

export interface AdminActivityLog {
  id: string;
  action: string;
  entity: string;
  entityTitle: string;
  timestamp: string;
  user: string;
}
