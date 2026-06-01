export interface CommunityLink {
  icon: string;
  title: string;
  description: string;
  href: string;
  cta: string;
}

export const communityLinks: CommunityLink[] = [
  {
    icon: 'DC',
    title: 'Discord',
    description: 'Join the myClawTeam conversation for implementation questions, launch notes, and shared progress.',
    href: 'https://discord.com/',
    cta: 'Join Discord',
  },
  {
    icon: 'X',
    title: 'X (Twitter)',
    description: 'Follow myClawTeam updates, release notes, and product work as new sections ship.',
    href: 'https://x.com/',
    cta: 'Follow on X',
  },
];
