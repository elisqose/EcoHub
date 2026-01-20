import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import type { User } from '../types';

export default function CreatePostPage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [tags, setTags] = useState('');
    const navigate = useNavigate();

    const userString = localStorage.getItem('user');
    const user: User | null = userString ? JSON.parse(userString) : null;

    if (!user) return <p>Devi fare login!</p>;

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const tagList = tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
            await api.createPost({
                title,
                content,
                imageUrl
            }, user.id, tagList);

            alert('Post creato! È in attesa di approvazione.');
            navigate('/feed');
        } catch (error) {
            console.error(error);
            alert('Errore durante la creazione del post. Se hai caricato un\'immagine molto grande, prova con una più piccola.');
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
            <Navbar user={user} />
            <div style={{ maxWidth: '600px', margin: '30px auto', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <h2 style={{ color: '#2e7d32', textAlign: 'center' }}>Scrivi un nuovo post </h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                    <input
                        type="text"
                        placeholder="Titolo del post..."
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc' }}
                        required
                    />


                    <div style={{ border: '1px dashed #ccc', padding: '15px', borderRadius: '4px', backgroundColor: '#fafafa' }}>
                        <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>Aggiungi un'immagine (scegli un metodo):</p>

                        <input
                            type="text"
                            placeholder="Incolla un URL (https://...)"
                            value={imageUrl.startsWith('data:') ? '' : imageUrl}
                            onChange={e => setImageUrl(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', marginBottom: '10px', boxSizing: 'border-box' }}
                        />

                        <div style={{ textAlign: 'center', margin: '5px 0', fontSize: '12px', color: '#999' }}>- OPPURE -</div>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            style={{ width: '100%', fontSize: '14px' }}
                        />
                    </div>

                    {imageUrl && (
                        <div style={{ textAlign: 'center' }}>
                            <img
                                src={imageUrl}
                                alt="Anteprima"
                                style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #eee' }}
                                onError={(e) => (e.currentTarget.style.display = 'none')}
                            />
                            <button
                                type="button"
                                onClick={() => setImageUrl('')}
                                style={{ display: 'block', margin: '5px auto', fontSize: '12px', color: '#d32f2f', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                Rimuovi immagine
                            </button>
                        </div>
                    )}

                    <textarea
                        placeholder="Condividi la tua idea sostenibile..."
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        rows={6}
                        style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc' }}
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