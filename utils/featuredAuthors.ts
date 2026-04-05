export interface FeaturedAuthor {
  id: number;
  name: string;
  role: string;
  followers: string;
}

export const FEATURED_AUTHORS: FeaturedAuthor[] = [
  { id: 1, name: 'Sarah Johnson', role: 'Tech Lead at Google', followers: '12.5K' },
  { id: 2, name: 'Michael Chen', role: 'AI Researcher', followers: '8.2K' },
  { id: 3, name: 'Emma Wilson', role: 'Startup Founder', followers: '15K' },
  { id: 4, name: 'David Kumar', role: 'Cloud Architect', followers: '6.8K' },
];
