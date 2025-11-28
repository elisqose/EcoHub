export interface User {
    id: number;
    username: string;
    email: string;
    role: 'STANDARD' | 'MODERATOR';
    bio?: string;
}

export interface Post {
    id: number;
    title: string;
    content: string;
    imageUrl?: string;
    creationDate: string;
    status: 'PENDING' | 'APPROVED' | 'REQUIRES_CHANGES' | 'REJECTED';
    moderatorNote?: string;
    author: User;
    comments: Comment[];
    tags: Tag[];
}

export interface Comment {
    id: number;
    text: string;
    creationDate: string;
    author: User;
}

export interface Tag {
    id: number;
    name: string;
}