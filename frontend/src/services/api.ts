const API_URL = 'http://localhost:8080/api';

// Funzione generica per le chiamate
async function request(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json', // Default
            ...options?.headers, // Qui avviene la sovrascrittura se passi headers specifici
        },
    });

    if (!response.ok) {
        throw new Error(`Errore API: ${response.statusText}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
}

export const api = {
    // --- AUTENTICAZIONE ---
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

    // --- POSTS ---
    getFeed: () => request('/posts'),

    getPostsByTag: (tagName: string) => request(`/posts?tag=${tagName}`),

    createPost: (post: any, userId: number, tags: string[]) =>
        request(`/posts?userId=${userId}&tags=${tags.join(',')}`, {
            method: 'POST',
            body: JSON.stringify(post)
        }),

    // QUESTA È LA VERSIONE CORRETTA E UNIFICATA
    addComment: (postId: number, userId: number, text: string) =>
        request(`/posts/${postId}/comments?userId=${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain' // <--- Sovrascriviamo il tipo per mandare testo puro
            },
            body: text // Non usiamo JSON.stringify perché il backend vuole una String pura
        }),

    // --- UTENTI & INTERAZIONI ---
    follow: (followerId: number, followedId: number) =>
        request(`/users/${followedId}/follow?followerId=${followerId}`, {
            method: 'POST'
        }),

    supportPost: (postId: number, userId: number) =>
        request(`/posts/${postId}/support?userId=${userId}`, {
            method: 'POST'
        }),

    getTags: () => request('/tags'), API_URL,

    addSupport: async (postId: number, userId: number) => {
        const response = await fetch(`http://localhost:8080/api/posts/${postId}/support?userId=${userId}`, {
            method: 'POST'
        });
        if (!response.ok) throw new Error('Errore durante il supporto');
        // L'endpoint ritorna void (200 OK), quindi non facciamo response.json()
        return true;
    },
};