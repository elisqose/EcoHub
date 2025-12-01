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
            // Nota: getReceivedMessages ora dovrebbe essere aggiornato nel backend
            // per restituire TUTTA la conversazione (inviati + ricevuti) tramite messageService.getMessagesForUser
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
            setError("Devi essere loggato.");
            return;
        }
        if (!receiverUsername.trim() || !content.trim()) {
            setError("Compila tutti i campi!");
            return;
        }

        try {
            await api.sendMessage(currentUser.id, receiverUsername.trim(), content);
            setSuccess("Inviato!");
            setContent('');
            // Non resettiamo receiverUsername così puoi continuare a scrivere alla stessa persona
            loadMessages();
        } catch (err) {
            console.error(err);
            setError("Impossibile inviare. Controlla lo username.");
        }
    };

    // Helper eliminazione
    const deleteMsgHelper = async (msgId: number) => {
        await api.deleteMessage(msgId);
        setMessages(prev => prev.filter(m => m.id !== msgId));
    };

    // Logica Approvazione
    const handlePromote = async (msgId: number, msgContent: string) => {
        const match = msgContent.match(/@(\w+)/);
        if (match && match[1]) {
            const username = match[1];
            if (!confirm(`Promuovere ${username} a Moderatore?`)) return;

            try {
                await api.promoteUser(username);
                alert(`Utente ${username} promosso!`);
                await deleteMsgHelper(msgId);
            } catch (err) {
                alert("Errore durante la promozione.");
            }
        } else {
            alert("Username non trovato.");
        }
    };

    // Logica Rifiuto
    const handleReject = async (msgId: number, msgContent: string) => {
        const match = msgContent.match(/@(\w+)/);
        if (match && match[1]) {
            const username = match[1];
            if (!confirm(`Vuoi rifiutare la richiesta di ${username}?`)) return;

            try {
                await api.rejectUser(username);
                alert("Richiesta rifiutata.");
                await deleteMsgHelper(msgId);
            } catch (err) {
                alert("Errore durante il rifiuto.");
            }
        } else {
            if(confirm("Impossibile trovare il nome utente. Vuoi solo cancellare il messaggio?")) {
                await deleteMsgHelper(msgId);
            }
        }
    };

    if (!currentUser) return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
            <p>Devi effettuare il login.</p>
            <a href="/login">Vai al login</a>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
            <Navbar user={currentUser} />

            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
                <h1 style={{ color: '#2e7d32', textAlign: 'center', marginBottom: '20px' }}>Messaggi 📩</h1>

                {/* AREA DI SCRITTURA */}
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '18px', margin: '0 0 15px 0', color: '#333' }}>✍️ Scrivi un nuovo messaggio</h2>
                    {error && <p style={{color:'red', fontSize:'14px'}}>{error}</p>}
                    {success && <p style={{color:'green', fontSize:'14px'}}>{success}</p>}

                    <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <div style={{flex: 1}}>
                            <input
                                type="text"
                                placeholder="Username destinatario"
                                value={receiverUsername}
                                onChange={e => setReceiverUsername(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '10px', boxSizing: 'border-box' }}
                                required
                            />
                            <textarea
                                rows={2}
                                placeholder="Scrivi qui..."
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical' }}
                                required
                            />
                        </div>
                        <button type="submit" style={{ backgroundColor: '#2e7d32', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', height: 'fit-content' }}>
                            Invia
                        </button>
                    </form>
                </div>

                {/* LISTA MESSAGGI (Chat Style) */}
                <div>
                    <h2 style={{ color: '#333', borderBottom: '2px solid #2e7d32', paddingBottom: '10px', marginBottom: '20px' }}>Conversazioni</h2>

                    {messages.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#888', padding: '20px' }}>Nessuna conversazione.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '50px' }}>
                            {messages.map((msg) => {
                                const isSentByMe = msg.sender.id === currentUser.id;
                                const isModRequest = msg.content.includes("RICHIESTA MODERATORE");

                                // Logica Colore Sfondo: Verde se mio, Giallino se richiesta, Bianco se ricevuto normale
                                const bgColor = isSentByMe ? '#dcedc8' : (isModRequest ? '#fff8e1' : 'white');
                                // Logica Bordo Laterale: Nessuno se mio, Arancione se richiesta, Verde se ricevuto
                                const borderStyle = isSentByMe ? 'none' : (isModRequest ? '5px solid #ff9800' : '5px solid #2e7d32');

                                return (
                                    <div key={msg.id} style={{
                                        alignSelf: isSentByMe ? 'flex-end' : 'flex-start',
                                        backgroundColor: bgColor,
                                        maxWidth: '75%', // Chat bubbles non a tutta larghezza
                                        padding: '15px',
                                        borderRadius: '8px',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                        borderLeft: borderStyle,
                                        position: 'relative'
                                    }}>
                                        {/* Header Messaggio */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center', gap: '15px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {/* Mostra avatar solo se non è inviato da me (per pulizia) o sempre se preferisci */}
                                                {!isSentByMe && (
                                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#e8f5e9', color: '#2e7d32', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px', overflow: 'hidden', border: '1px solid #ddd' }}>
                                                        {msg.sender.profilePicture ? <img src={msg.sender.profilePicture} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : msg.sender.username.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <span style={{ fontWeight: 'bold', color: '#333', fontSize: '14px' }}>
                                                    {isSentByMe ? 'Tu' : `@${msg.sender.username}`}
                                                </span>
                                            </div>
                                            <span style={{ color: '#888', fontSize: '11px' }}>{new Date(msg.timestamp).toLocaleString()}</span>
                                        </div>

                                        {/* Contenuto */}
                                        <div style={{ color: '#333', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                                            {msg.content}
                                        </div>

                                        {/* BOTTONI ADMIN (Solo sui messaggi RICEVUTI che sono richieste) */}
                                        {!isSentByMe && isModRequest && currentUser.role === 'MODERATOR' && (
                                            <div style={{ marginTop: '15px', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '10px', display: 'flex', gap: '10px' }}>
                                                <button onClick={() => handlePromote(msg.id, msg.content)} style={{ flex: 1, backgroundColor: '#4caf50', color: 'white', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>✅ Approva</button>
                                                <button onClick={() => handleReject(msg.id, msg.content)} style={{ flex: 1, backgroundColor: '#ef5350', color: 'white', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>❌ Rifiuta</button>
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