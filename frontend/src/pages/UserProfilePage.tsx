import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import { api } from '../services/api';
import type { User, Post } from '../types';

export default function UserProfilePage() {
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    // Utente loggato (da localStorage)
    const storedUser = localStorage.getItem('user');
    const currentUser: User | null = storedUser ? JSON.parse(storedUser) : null;

    useEffect(() => {
        if (currentUser) {
            loadProfileData();
        }
    }, []);

    const loadProfileData = async () => {
        if (!currentUser) return;
        try {
            // 1. Carica dati freschi utente (per avere following/followers aggiornati)
            const userData = await api.getUserProfile(currentUser.id);
            setProfileUser(userData);

            // 2. Carica i post dell'utente
            const userPosts = await api.getUserPosts(currentUser.id);
            setPosts(userPosts);
        } catch (error) {
            console.error("Errore caricamento profilo:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser) return <p>Devi loggarti.</p>;
    if (loading) return <p style={{textAlign:'center', marginTop: '20px'}}>Caricamento profilo...</p>;

    // Filtriamo i post
    const approvedPosts = posts.filter(p => p.status === 'APPROVED');
    const pendingPosts = posts.filter(p => p.status === 'PENDING' || p.status === 'REQUIRES_CHANGES');
    const rejectedPosts = posts.filter(p => p.status === 'REJECTED');

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
            <Navbar user={currentUser} />

            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
                {/* HEADER PROFILO */}
                <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#2e7d32', color: 'white', fontSize: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto' }}>
                        {profileUser?.username.charAt(0).toUpperCase()}
                    </div>
                    <h1 style={{ margin: '0 0 5px 0' }}>@{profileUser?.username}</h1>
                    <p style={{ color: '#666', fontStyle: 'italic' }}>{profileUser?.bio || "Nessuna biografia inserita."}</p>
                    <p style={{ fontSize: '14px', color: '#888' }}>{profileUser?.email}</p>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '20px' }}>
                        <div>
                            <strong style={{ display: 'block', fontSize: '20px' }}>{posts.length}</strong>
                            <span style={{ color: '#666', fontSize: '14px' }}>Posts</span>
                        </div>
                        {/* Nota: per following/followers serve che il backend serializzi le liste.
                            Se vedi 0, verifica che non ci sia @JsonIgnore sulle liste in User.java */}
                        <div>
                            <strong style={{ display: 'block', fontSize: '20px' }}>0</strong>
                            <span style={{ color: '#666', fontSize: '14px' }}>Followers</span>
                        </div>
                        <div>
                            <strong style={{ display: 'block', fontSize: '20px' }}>0</strong>
                            <span style={{ color: '#666', fontSize: '14px' }}>Following</span>
                        </div>
                    </div>
                </div>

                {/* SEZIONE POST IN CORSO (Visibile solo a me) */}
                {pendingPosts.length > 0 && (
                    <div style={{ marginBottom: '30px' }}>
                        <h3 style={{ color: '#f57c00', borderBottom: '2px solid #f57c00', paddingBottom: '10px' }}>⚠️ I tuoi post in attesa / Da rivedere</h3>
                        {pendingPosts.map(post => (
                            <div key={post.id} style={{ opacity: 0.9 }}>
                                {/* Se richiede modifiche, mostriamo un avviso */}
                                {post.status === 'REQUIRES_CHANGES' && (
                                    <div style={{ backgroundColor: '#fff3e0', padding: '10px', borderRadius: '4px', marginBottom: '10px', border: '1px solid #ffb74d', color: '#e65100' }}>
                                        <strong>Il moderatore dice:</strong> "{post.moderatorNote}" <br/>
                                        <small>(Funzionalità di modifica non ancora implementata, per ora cancella e rifai)</small>
                                    </div>
                                )}
                                <PostCard post={post} />
                            </div>
                        ))}
                    </div>
                )}

                {/* SEZIONE POST RIFIUTATI */}
                {rejectedPosts.length > 0 && (
                    <div style={{ marginBottom: '30px' }}>
                        <h3 style={{ color: '#d32f2f', borderBottom: '2px solid #d32f2f', paddingBottom: '10px' }}>❌ Post Rifiutati</h3>
                        {rejectedPosts.map(post => (
                            <div key={post.id} style={{ opacity: 0.6, pointerEvents: 'none' }}>
                                <PostCard post={post} />
                                <p style={{ color: 'red', fontWeight: 'bold' }}>Motivo: {post.moderatorNote}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* SEZIONE POST APPROVATI */}
                <div>
                    <h3 style={{ color: '#2e7d32', borderBottom: '2px solid #2e7d32', paddingBottom: '10px' }}>✅ I tuoi post pubblicati</h3>
                    {approvedPosts.length === 0 ? (
                        <p style={{ color: '#888', fontStyle: 'italic' }}>Non hai ancora pubblicato nulla.</p>
                    ) : (
                        approvedPosts.map(post => (
                            <PostCard key={post.id} post={post} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}