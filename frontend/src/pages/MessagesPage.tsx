import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import type { Message, User } from '../types';

const MessagesPage: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [receiverUsername, setReceiverUsername] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Recupero utente loggato
    const userString = localStorage.getItem('user');
    const currentUser: User | null = userString ? JSON.parse(userString) : null;

    useEffect(() => {
        if (currentUser) {
            loadMessages();
        }
    }, []);

    const loadMessages = async () => {
        if (!currentUser) return;
        try {
            const data = await api.getReceivedMessages(currentUser.id);
            setMessages(data);
        } catch (err) {
            console.error("Errore caricamento messaggi", err);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!currentUser) {
            setError("Devi essere loggato per inviare messaggi.");
            return;
        }

        if (!receiverUsername.trim() || !content.trim()) {
            setError("Compila tutti i campi!");
            return;
        }

        try {
            await api.sendMessage(currentUser.id, receiverUsername.trim(), content);
            setSuccess("Messaggio inviato con successo!");
            setContent('');
            setReceiverUsername('');
            loadMessages();
        } catch (err) {
            console.error(err);
            setError("Impossibile inviare. Controlla che lo username esista.");
        }
    };

    if (!currentUser) {
        return (
            <div style={{ padding: '40px', textAlign: 'center'}}>
                <h2 style={{ color: '#2e7d32' }}>EcoHub 🌱</h2>
                <p>Devi effettuare il login per vedere i messaggi.</p>
                <a href="/login" style={{ color: '#2e7d32', fontWeight: 'bold' }}>Vai al login</a>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5', fontFamily: 'Arial, sans-serif' }}>
            <Navbar user={currentUser} />

            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>

                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <h1 style={{ color: '#2e7d32', margin: '0 0 5px 0' }}>Messaggi 📩</h1>
                    <p style={{ color: '#666' }}>Gestisci le tue conversazioni private.</p>
                </div>

                {/* FORM INVIO */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '25px',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    marginBottom: '30px'
                }}>
                    <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', borderBottom: '1px solid #eee', paddingBottom: '10px', color: '#333' }}>
                        ✍️ Scrivi un nuovo messaggio
                    </h2>

                    {error && (
                        <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '4px', marginBottom: '15px', border: '1px solid #ef9a9a' }}>
                            ⚠️ {error}
                        </div>
                    )}
                    {success && (
                        <div style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '4px', marginBottom: '15px', border: '1px solid #a5d6a7' }}>
                            ✅ {success}
                        </div>
                    )}

                    <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px', color: '#555' }}>
                                Destinatario (Username):
                            </label>
                            <input
                                type="text"
                                placeholder="Es. mario, luigi..."
                                value={receiverUsername}
                                onChange={(e) => setReceiverUsername(e.target.value)}
                                style={{
                                    width: '100%', padding: '12px', borderRadius: '4px',
                                    border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '14px'
                                }}
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px', color: '#555' }}>
                                Messaggio:
                            </label>
                            <textarea
                                rows={4}
                                placeholder="Scrivi il tuo messaggio qui..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                style={{
                                    width: '100%', padding: '12px', borderRadius: '4px',
                                    border: '1px solid #ccc', boxSizing: 'border-box',
                                    fontFamily: 'inherit', fontSize: '14px', resize: 'vertical'
                                }}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            style={{
                                backgroundColor: '#2e7d32', color: 'white', border: 'none',
                                padding: '12px 25px', borderRadius: '25px', cursor: 'pointer',
                                fontWeight: 'bold', alignSelf: 'flex-end', fontSize: '14px',
                                boxShadow: '0 2px 5px rgba(46, 125, 50, 0.3)'
                            }}
                        >
                            Invia Messaggio
                        </button>
                    </form>
                </div>

                {/* LISTA MESSAGGI */}
                <div>
                    <h2 style={{ color: '#333', borderBottom: '2px solid #2e7d32', paddingBottom: '10px', marginBottom: '20px' }}>
                        📬 Posta in arrivo
                    </h2>

                    {messages.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#666', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                            <h3>Nessun messaggio 🍃</h3>
                            <p>Non hai ancora ricevuto messaggi.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {messages.map((msg) => (
                                <div key={msg.id} style={{
                                    backgroundColor: 'white',
                                    padding: '20px',
                                    borderRadius: '8px',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    borderLeft: '5px solid #2e7d32'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>

                                        {/* MITTENTE CON FOTO O INIZIALE */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{
                                                width: '32px', height: '32px', borderRadius: '50%',
                                                backgroundColor: '#e8f5e9', color: '#2e7d32',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontWeight: 'bold', fontSize: '14px', overflow: 'hidden', border: '1px solid #ddd'
                                            }}>
                                                {msg.sender.profilePicture ? (
                                                    <img
                                                        src={msg.sender.profilePicture}
                                                        alt={msg.sender.username}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    msg.sender.username.charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <div>
                                                <span style={{ fontWeight: 'bold', color: '#333', display: 'block' }}>@{msg.sender.username}</span>
                                            </div>
                                        </div>

                                        <span style={{ color: '#999', fontSize: '12px' }}>
                                            {new Date(msg.timestamp).toLocaleString()}
                                        </span>
                                    </div>

                                    <div style={{ paddingLeft: '42px', color: '#444', lineHeight: '1.6' }}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessagesPage;