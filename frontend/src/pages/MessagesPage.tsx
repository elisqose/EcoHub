import React, { useEffect, useState } from 'react';
import { api } from '../services/api'; // <--- MODIFICA QUI: Importiamo l'oggetto api
import type { Message } from '../types';

const MessagesPage: React.FC = () => {
    // STATO
    const [messages, setMessages] = useState<Message[]>([]);
    const [receiverId, setReceiverId] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // SIMULAZIONE UTENTE LOGGATO
    // NOTA: Qui dovresti prendere l'ID dal tuo sistema di autenticazione (es. localStorage o Context)
    // Per ora metti manualmente l'ID di un utente che esiste nel tuo DB (es. 1 o 2)
    const currentUserId = 1;

    // CARICAMENTO MESSAGGI ALL'AVVIO
    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = async () => {
        try {
            // MODIFICA QUI: usiamo api.getReceivedMessages
            const data = await api.getReceivedMessages(currentUserId);
            setMessages(data);
        } catch (err) {
            console.error("Errore caricamento messaggi", err);
        }
    };

    // GESTIONE INVIO FORM
    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!receiverId || !content) {
            setError("Compila tutti i campi!");
            return;
        }

        try {
            // MODIFICA QUI: usiamo api.sendMessage
            await api.sendMessage(currentUserId, parseInt(receiverId), content);

            setSuccess("Messaggio inviato con successo!");
            setContent('');
            setReceiverId('');

            // Ricarichiamo i messaggi per vedere se ce ne siamo mandati uno da soli
            loadMessages();
        } catch (err) {
            setError("Impossibile inviare il messaggio. Controlla l'ID destinatario.");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">I tuoi Messaggi</h1>

            {/* SEZIONE 1: FORM DI INVIO (Soddisfa requisito Form POST) */}
            <div className="bg-gray-100 p-6 rounded shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">Invia un nuovo messaggio</h2>
                {error && <div className="text-red-500 mb-2">{error}</div>}
                {success && <div className="text-green-500 mb-2">{success}</div>}

                <form onSubmit={handleSend} className="flex flex-col gap-4">
                    <div>
                        <label className="block mb-1 font-medium">ID Destinatario:</label>
                        <input
                            type="number"
                            className="border p-2 rounded w-full"
                            placeholder="Inserisci ID utente (es. 2)"
                            value={receiverId}
                            onChange={(e) => setReceiverId(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Messaggio:</label>
                        <textarea
                            className="border p-2 rounded w-full"
                            rows={3}
                            placeholder="Scrivi qui..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                    >
                        Invia Messaggio
                    </button>
                </form>
            </div>

            {/* SEZIONE 2: LISTA MESSAGGI RICEVUTI */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Posta in arrivo</h2>
                {messages.length === 0 ? (
                    <p className="text-gray-500">Nessun messaggio ricevuto.</p>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className="border p-4 rounded hover:shadow-lg transition bg-white">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-blue-600">
                                    Da: {msg.sender.username} (ID: {msg.sender.id})
                                </span>
                                <span className="text-sm text-gray-500">
                                    {new Date(msg.timestamp).toLocaleString()}
                                </span>
                            </div>
                            <p className="text-gray-800">{msg.content}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MessagesPage;