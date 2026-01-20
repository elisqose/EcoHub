import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function ModeratorRequestPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [motivation, setMotivation] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await api.requestModeration(username, motivation);
            alert("Richiesta inviata con successo all'amministratore! Se approvata, il tuo ruolo verrà aggiornato.");
            navigate('/login');
        } catch (err) {
            console.error(err);
            setError("Impossibile inviare la richiesta. Verifica che l'username sia corretto.");
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5'}}>
            <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '500px' }}>
                <h2 style={{ textAlign: 'center', color: '#ff9800', marginBottom: '10px' }}>Diventa Moderatore </h2>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px', fontSize: '14px' }}>
                    Aiutaci a mantenere EcoHub un posto sicuro e pulito. Compila il modulo e l'amministratore valuterà la tua richiesta.
                </p>

                {error && <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px'}}>Il tuo Username</label>
                        <input
                            type="text" required
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="Es. mario"
                            style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                        />
                    </div>

                    <div>
                        <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px'}}>Perché vuoi diventare moderatore?</label>
                        <textarea
                            required rows={5}
                            value={motivation}
                            onChange={e => setMotivation(e.target.value)}
                            placeholder="Scrivi qui le tue motivazioni..."
                            style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontFamily: 'inherit' }}
                        />
                    </div>

                    <button type="submit" style={{ padding: '12px', backgroundColor: '#ff9800', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
                        Invia Candidatura
                    </button>
                </form>

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <a href="/login" style={{ color: '#666', textDecoration: 'none', fontSize: '14px' }}>Torna al Login</a>
                </div>
            </div>
        </div>
    );
}