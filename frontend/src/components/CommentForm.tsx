import { useState } from 'react';
import { api } from '../services/api';
import type { Comment, User } from '../types';

interface CommentFormProps {
    postId: number;
    currentUser: User;
    onCommentAdded: (newComment: Comment) => void;
}

export default function CommentForm({ postId, currentUser, onCommentAdded }: CommentFormProps) {
    const [text, setText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        setIsSubmitting(true);
        try {
            const newComment = await api.addComment(postId, currentUser.id, text);
            onCommentAdded(newComment); // Avvisa il genitore!
            setText(''); // Pulisce il campo
        } catch (error) {
            alert('Errore invio commento');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Scrivi un commento..."
                style={{ flex: 1, padding: '8px', borderRadius: '20px', border: '1px solid #ddd' }}
                disabled={isSubmitting}
            />
            <button
                type="submit"
                disabled={isSubmitting || !text.trim()}
                style={{
                    backgroundColor: '#2e7d32',
                    color: 'white',
                    border: 'none',
                    borderRadius: '20px',
                    padding: '8px 15px',
                    cursor: 'pointer',
                    opacity: isSubmitting ? 0.7 : 1
                }}
            >
                Invia
            </button>
        </form>
    );
}