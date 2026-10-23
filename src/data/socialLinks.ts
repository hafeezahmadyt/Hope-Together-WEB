import { Instagram, Linkedin, Facebook } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface SocialLinkItem {
  id: 'facebook' | 'instagram' | 'linkedin';
  name: string;
  url: string;
  handle: string;
  ariaLabel: string;
  icon: LucideIcon;
  hoverClass: string;
  brandColor: string;
}

export const socialLinks: SocialLinkItem[] = [
  {
    id: 'facebook',
    name: 'Facebook',
    url: 'https://www.facebook.com/HopeTogetherKP/',
    handle: 'HopeTogetherKP',
    ariaLabel: 'Follow Hope Together Organization on Facebook',
    icon: Facebook,
    hoverClass: 'hover:text-[#1877F2] hover:bg-blue-50/80 hover:border-blue-200',
    brandColor: '#1877F2',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    url: 'https://www.instagram.com/hopetogetherorganization/',
    handle: '@hopetogetherorganization',
    ariaLabel: 'Follow Hope Together Organization on Instagram',
    icon: Instagram,
    hoverClass: 'hover:text-[#E4405F] hover:bg-rose-50/80 hover:border-rose-200',
    brandColor: '#E4405F',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/company/hope-together-organization/',
    handle: 'Hope Together Organization',
    ariaLabel: 'Connect with Hope Together Organization on LinkedIn',
    icon: Linkedin,
    hoverClass: 'hover:text-[#0A66C2] hover:bg-sky-50/80 hover:border-sky-200',
    brandColor: '#0A66C2',
  },
];
