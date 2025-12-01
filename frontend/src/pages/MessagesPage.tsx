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

        if (!currentUser || !receiverUsername.trim() || !content.trim()) {
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
            setError("Impossibile inviare. Controlla lo username.");
        }
    };

    // --- LOGICA APPROVAZIONE MODERATORE ---
    const handlePromote = async (msgContent: string) => {
        // Estraiamo il nome utente dal messaggio: "L'utente @mario chiede..."
        const match = msgContent.match(/@(\w+)/);
        if (match && match[1]) {
            const usernameToPromote = match[1];
            if(!confirm(`Sei sicuro di voler promuovere ${usernameToPromote} a Moderatore?`)) return;

            try {
                await api.promoteUser(usernameToPromote);
                alert(`Utente ${usernameToPromote} promosso con successo! 🎉`);
                // Opzionale: ricarica i messaggi o invia risposta automatica
            } catch (err) {
                console.error(err);
                alert("Errore durante la promozione.");
            }
        } else {
            alert("Impossibile trovare lo username nel messaggio.");
        }
    };

    if (!currentUser) return (
        <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ color: '#2e7d32' }}>EcoHub 🌱</h2>
            <p>Devi effettuare il login.</p>
            <a href="/login" style={{ color: '#2e7d32', fontWeight: 'bold' }}>Login</a>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5', fontFamily: 'Arial, sans-serif' }}>
            <Navbar user={currentUser} />

            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
                <h1 style={{ color: '#2e7d32', textAlign: 'center', marginBottom: '20px' }}>Messaggi 📩</h1>

                {/* Form Invio (Invariato) */}
                <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
                    <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', borderBottom: '1px solid #eee', paddingBottom: '10px', color: '#333' }}>
                        ✍️ Scrivi un nuovo messaggio
                    </h2>
                    {error && <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>}
                    {success && <div style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{success}</div>}

                    <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input type="text" placeholder="Destinatario (Username)" value={receiverUsername} onChange={(e) => setReceiverUsername(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc' }} required />
                        <textarea rows={3} placeholder="Messaggio..." value={content} onChange={(e) => setContent(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'inherit' }} required />
                        <button type="submit" style={{ backgroundColor: '#2e7d32', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', alignSelf: 'flex-end' }}>Invia</button>
                    </form>
                </div>

                {/* Lista Messaggi */}
                <div>
                    <h2 style={{ color: '#333', borderBottom: '2px solid #2e7d32', paddingBottom: '10px', marginBottom: '20px' }}>Posta in arrivo</h2>

                    {messages.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#888', padding: '20px' }}>Nessun messaggio.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {messages.map((msg) => {
                                // Verifichiamo se è una richiesta di moderazione
                                const isModRequest = msg.content.includes("🔴 RICHIESTA MODERATORE 🔴");

                                return (
                                    <div key={msg.id} style={{
                                        backgroundColor: isModRequest ? '#fff8e1' : 'white', // Sfondo giallino se è richiesta
                                        padding: '20px',
                                        borderRadius: '8px',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                        borderLeft: isModRequest ? '5px solid #ff9800' : '5px solid #2e7d32'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                {/* Avatar */}
                                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e8f5e9', color: '#2e7d32', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', overflow: 'hidden', border: '1px solid #ddd' }}>
                                                    {msg.sender.profilePicture ? <img src={msg.sender.profilePicture} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : msg.sender.username.charAt(0).toUpperCase()}
                                                </div>
                                                <span style={{ fontWeight: 'bold', color: '#333' }}>@{msg.sender.username}</span>
                                            </div>
                                            <span style={{ color: '#999', fontSize: '12px' }}>{new Date(msg.timestamp).toLocaleString()}</span>
                                        </div>

                                        <div style={{ paddingLeft: '42px', color: '#444', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                                            {msg.content}
                                        </div>

                                        {/* BOTTONI DI AZIONE (Solo per Admin e solo se è richiesta mod) */}
                                        {isModRequest && currentUser.role === 'MODERATOR' && (
                                            <div style={{ marginTop: '15px', paddingLeft: '42px', display: 'flex', gap: '10px' }}>
                                                <button
                                                    onClick={() => handlePromote(msg.content)}
                                                    style={{ backgroundColor: '#4caf50', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                                >
                                                    ✅ Approva Candidatura
                                                </button>
                                                <button
                                                    onClick={() => alert("Per rifiutare, puoi semplicemente ignorare il messaggio o rispondere spiegando il motivo.")}
                                                    style={{ backgroundColor: '#ef5350', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                                >
                                                    ❌ Rifiuta
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessagesPage;