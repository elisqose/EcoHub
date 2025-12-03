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
            await api.addSupport(post.id, currentUser.id);

            if (supported) {
                setCount(count - 1);
                setSupported(false);
            } else {
                setCount(count + 1);
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
                display: 'flex',
                alignItems: 'baseline',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '20px',
                border: supported ? '1px solid #2e7d32' : '1px solid #ccc',
                backgroundColor: supported ? '#e8f5e9' : 'white',
                color: supported ? '#2e7d32' : '#666',
                cursor: 'pointer',
                transition: 'all 0.2s'
            }}
        >

            {supported ? '🍃 Supportato' : '🍂 Supporta'}
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{count}</span>
        </button>
    );
}