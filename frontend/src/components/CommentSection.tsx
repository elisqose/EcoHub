import { useState } from 'react';
import { api } from '../services/api';
import type { Post, User, Comment } from '../types';
import CommentForm from './CommentForm';

interface CommentSectionProps {
    post: Post;
    currentUser: User | null;
}

export default function CommentSection({ post, currentUser }: CommentSectionProps) {
    // Inizializziamo lo stato con i commenti che arrivano dal post
    const [comments, setComments] = useState<Comment[]>(post.comments || []);
    const [showComments, setShowComments] = useState(false);

    const handleNewComment = (newComment: Comment) => {
        // Aggiungiamo il nuovo commento alla lista esistente
        setComments([...comments, newComment]);
    };

    // --- FUNZIONE ELIMINAZIONE COMMENTO ---
    const handleDeleteComment = async (commentId: number) => {
        if (!currentUser) return;

        // Messaggio diverso a seconda del ruolo
        const confirmMsg = currentUser.role === 'MODERATOR'
            ? "⚠️ Sei un Moderatore. Eliminando questo commento, invierai un avviso automatico all'autore. Procedere?"
            : "Vuoi eliminare il tuo commento?";

        if (!confirm(confirmMsg)) return;

        try {
            await api.deleteComment(post.id, commentId, currentUser.id);
            // Aggiorna la lista locale rimuovendo il commento
            setComments(comments.filter(c => c.id !== commentId));
        } catch (error) {
            console.error("Errore cancellazione commento:", error);
            alert("Impossibile eliminare il commento.");
        }
    };

    return (
        <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
            {/* Pulsante Toggle */}
            <button
                onClick={() => setShowComments(!showComments)}
                style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '14px', padding: 0 }}
            >
                {showComments ? 'Nascondi commenti' : `Mostra commenti (${comments.length})`}
            </button>

            {/* Area Commenti */}
            {showComments && (
                <div style={{ marginTop: '10px' }}>
                    {/* Lista Commenti */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {comments.length === 0 && <p style={{ fontSize: '13px', color: '#999' }}>Nessun commento. Sii il primo!</p>}

                        {comments.map(comment => {
                            // Verifica permessi per mostrare il bottone delete
                            const isModerator = currentUser?.role === 'MODERATOR';
                            const isAuthor = currentUser?.id === comment.author.id;
                            const canDelete = isModerator || isAuthor;

                            return (
                                <div key={comment.id} style={{
                                    backgroundColor: '#f9f9f9',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    position: 'relative', // Per posizionare il bottone elimina
                                    border: isModerator && !isAuthor ? '1px solid #ffe0b2' : 'none' // Evidenzia ai mod i commenti altrui
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                                        <strong>{comment.author.username}</strong>
                                        <span style={{ color: '#888' }}>{new Date(comment.creationDate).toLocaleDateString()}</span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '14px', color: '#333' }}>{comment.text}</p>

                                    {/* Bottone Elimina (Visibile solo se autorizzato) */}
                                    {canDelete && (
                                        <button
                                            onClick={() => handleDeleteComment(comment.id)}
                                            title={isModerator ? "Elimina come Moderatore" : "Elimina il tuo commento"}
                                            style={{
                                                position: 'absolute',
                                                top: '5px',
                                                right: '5px',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                color: '#d32f2f'
                                            }}
                                        >
                                            🗑️
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Form Aggiunta Commento (Solo se loggato) */}
                    {currentUser && (
                        <CommentForm
                            postId={post.id}
                            currentUser={currentUser}
                            onCommentAdded={handleNewComment}
                        />
                    )}
                </div>
            )}
        </div>
    );
}