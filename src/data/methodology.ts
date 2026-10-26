export interface MethodologyItem {
  id: string;
  number: string;
  title: string;
  description: string;
  tag: string;
}

export const methodologyItems: MethodologyItem[] = [
  {
    id: 'advocacy-awareness',
    number: '01',
    title: 'Advocacy & Community Awareness',
    tag: 'Rights & Protection',
    description:
      'Conducting community based advocacy and awareness sessions on marital rights, legal protections, workplace harassment, domestic violence, and child protection.',
  },
  {
    id: 'capacity-building',
    number: '02',
    title: 'Capacity Building & Skill Development',
    tag: 'Empowerment & Skills',
    description:
      'Imparting vocational and technical training, entrepreneurship development, and leadership mentoring for youth, alongside digital literacy and cyber safety guidance for women and girls.',
  },
  {
    id: 'volunteerism-disaster',
    number: '03',
    title: 'Community Volunteerism & Disaster Preparedness',
    tag: 'Resilience & Action',
    description:
      'Mobilizing youth through volunteerism training sessions and raising community awareness on disaster management and emergency preparedness.',
  },
  {
    id: 'research-environment',
    number: '04',
    title: 'Research & Environmental Mitigation',
    tag: 'Climate & Sustainability',
    description:
      'Promoting climate change mitigation and environmental protection through research, community engagement, and sustainable development initiatives.',
  },
  {
    id: 'governance-oversight',
    number: '05',
    title: 'Expert Guided & Democratic Governance',
    tag: 'Stewardship & Transparency',
    description:
      'Utilizing an Expert Advisory Committee spanning law, health, education, and gender expertise to provide technical guidance, while keeping overall strategy accountable to the General Body and Executive Committee.',
  },
];
