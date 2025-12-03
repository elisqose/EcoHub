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
        const errorText = await response.text();
        throw new Error(errorText || `Errore API: ${response.statusText}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
}

export const api = {
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

    updateBio: (userId: number, bio: string) =>
        request(`/users/${userId}/bio`, {
            method: 'PUT',
            headers: { 'Content-Type': 'text/plain' },
            body: bio
        }),

    unfollow: (followerId: number, followedId: number) =>
        request(`/users/${followedId}/follow?followerId=${followerId}`, {
            method: 'DELETE'
        }),

    removeFollower: (userId: number, followerId: number) =>
        request(`/users/${userId}/follower?followerId=${followerId}`, {
            method: 'DELETE'
        }),

    getTags: () => request('/tags'),

    addComment: async (postId: number, userId: number, text: string) => {
        return request(`/posts/${postId}/comments?userId=${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: text
        });
    },

    deleteComment: async (postId: number, commentId: number, userId: number) => {
        return request(`/posts/${postId}/comments/${commentId}?userId=${userId}`, {
            method: 'DELETE'
        });
    },

    addSupport: async (postId: number, userId: number) => {
        return request(`/posts/${postId}/support?userId=${userId}`, { method: 'POST' });
    },

    getReceivedMessages: (userId: number) =>
        request(`/messages/received/${userId}`),

    getSentMessages: (userId: number) =>
        request(`/messages/sent/${userId}`),

    sendMessage: (senderId: number, receiverUsername: string, content: string) =>
        request('/messages/send', {
            method: 'POST',
            body: JSON.stringify({ senderId, receiverUsername, content })
        }),

    deleteMessage: (messageId: number) =>
        request(`/messages/${messageId}`, { method: 'DELETE' }),

    getUserProfile: (id: number) => request(`/users/${id}`),

    updateProfilePicture: (userId: number, base64Image: string) =>
        request(`/users/${userId}/picture`, {
            method: 'PUT',
            headers: { 'Content-Type': 'text/plain' },
            body: base64Image
        }),

    searchUsers: (query: string) => request(`/users/search?query=${query}`),

    follow: (followerId: number, followedId: number) =>
        request(`/users/${followedId}/follow?followerId=${followerId}`, {
            method: 'POST'
        }),

    requestModeration: (username: string, motivation: string) =>
        request('/users/request-moderation', {
            method: 'POST',
            body: JSON.stringify({ username, motivation })
        }),

    promoteUser: (username: string) =>
        request(`/users/promote/${username}`, { method: 'POST' }),

    rejectUser: (username: string) =>
        request(`/users/reject-moderation/${username}`, { method: 'POST' }),

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
            headers: { 'Content-Type': 'text/plain' },
            body: note
        }),
};