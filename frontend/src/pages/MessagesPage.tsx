import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import type { Message, User } from '../types';

export default function MessagesPage() {
    const location = useLocation();

    const [activeTab, setActiveTab] = useState<'INBOX' | 'OUTBOX'>('INBOX');
    const [messages, setMessages] = useState<Message[]>([]);

    const [receiverUsername, setReceiverUsername] = useState('');
    const [content, setContent] = useState('');

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const userString = localStorage.getItem('user');
    const currentUser: User | null = userString ? JSON.parse(userString) : null;

    useEffect(() => {
        if (location.state && location.state.targetUsername) {
            setReceiverUsername(location.state.targetUsername);

            window.history.replaceState({}, document.title);
        }
    }, [location]);

    useEffect(() => {
        if (currentUser) {
            loadMessages();
        }
    }, [activeTab, currentUser?.id]);

    const loadMessages = async () => {
        if (!currentUser) return;
        try {
            let data = [];
            if (activeTab === 'INBOX') {
                data = await api.getReceivedMessages(currentUser.id);
            } else {
                data = await api.getSentMessages(currentUser.id);
            }
            setMessages(data);
        } catch (err) {
            console.error("Errore caricamento messaggi", err);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!currentUser) return;
        if (!receiverUsername.trim() || !content.trim()) {
            setError("Compila tutti i campi!");
            return;
        }

        try {
            await api.sendMessage(currentUser.id, receiverUsername.trim(), content);
            setSuccess("Messaggio inviato!");
            setContent('');

            if (activeTab === 'OUTBOX') loadMessages();
        } catch (err) {
            console.error(err);
            setError("Impossibile inviare. Utente non trovato.");
        }
    };

    const handleDelete = async (msgId: number) => {
        if (!confirm("Vuoi cancellare questo messaggio?")) return;
        try {
            await api.deleteMessage(msgId);
            setMessages(prev => prev.filter(m => m.id !== msgId));
        } catch (err) {
            alert("Errore eliminazione");
        }
    };

    const handleReply = (username: string) => {
        setReceiverUsername(username);
        setError(null);
        setSuccess(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleModerationAction = async (msgId: number, msgContent: string, action: 'PROMOTE' | 'REJECT') => {
        const match = msgContent.match(/@(\w+)/);
        if (!match || !match[1]) return alert("Username non trovato nel messaggio.");

        const targetUsername = match[1];

        try {
            if (action === 'PROMOTE') {
                await api.promoteUser(targetUsername);
                alert(`Utente ${targetUsername} promosso!`);
            } else {
                await api.rejectUser(targetUsername);
                alert(`Richiesta di ${targetUsername} rifiutata.`);
            }
            handleDelete(msgId);
        } catch (err) {
            alert("Errore durante l'operazione.");
        }
    };

    if (!currentUser) return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
            <p>Devi effettuare il login.</p>
            <a href="/login" style={{ color: '#2e7d32', fontWeight: 'bold' }}>Vai al login</a>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
            <Navbar user={currentUser} />

            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
                <h1 style={{ color: '#2e7d32', textAlign: 'center', marginBottom: '20px' }}>Messaggi</h1>

                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#333' }}>Scrivi Nuovo Messaggio</h3>

                    {error && <div style={{ color: '#c62828', backgroundColor: '#ffebee', padding: '8px', borderRadius: '4px', marginBottom: '10px' }}>{error}</div>}
                    {success && <div style={{ color: '#2e7d32', backgroundColor: '#e8f5e9', padding: '8px', borderRadius: '4px', marginBottom: '10px' }}>{success}</div>}

                    <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                        <input
                            type="text"
                            placeholder="A: Username destinatario"
                            value={receiverUsername}
                            onChange={e => setReceiverUsername(e.target.value)}
                            style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px' }}
                            required
                        />
                        <textarea
                            rows={3}
                            placeholder="Testo del messaggio..."
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'inherit', fontSize: '16px' }}
                            required
                        />
                        <button type="submit" style={{ backgroundColor: '#2e7d32', color: 'white', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
                            Invia Messaggio
                        </button>
                    </form>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    <button
                        onClick={() => setActiveTab('INBOX')}
                        style={{
                            flex: 1, padding: '10px', cursor: 'pointer', border: 'none', borderRadius: '4px', fontWeight: 'bold',
                            backgroundColor: activeTab === 'INBOX' ? '#2e7d32' : '#e0e0e0',
                            color: activeTab === 'INBOX' ? 'white' : 'black',
                            transition: 'background-color 0.2s'
                        }}
                    >
                        ⬇️  Posta in Arrivo
                    </button>
                    <button
                        onClick={() => setActiveTab('OUTBOX')}
                        style={{
                            flex: 1, padding: '10px', cursor: 'pointer', border: 'none', borderRadius: '4px', fontWeight: 'bold',
                            backgroundColor: activeTab === 'OUTBOX' ? '#2e7d32' : '#e0e0e0',
                            color: activeTab === 'OUTBOX' ? 'white' : 'black',
                            transition: 'background-color 0.2s'
                        }}
                    >
                        ⬆️ Posta Inviata
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {messages.length === 0 && <p style={{ textAlign: 'center', color: '#888', padding: '20px' }}>Nessun messaggio.</p>}

                    {messages.map(msg => {
                        const isModRequest = msg.content.includes("RICHIESTA MODERATORE");
                        const otherUser = activeTab === 'INBOX' ? msg.sender : msg.receiver;

                        return (
                            <div key={msg.id} style={{
                                backgroundColor: isModRequest && activeTab === 'INBOX' ? '#fff8e1' : 'white',
                                padding: '15px',
                                borderRadius: '8px',
                                borderLeft: isModRequest && activeTab === 'INBOX' ? '5px solid #ff9800' : '5px solid #2e7d32',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', flexWrap: 'wrap' }}>
                                    <strong style={{ color: '#333' }}>
                                        {activeTab === 'INBOX' ? `Da: @${otherUser.username}` : `A: @${otherUser.username}`}
                                    </strong>
                                    <span style={{ fontSize: '12px', color: '#888' }}>
                                        {new Date(msg.timestamp).toLocaleString()}
                                    </span>
                                </div>

                                <p style={{ margin: '10px 0', whiteSpace: 'pre-wrap', color: '#444', lineHeight: '1.5' }}>{msg.content}</p>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>

                                    {activeTab === 'INBOX' && isModRequest && currentUser.role === 'MODERATOR' && (
                                        <>
                                            <button onClick={() => handleModerationAction(msg.id, msg.content, 'PROMOTE')} style={{ backgroundColor: '#4caf50', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Accetta</button>
                                            <button onClick={() => handleModerationAction(msg.id, msg.content, 'REJECT')} style={{ backgroundColor: '#f44336', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Rifiuta</button>
                                        </>
                                    )}

                                    {activeTab === 'INBOX' && (
                                        <button
                                            onClick={() => handleReply(otherUser.username)}
                                            style={{
                                                backgroundColor: 'white',
                                                border: '1px solid #1976d2',
                                                color: '#1976d2',
                                                padding: '5px 12px',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px'
                                            }}
                                        >
                                            ↩️ Rispondi
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleDelete(msg.id)}
                                        style={{ backgroundColor: 'transparent', border: '1px solid #d32f2f', color: '#d32f2f', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        🗑️ Elimina
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}