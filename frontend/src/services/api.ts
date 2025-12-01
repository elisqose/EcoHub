const API_URL = 'http://localhost:8080/api';

async function request(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            // Default è JSON, ma può essere sovrascritto da options.headers
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`Errore API: ${response.statusText}`);
    }

    // Gestiamo il caso in cui la risposta sia vuota (es. dopo un delete o un put senza ritorno)
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

    updatePost: (postId: number, userId: number, postData: any) =>
        request(`/posts/${postId}?userId=${userId}`, {
            method: 'PUT',
            body: JSON.stringify(postData)
        }),

    deletePost: (postId: number, userId: number) =>
        request(`/posts/${postId}?userId=${userId}`, {
            method: 'DELETE'
        }),

    // TAGS (Nuovo metodo aggiunto per la FilterBar)
    getTags: () => request('/tags'),

    // COMMENTI & SUPPORT
    addComment: async (postId: number, userId: number, text: string) => {
        // Qui usiamo fetch diretto o request forzando l'header text/plain
        return request(`/posts/${postId}/comments?userId=${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: text
        });
    },

    addSupport: async (postId: number, userId: number) => {
        return request(`/posts/${postId}/support?userId=${userId}`, { method: 'POST' });
    },

    // MESSAGGI
    getReceivedMessages: (userId: number) =>
        request(`/messages/received/${userId}`),

    // --- MODIFICA QUI: receiverId (number) diventa receiverUsername (string) ---
    sendMessage: (senderId: number, receiverUsername: string, content: string) =>
        request('/messages/send', {
            method: 'POST',
            body: JSON.stringify({ senderId, receiverUsername, content })
        }),

    // UTENTI
    getUserProfile: (id: number) => request(`/users/${id}`),

    updateProfilePicture: (userId: number, base64Image: string) =>
        request(`/users/${userId}/picture`, {
            method: 'PUT',
            headers: { 'Content-Type': 'text/plain' }, // Importante per mandare la stringa raw
            body: base64Image
        }),

    searchUsers: (query: string) => request(`/users/search?query=${query}`),

    follow: (followerId: number, followedId: number) =>
        request(`/users/${followedId}/follow?followerId=${followerId}`, {
            method: 'POST'
        }),

    // MODERAZIONE
    getPendingPosts: () => request('/moderation/pending'),

    approvePost: (id: number) =>
        request(`/moderation/posts/${id}/approve`, {
            method: 'PUT'
        }),

    rejectPost: (id: number) =>
        request(`/moderation/posts/${id}`, {
            method: 'DELETE'
        }),

    requestChanges: (id: number, note: string) =>
        request(`/moderation/posts/${id}/request-changes`, {
            method: 'PUT',
            headers: { 'Content-Type': 'text/plain' }, // Sovrascrive il JSON di default
            body: note
        }),
};