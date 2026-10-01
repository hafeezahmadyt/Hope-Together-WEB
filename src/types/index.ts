export interface Objective {
  id: string;
  number: string;
  title: string;
  description: string;
  focusAreas: string[];
  accentColor: 'blue' | 'green';
}

export interface Partner {
  id: string;
  name: string;
  logo?: string;
  category?: 'Community Partners' | 'Institutional Partners' | 'Education Partners' | 'Development Partners' | string;
  categorySubtitle?: string;
  description?: string;
  websiteUrl?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  category: 'Leadership' | 'Team' | 'Volunteers';
  image?: string;
  bio?: string;
  socialLinks?: {
    platform: string;
    url: string;
  }[];
}

export interface ValueItem {
  number: string;
  title: string;
  description: string;
}
