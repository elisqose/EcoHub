const API_URL = 'http://localhost:8080/api';

// Funzione generica per le chiamate
async function request(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!response.ok) {
        // Gestione errori semplice
        throw new Error(`Errore API: ${response.statusText}`);
    }

    // Se la risposta è vuota (es. dopo un like), non provare a parsare JSON
    const text = await response.text();
    return text ? JSON.parse(text) : {};
}

export const api = {
    // AUTENTICAZIONE
    login: (username: string, password: string) => 
        request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        }),

    register: (user: any) => 
        request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(user)
        }),

    // POSTS
    getFeed: () => request('/posts'),
    
    createPost: (post: any, userId: number, tags: string[]) => 
        request(`/posts?userId=${userId}&tags=${tags.join(',')}`, {
            method: 'POST',
            body: JSON.stringify(post)
        }),

    // UTENTI
    follow: (followerId: number, followedId: number) => 
        request(`/users/${followedId}/follow?followerId=${followerId}`, {
            method: 'POST'
        })
};