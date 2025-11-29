import type { Post, User } from '../types';
import CommentSection from './CommentSection'; // <--- IMPORT NUOVO

interface PostCardProps {
    post: Post;
    showActions?: boolean;
    onApprove?: (id: number) => void;
    onReject?: (id: number) => void;
}

export default function PostCard({ post, showActions, onApprove, onReject }: PostCardProps) {
    // Recuperiamo l'utente per passarlo alla sezione commenti
    const userString = localStorage.getItem('user');
    const currentUser: User | null = userString ? JSON.parse(userString) : null;

    return (
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            {/* ... INIZIO CODICE ESISTENTE (Header, Titolo, Contenuto, Tags) ... */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                {/* ... (tutto uguale a prima) ... */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e0f2f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00695c', fontWeight: 'bold' }}>
                        {post.author.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <strong style={{ display: 'block', color: '#333' }}>@{post.author.username}</strong>
                        <span style={{ fontSize: '12px', color: '#888' }}>{new Date(post.creationDate).toLocaleDateString()}</span>
                    </div>
                </div>
                {post.status === 'PENDING' && <span style={{ backgroundColor: '#fff3e0', color: '#ef6c00', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>In Attesa</span>}
            </div>

            <h3 style={{ margin: '10px 0', fontSize: '18px' }}>{post.title}</h3>
            <p style={{ lineHeight: '1.6', color: '#444' }}>{post.content}</p>

            <div style={{ display: 'flex', gap: '8px', marginTop: '15px', flexWrap: 'wrap' }}>
                {post.tags.map(tag => (
                    <span key={tag.id} style={{ backgroundColor: '#f1f8e9', color: '#558b2f', padding: '4px 10px', borderRadius: '15px', fontSize: '12px' }}>
                        #{tag.name}
                    </span>
                ))}
            </div>

            {/* SEZIONE AZIONI MODERATORE (uguale a prima) */}
            {showActions && onApprove && onReject && (
                <div style={{ borderTop: '1px solid #eee', marginTop: '15px', paddingTop: '15px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button onClick={() => onReject(post.id)} style={{ padding: '8px 15px', border: '1px solid #ef5350', color: '#ef5350', backgroundColor: 'white', borderRadius: '4px', cursor: 'pointer' }}>Rifiuta</button>
                    <button onClick={() => onApprove(post.id)} style={{ padding: '8px 15px', backgroundColor: '#66bb6a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Approva</button>
                </div>
            )}

            {/* ... FINE CODICE ESISTENTE ... */}

            {/* NUOVA SEZIONE COMMENTI */}
            {!showActions && ( // Mostriamo i commenti solo se NON siamo in modalità moderazione
                <CommentSection post={post} currentUser={currentUser} />
            )}
        </div>
    );
}