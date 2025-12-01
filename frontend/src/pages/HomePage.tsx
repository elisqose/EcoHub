import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import FilterBar from '../components/FilterBar';
import { api } from '../services/api';
import type { Post, User } from '../types';

export default function HomePage() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<Post[]>([]);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const [user] = useState<User | null>(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchPosts();
    }, [selectedTag, navigate]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const allPosts = await api.getFeed();

            if (selectedTag) {
                const filtered = allPosts.filter((p: Post) => p.tags.some(t => t.name === selectedTag));
                setPosts(filtered);
            } else {
                setPosts(allPosts);
            }
        } catch (error) {
            console.error("Errore fetch:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        // NOTA: Qui NON c'è fontFamily: 'Arial...', quindi usa il font di default (Times New Roman)
        <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
            <Navbar user={user} />

            <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
                <div style={{ marginBottom: '20px' }}>
                    {/* --- MODIFICA QUI: Aggiunto textTransform: 'capitalize' --- */}
                    <h1 style={{ color: '#2e7d32', marginBottom: '5px', textTransform: 'capitalize' }}>
                        Ciao, {user.username}! 👋
                    </h1>
                    <p style={{ color: '#666' }}>Ecco cosa succede nella community EcoHub oggi.</p>
                </div>

                <FilterBar selectedTag={selectedTag} onSelectTag={setSelectedTag} />

                <div style={{ marginTop: '20px' }}>
                    {loading ? (
                        <p style={{textAlign: 'center', color: '#888'}}>Caricamento feed in corso...</p>
                    ) : posts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#666', backgroundColor: 'white', borderRadius: '8px' }}>
                            <h3>Nessun post trovato 🌱</h3>
                            <p>Non ci sono ancora post. Sii il primo a scriverne uno!</p>
                        </div>
                    ) : (
                        posts.map(post => (
                            <PostCard key={post.id} post={post} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}