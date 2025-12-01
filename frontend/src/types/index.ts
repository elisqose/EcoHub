export interface User {
    id: number;
    username: string;
    email: string;
    role: 'STANDARD' | 'MODERATOR';
    bio?: string;
    profilePicture?: string;
    followers?: User[];
    following?: User[];
}

// 1. Aggiungi questa nuova interfaccia
export interface Support {
    id: number;
    user: User;
}

export interface Tag {
    id: number;
    name: string;
}

export interface Comment {
    id: number;
    text: string;
    creationDate: string;
    author: User;
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

    // 2. Aggiungi questa riga fondamentale!
    supports: Support[];
}

export interface Message {
    id: number;
    content: string;
    timestamp: string;
    sender: User;   // Il backend restituisce l'intero oggetto User
    receiver: User; // Il backend restituisce l'intero oggetto User
}