export interface User {
    id: string;
    name: string;
    email: string;
    verified: boolean;
    avatar?: string;
    bio?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  authorId: string;
  author?: User;
  tags: string[];
  likes: number;
  likesCount?: number;
  commentsCount?: number;
  comments?: Comment[];
  createdAt: string;
  updatedAt: string;
  featuredImage?: string;
  readingTime?: number;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface MessageResponse {
    message: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  author?: User;
  postId: string;
  likes: number;
  likesCount?: number;
  createdAt: string;
  updatedAt: string;
  parentId?: string; // for nested comments
  replies?: Comment[];
}

export interface Tag {
  id: string;
  name: string;
  count: number;
  description?: string;
}

export interface PostFilters {
  tag?: string;
  author?: string;
  search?: string;
  sortBy?: 'latest' | 'popular' | 'trending';
  page?: number;
  limit?: number;
}