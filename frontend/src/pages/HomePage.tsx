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

    // Recupero utente
    const userString = localStorage.getItem('user');
    const user: User | null = userString ? JSON.parse(userString) : null;

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchPosts();
    }, [user, navigate, selectedTag]); // Ricarica quando cambia il tag!

    const fetchPosts = async () => {
        setLoading(true);
        try {
            let data;
            if (selectedTag) {
                // Se c'è un filtro, chiediamo solo quelli (o filtriamo lato client se backend non pronto)
                // data = await api.getPostsByTag(selectedTag);

                // BACKUP LOGICA CLIENT-SIDE (se non hai ancora la route backend specifica):
                const allPosts = await api.getFeed();
                data = allPosts.filter((p: Post) => p.tags.some(t => t.name === selectedTag));
            } else {
                data = await api.getFeed();
            }
            setPosts(data);
        } catch (error) {
            console.error("Errore fetch:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
            <Navbar user={user} />

            <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
                {/* REQUISITO: Comunicazione tra componenti fratelli (tramite il padre HomePage) */}
                <FilterBar selectedTag={selectedTag} onSelectTag={setSelectedTag} />

                <div style={{ marginTop: '20px' }}>
                    {loading ? (
                        <p style={{textAlign: 'center'}}>Caricamento...</p>
                    ) : posts.length === 0 ? (
                        <p style={{textAlign: 'center', color: '#666'}}>Nessun post trovato.</p>
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