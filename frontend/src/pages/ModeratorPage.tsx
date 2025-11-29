import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import type { Post, User } from '../types';

export default function ModeratorPage() {
    const [pendingPosts, setPendingPosts] = useState<Post[]>([]);

    const userString = localStorage.getItem('user');
    const user: User | null = userString ? JSON.parse(userString) : null;

    useEffect(() => {
        loadPending();
    }, []);

    const loadPending = async () => {
        try {
            // Nota: devi aggiungere questa funzione in api.ts! (Vedi sotto)
            const response = await fetch('http://localhost:8080/api/moderation/pending');
            const data = await response.json();
            setPendingPosts(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleApprove = async (id: number) => {
        await fetch(`http://localhost:8080/api/moderation/posts/${id}/approve`, { method: 'PUT' });
        loadPending(); // Ricarica la lista
    };

    const handleReject = async (id: number) => {
        await fetch(`http://localhost:8080/api/moderation/posts/${id}`, { method: 'DELETE' });
        loadPending();
    };

    if (!user || user.role !== 'MODERATOR') {
        return <h2 style={{textAlign:'center', marginTop:'50px'}}>⛔ Accesso Negato. Solo per Moderatori.</h2>;
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#fff3e0' }}>
            <Navbar user={user} />
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
                <h1 style={{ color: '#e65100' }}>🛡️ Dashboard Moderazione</h1>
                <p>Ci sono {pendingPosts.length} post in attesa di approvazione.</p>

                <div style={{ marginTop: '20px' }}>
                    {pendingPosts.length === 0 ? (
                        <p>Tutto pulito! Nessun post da revisionare.</p>
                    ) : (
                        pendingPosts.map(post => (
                            <PostCard
                                key={post.id}
                                post={post}
                                showActions={true}
                                onApprove={handleApprove}
                                onReject={handleReject}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}