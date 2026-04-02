export interface Comment {
    id: string;
    content: string;
    author: {
        id: string;
        name: string;
        avatar?: string;
    };
    postId: string;
    parentId?: string;
    replies?: Comment[];
    likes: number;
    isLiked?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCommentData {
    content: string;
    postId: string;
    parentId?: string;
}

export interface UpdateCommentData {
    content: string;
}