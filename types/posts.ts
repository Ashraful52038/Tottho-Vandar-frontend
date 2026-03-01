// types/post.ts
export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  authorId: string;
  author?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
  };
  tags: string[];
  featuredImage?: string;
  likes: number;
  likesCount?: number;
  commentsCount?: number;
  readingTime?: number;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  views?: number;
}

export interface CreatePostData {
  title: string;
  content: string;
  tags: string[];
  featuredImage?: string;
  status?: 'draft' | 'published';
}

export interface UpdatePostData extends Partial<CreatePostData> {
  id: string;
}

export interface PostFilters {
  page?: number;
  limit?: number;
  tag?: string;
  author?: string;
  search?: string;
  status?: 'draft' | 'published' | 'all';
  sortBy?: 'latest' | 'popular' | 'trending';
}