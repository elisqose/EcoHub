// Definizione dell'Utente
export interface User {
    id: number;
    username: string;
    email?: string;
    bio?: string;
    role: 'STANDARD' | 'MODERATOR';
}

// Definizione del Tag
export interface Tag {
    id: number;
    name: string;
}

// Definizione del Post
export interface Post {
    id: number;
    title: string;
    content: string;
    imageUrl?: string;
    creationDate: string;
    status: 'PENDING' | 'APPROVED' | 'REQUIRES_CHANGES' | 'REJECTED';
    moderatorNote?: string;
    author: User;
    tags: Tag[];
}

// Definizione del Commento
export interface Comment {
    id: number;
    text: string;
    creationDate: string;
    author: User;
}