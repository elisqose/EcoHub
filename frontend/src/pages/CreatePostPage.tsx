import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import type { User } from '../types';

export default function CreatePostPage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const navigate = useNavigate();

    // Recuperiamo l'utente (serve per la Navbar e per l'ID)
    const userString = localStorage.getItem('user');
    const user: User | null = userString ? JSON.parse(userString) : null;

    if (!user) return <p>Devi fare login!</p>;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Convertiamo la stringa dei tag "bio, riciclo" in array ["bio", "riciclo"]
            const tagList = tags.split(',').map(t => t.trim()).filter(t => t.length > 0);

            // Assicurati che l'API supporti questo formato.
            // Se l'API si aspetta un oggetto JSON intero, adatta la chiamata.
            await api.createPost({ title, content }, user.id, tagList);

            alert('Post creato! È in attesa di approvazione.');
            navigate('/feed');
        } catch (error) {
            console.error(error);
            alert('Errore durante la creazione del post');
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
            <Navbar user={user} />
            <div style={{ maxWidth: '600px', margin: '30px auto', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <h2 style={{ color: '#2e7d32', textAlign: 'center' }}>Scrivi un nuovo post ✍️</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                    <input
                        type="text"
                        placeholder="Titolo accattivante..."
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc' }}
                        required
                    />
                    <textarea
                        placeholder="Condividi la tua idea sostenibile..."
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        rows={6}
                        style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'inherit' }}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Tags (separati da virgola, es: riciclo, bio)"
                        value={tags}
                        onChange={e => setTags(e.target.value)}
                        style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <button type="submit" style={{ padding: '12px', backgroundColor: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer', marginTop: '10px' }}>
                        Pubblica Post
                    </button>
                </form>
            </div>
        </div>
    );
}