import React, { useState } from 'react';
import { api } from '../services/api';
import type { Post } from '../types';

interface EditPostProps {
    post: Post;
    userId: number;
    onClose: () => void;
    onUpdateSuccess: () => void;
}

export default function EditPost({ post, userId, onClose, onUpdateSuccess }: EditPostProps) {
    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);
    const [imageUrl, setImageUrl] = useState(post.imageUrl || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        setIsSubmitting(true);

        try {
            await api.updatePost(post.id, userId, {
                title,
                content,
                imageUrl
            });
            alert("Post aggiornato! È tornato in moderazione.");
            onUpdateSuccess();
            onClose();
        } catch (error) {
            console.error("Errore update:", error);
            alert("Errore durante la modifica.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 3000,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '25px',
                borderRadius: '8px',
                width: '90%',
                maxWidth: '500px',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <h2 style={{ marginTop: 0, color: '#2e7d32' }}>✏️ Modifica Post</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                    <div>
                        <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Titolo</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                            required
                        />
                    </div>

                    <div style={{ border: '1px dashed #ccc', padding: '15px', borderRadius: '4px', backgroundColor: '#fafafa' }}>
                        <p style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 'bold', color: '#555' }}>Immagine:</p>

                        {imageUrl && (
                            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                                <img
                                    src={imageUrl}
                                    alt="Anteprima"
                                    style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #eee' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setImageUrl('')}
                                    style={{ display: 'block', margin: '5px auto', fontSize: '12px', color: '#d32f2f', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    Rimuovi immagine corrente
                                </button>
                            </div>
                        )}

                        <input
                            type="text"
                            placeholder="Incolla un URL (https://...)"
                            value={imageUrl.startsWith('data:') ? '' : imageUrl}
                            onChange={e => setImageUrl(e.target.value)}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', marginBottom: '10px', boxSizing: 'border-box', fontSize: '13px' }}
                        />

                        <div style={{ textAlign: 'center', margin: '5px 0', fontSize: '12px', color: '#999' }}>- OPPURE CAMBIA FILE -</div>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            style={{ width: '100%', fontSize: '13px' }}
                        />
                    </div>

                    <div>
                        <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Contenuto</label>
                        <textarea
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            rows={5}
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontFamily: 'inherit' }}
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                        <button type="button" onClick={onClose} style={{ padding: '8px 15px', border: 'none', background: 'none', cursor: 'pointer', color: '#666' }}>Annulla</button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            style={{ padding: '8px 20px', backgroundColor: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: isSubmitting ? 0.7 : 1 }}
                        >
                            {isSubmitting ? 'Salvataggio...' : 'Salva Modifiche'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}