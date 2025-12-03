import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import { api } from '../services/api';
import type { Post, User } from '../types';

export default function ModeratorPage() {
    const [pendingPosts, setPendingPosts] = useState<Post[]>([]);

    const [requestingChangesId, setRequestingChangesId] = useState<number | null>(null);
    const [note, setNote] = useState('');

    const userString = localStorage.getItem('user');
    const user: User | null = userString ? JSON.parse(userString) : null;

    useEffect(() => {
        if (user && user.role === 'MODERATOR') {
            loadPending();
        }
    }, [user]);

    const loadPending = async () => {
        try {
            const data = await api.getPendingPosts();
            setPendingPosts(data);
        } catch (error) {
            console.error("Errore caricamento post pendenti:", error);
        }
    };

    const handleApprove = async (id: number) => {
        if (!confirm('Sei sicuro di voler approvare questo post?')) return;
        try {
            await api.approvePost(id);
            loadPending();
        } catch (error) {
            console.error("Errore approvazione:", error);
            alert("Impossibile approvare il post.");
        }
    };

    const handleReject = async (id: number) => {
        if (!confirm('Sei sicuro di voler RIFIUTARE definitivamente questo post?')) return;
        try {
            await api.rejectPost(id);
            loadPending();
        } catch (error) {
            console.error("Errore rifiuto:", error);
            alert("Impossibile rifiutare il post.");
        }
    };

    const startRequestChanges = (id: number) => {
        setRequestingChangesId(id);
        setNote('');
    };

    const submitRequestChanges = async (id: number) => {
        if (!note.trim()) {
            alert("Devi inserire una motivazione!");
            return;
        }

        try {
            await api.requestChanges(id, note);
            alert("Richiesta inviata all'autore.");
            setRequestingChangesId(null);
            loadPending();
        } catch (error) {
            console.error("Errore richiesta modifiche:", error);
            alert("Errore durante l'operazione.");
        }
    };

    if (!user || user.role !== 'MODERATOR') {
        return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>⛔ Accesso Negato. Solo per Moderatori.</h2>;
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
                            <div key={post.id} style={{ marginBottom: '20px' }}>
                                <PostCard
                                    post={post}
                                    showActions={true}
                                    onApprove={handleApprove}
                                    onReject={handleReject}
                                />

                                <div style={{
                                    backgroundColor: 'white',
                                    padding: '10px 20px',
                                    marginTop: '-20px', // Attacca visivamente alla card sopra
                                    borderBottomLeftRadius: '8px',
                                    borderBottomRightRadius: '8px',
                                    borderTop: '1px solid #eee',
                                    display: 'flex',
                                    justifyContent: 'flex-end'
                                }}>
                                    {requestingChangesId === post.id ? (
                                        <div style={{ width: '100%', display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <input
                                                type="text"
                                                placeholder="Motivazione (es: Foto non chiara, Aggiungi fonti...)"
                                                value={note}
                                                onChange={(e) => setNote(e.target.value)}
                                                style={{ flex: 1, padding: '8px', border: '1px solid orange', borderRadius: '4px' }}
                                            />
                                            <button
                                                onClick={() => submitRequestChanges(post.id)}
                                                style={{ backgroundColor: '#ff9800', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                Invia Richiesta
                                            </button>
                                            <button
                                                onClick={() => setRequestingChangesId(null)}
                                                style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline' }}
                                            >
                                                Annulla
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => startRequestChanges(post.id)}
                                            style={{
                                                backgroundColor: '#fff',
                                                color: '#f57c00',
                                                border: '1px solid #f57c00',
                                                padding: '6px 12px',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            ✏️ Richiedi Modifiche
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}