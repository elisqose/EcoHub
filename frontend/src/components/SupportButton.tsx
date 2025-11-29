import { useState } from 'react';
import { api } from '../services/api';
import type { Post, User } from '../types';

interface SupportButtonProps {
    post: Post;
    currentUser: User | null;
}

export default function SupportButton({ post, currentUser }: SupportButtonProps) {
    // Verifichiamo se l'utente attuale ha già supportato il post
    const isAlreadySupported = currentUser
        ? post.supports?.some(s => s.user?.id === currentUser.id) // Controlla nell'array supports (se esiste nel JSON)
        : false;

    const [supported, setSupported] = useState(isAlreadySupported);
    const [count, setCount] = useState(post.supports ? post.supports.length : 0);

    const handleSupport = async () => {
        if (!currentUser) {
            alert("Devi essere loggato per supportare!");
            return;
        }
        if (supported) return; // Se hai già supportato, non fare nulla (o implementa removeSupport)

        try {
            await api.addSupport(post.id, currentUser.id);
            setSupported(true);
            setCount(count + 1);
        } catch (error) {
            console.error("Errore supporto:", error);
        }
    };

    return (
        <button
            onClick={handleSupport}
            disabled={supported} // Disabilita se già cliccato
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '20px',
                border: supported ? '1px solid #2e7d32' : '1px solid #ccc',
                backgroundColor: supported ? '#e8f5e9' : 'white',
                color: supported ? '#2e7d32' : '#666',
                cursor: supported ? 'default' : 'pointer',
                transition: 'all 0.2s'
            }}
        >
            {supported ? '💚 Supportato' : '🤍 Supporta'}
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{count}</span>
        </button>
    );
}