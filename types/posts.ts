import { User } from "./user";

export interface Post {
    id: string | number;
    title: string;
    content: string;
    excerpt?: string;
    authorId?: string | number;
    author?: {
        id: string | number;
        name: string;
        email?: string;
        avatar?: string | null;
    } | User;
    tags: string[] | any[];
    featuredImage?: string | null;
    coverImage?: string | null;
    likes?: number;
    likesCount?: number;
    comments?: number;
    commentsCount?: number;
    readingTime?: number;
    published?: boolean;
    status?: 'draft' | 'published';
    createdAt: string;
    updatedAt: string;
    isLiked?: boolean;
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
  tagIds?: string;
  author?: string;
  search?: string;
  status?: 'draft' | 'published' | 'all';
  sortBy?: 'latest' | 'popular' | 'trending';
}

