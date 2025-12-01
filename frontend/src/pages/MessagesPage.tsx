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
            // --- MODIFICA: Chiamata al nuovo endpoint getMessages (che include inviati e ricevuti) ---
            const data = await api.getMessages(currentUser.id);
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
            setSuccess("Messaggio inviato con successo!");
            setContent('');
            setReceiverUsername('');
            // Ricaricando, vedremo subito il messaggio inviato nella lista!
            loadMessages();
        } catch (err) {
            console.error(err);
            setError("Impossibile inviare. Controlla lo username.");
        }
    };

    const deleteMsgHelper = async (msgId: number) => {
        if(!confirm("Vuoi eliminare questo messaggio?")) return;
        try {
            await api.deleteMessage(msgId);
            setMessages(prev => prev.filter(m => m.id !== msgId));
        } catch (error) {
            console.error("Errore eliminazione:", error);
            alert("Impossibile eliminare il messaggio.");
        }
    };

    const handleReply = (senderUsername: string) => {
        setReceiverUsername(senderUsername);
        setContent('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const inputElement = document.getElementById('msg-content');
        if(inputElement) inputElement.focus();
    };

    const handlePromote = async (msgId: number, msgContent: string) => {
        const match = msgContent.match(/@(\w+)/);
        if (match && match[1]) {
            const username = match[1];
            if(!confirm(`Promuovere ${username} a Moderatore?`)) return;

            try {
                await api.promoteUser(username);
                alert(`Utente ${username} promosso! Il messaggio verrà archiviato.`);
                await api.deleteMessage(msgId);
                setMessages(prev => prev.filter(m => m.id !== msgId));
            } catch (err) {
                console.error(err);
                alert("Errore durante la promozione.");
            }
        } else {
            alert("Username non trovato nel messaggio.");
        }
    };

    const handleRejectModRequest = async (msgId: number, msgContent: string) => {
        const match = msgContent.match(/@(\w+)/);
        if (match && match[1]) {
            const username = match[1];
            if (!confirm(`Vuoi rifiutare la richiesta di ${username}?`)) return;

            try {
                await api.rejectUser(username);
                alert("Richiesta rifiutata.");
                await api.deleteMessage(msgId);
                setMessages(prev => prev.filter(m => m.id !== msgId));
            } catch (err) {
                console.error(err);
                alert("Errore durante il rifiuto.");
            }
        } else {
            deleteMsgHelper(msgId);
        }
    };

    if (!currentUser) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <h2 style={{ color: '#2e7d32' }}>EcoHub 🌱</h2>
                <p>Devi effettuare il login.</p>
                <a href="/login" style={{ color: '#2e7d32', fontWeight: 'bold' }}>Vai al login</a>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
            <Navbar user={currentUser} />

            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>

                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <h1 style={{ color: '#2e7d32', margin: '0 0 5px 0' }}>Messaggi 📩</h1>
                    <p style={{ color: '#666' }}>Tutte le tue conversazioni (inviati e ricevuti).</p>
                </div>

                {/* FORM INVIO */}
                <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
                    <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', borderBottom: '1px solid #eee', paddingBottom: '10px', color: '#333' }}>
                        ✍️ Scrivi un nuovo messaggio
                    </h2>

                    {error && <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>}
                    {success && <div style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{success}</div>}

                    <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px', color: '#555' }}>Destinatario (Username):</label>
                            <input
                                type="text"
                                placeholder="Es. mario"
                                value={receiverUsername}
                                onChange={(e) => setReceiverUsername(e.target.value)}
                                style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px', color: '#555' }}>Messaggio:</label>
                            <textarea
                                id="msg-content"
                                rows={4}
                                placeholder="Scrivi qui..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontFamily: 'inherit' }}
                                required
                            />
                        </div>
                        <button type="submit" style={{ backgroundColor: '#2e7d32', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', alignSelf: 'flex-end', boxShadow: '0 2px 5px rgba(46, 125, 50, 0.3)' }}>Invia Messaggio</button>
                    </form>
                </div>

                {/* LISTA MESSAGGI (STORIA) */}
                <div>
                    <h2 style={{ color: '#333', borderBottom: '2px solid #2e7d32', paddingBottom: '10px', marginBottom: '20px' }}>🕐 Cronologia</h2>

                    {messages.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#666', backgroundColor: 'white', borderRadius: '8px' }}>
                            <h3>Nessun messaggio 🍃</h3>
                            <p>Non hai ancora inviato o ricevuto messaggi.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {messages.map((msg) => {
                                const isModRequest = msg.content.includes("🔴 RICHIESTA MODERATORE 🔴");
                                const isMine = msg.sender.id === currentUser.id; // Controlliamo se sono il mittente

                                return (
                                    <div key={msg.id} style={{
                                        // Stile dinamico: a destra se mio, a sinistra se ricevuto
                                        alignSelf: isMine ? 'flex-end' : 'flex-start',
                                        backgroundColor: isMine ? '#dcedc8' : (isModRequest ? '#fff8e1' : 'white'),
                                        width: '80%', // Non prendiamo tutta la larghezza per dare effetto chat
                                        padding: '20px', borderRadius: '8px',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                        borderLeft: !isMine ? (isModRequest ? '5px solid #ff9800' : '5px solid #2e7d32') : 'none',
                                        borderRight: isMine ? '5px solid #2e7d32' : 'none',
                                        marginLeft: isMine ? 'auto' : '0',
                                        marginRight: isMine ? '0' : 'auto'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                {/* Se è mio, scriviamo "Tu", altrimenti mostriamo chi l'ha mandato */}
                                                <span style={{ fontWeight: 'bold', color: '#333' }}>
                                                    {isMine ? '📤 Tu' : `@${msg.sender.username}`}
                                                </span>
                                                {isMine && <span style={{fontSize:'12px', color:'#666'}}> ➝ a @{msg.receiver.username}</span>}
                                            </div>
                                            <span style={{ color: '#999', fontSize: '12px' }}>{new Date(msg.timestamp).toLocaleString()}</span>
                                        </div>

                                        <div style={{ color: '#444', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                                            {msg.content}
                                        </div>

                                        {/* AZIONI MODERATORE (Solo su messaggi ricevuti) */}
                                        {!isMine && isModRequest && currentUser.role === 'MODERATOR' && (
                                            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                                                <button onClick={() => handlePromote(msg.id, msg.content)} style={{ backgroundColor: '#4caf50', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>✅ Approva</button>
                                                <button onClick={() => handleRejectModRequest(msg.id, msg.content)} style={{ backgroundColor: '#ef5350', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>❌ Rifiuta</button>
                                            </div>
                                        )}

                                        {/* AZIONI STANDARD */}
                                        <div style={{ marginTop: '15px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                            {/* Mostra "Rispondi" solo se il messaggio NON è mio */}
                                            {!isMine && !isModRequest && (
                                                <button
                                                    onClick={() => handleReply(msg.sender.username)}
                                                    style={{ backgroundColor: 'white', border: '1px solid #2e7d32', color: '#2e7d32', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
                                                >
                                                    ↩️ Rispondi
                                                </button>
                                            )}

                                            {/* Elimina c'è sempre */}
                                            <button
                                                onClick={() => deleteMsgHelper(msg.id)}
                                                style={{ backgroundColor: 'white', border: '1px solid #d32f2f', color: '#d32f2f', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
                                            >
                                                🗑️ Elimina
                                            </button>
                                        </div>
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