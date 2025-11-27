// Definisce l'Utente
export interface User {
    id: number;
    username: string;
    email: string;
    role: 'STANDARD' | 'MODERATOR';
    bio?: string;
}

// Definisce un Post
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
    // Per semplicità nel frontend, i like li gestiamo come numero o booleano se serve
}

// Definisce un Commento
export interface Comment {
    id: number;
    text: string;
    creationDate: string;
    author: User;
}

// Definisce un Tag
export interface Tag {
    id: number;
    name: string;
}