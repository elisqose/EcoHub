const API_URL = 'http://localhost:8080/api';

async function request(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`Errore API: ${response.statusText}`);
    }

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

    getUserPosts: (userId: number) => request(`/posts/user/${userId}`),

    createPost: (post: any, userId: number, tags: string[]) =>
        request(`/posts?userId=${userId}&tags=${tags.join(',')}`, {
            method: 'POST',
            body: JSON.stringify(post)
        }),

    // COMMENTI & SUPPORT
    addComment: async (postId: number, userId: number, text: string) => {
        const response = await fetch(`${API_URL}/posts/${postId}/comments?userId=${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: text
        });
        if (!response.ok) throw new Error('Errore commento');
        return response.json();
    },

    addSupport: async (postId: number, userId: number) => {
        await fetch(`${API_URL}/posts/${postId}/support?userId=${userId}`, { method: 'POST' });
        return true;
    },

    // MESSAGGI (NUOVA SEZIONE AGGIUNTA)
    getReceivedMessages: (userId: number) =>
        request(`/messages/received/${userId}`),

    sendMessage: (senderId: number, receiverId: number, content: string) =>
        request('/messages/send', {
            method: 'POST',
            body: JSON.stringify({ senderId, receiverId, content })
        }),

    // UTENTI
    getUserProfile: (id: number) => request(`/users/${id}`),

    follow: (followerId: number, followedId: number) =>
        request(`/users/${followedId}/follow?followerId=${followerId}`, {
            method: 'POST'
        }),

    // MODERAZIONE
    getPendingPosts: () => request('/moderation/pending'),
};