import { useState } from 'react';
import { api } from '../services/api';
import type { Post, User } from '../types';

interface SupportButtonProps {
    post: Post;
    currentUser: User | null;
}

export default function SupportButton({ post, currentUser }: SupportButtonProps) {
    const isAlreadySupported = currentUser
        ? post.supports?.some(s => s.user?.id === currentUser.id)
        : false;

    const [supported, setSupported] = useState(isAlreadySupported);
    const [count, setCount] = useState(post.supports ? post.supports.length : 0);
    const [loading, setLoading] = useState(false);

    const handleSupport = async () => {
        if (!currentUser) return alert("Devi essere loggato!");
        if (loading) return;

        setLoading(true);
        try {
            await api.addSupport(post.id, currentUser.id); // Ora il backend fa toggle

            if (supported) {
                setCount(count - 1); // Ho tolto il like
                setSupported(false);
            } else {
                setCount(count + 1); // Ho messo il like
                setSupported(true);
            }
        } catch (error) {
            console.error("Errore supporto:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleSupport}
            style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '6px 12px', borderRadius: '20px',
                border: supported ? '1px solid #2e7d32' : '1px solid #ccc',
                backgroundColor: supported ? '#e8f5e9' : 'white',
                color: supported ? '#2e7d32' : '#666',
                cursor: 'pointer', transition: 'all 0.2s'
            }}
        >
            {/* FOGLIA VERDE al posto del cuore */}
            {supported ? '🍃 Supportato' : '🍂 Supporta'}
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{count}</span>
        </button>
    );
}