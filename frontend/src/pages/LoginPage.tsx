import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { User } from '../types';

export default function LoginPage() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        try {
            const user: User = await api.login(username, password);
            localStorage.setItem('user', JSON.stringify(user));
            navigate('/feed');
        } catch (err) {
            console.error("Errore di login:", err);
            setError('Credenziali non valide o errore del server.');
        }
    };

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh', 
            backgroundColor: '#f0f2f5',
            fontFamily: 'Arial, sans-serif'
        }}>
            <div style={{ 
                padding: '40px', 
                backgroundColor: 'white', 
                borderRadius: '8px', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                width: '100%',
                maxWidth: '400px'
            }}>
                <h1 style={{ textAlign: 'center', color: '#2e7d32', marginBottom: '10px' }}>EcoHub 🌱</h1>
                <h2 style={{ textAlign: 'center', color: '#555', marginBottom: '30px', fontSize: '18px' }}>Accedi alla Community</h2>
                
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <input 
                            type="text" 
                            placeholder="Username" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ 
                                width: '100%', 
                                padding: '12px', 
                                borderRadius: '4px', 
                                border: '1px solid #ccc',
                                boxSizing: 'border-box',
                                fontSize: '16px'
                            }}
                            required
                        />
                    </div>
                    <div>
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ 
                                width: '100%', 
                                padding: '12px', 
                                borderRadius: '4px', 
                                border: '1px solid #ccc',
                                boxSizing: 'border-box',
                                fontSize: '16px'
                            }}
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        style={{ 
                            padding: '12px', 
                            backgroundColor: '#2e7d32', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px', 
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            marginTop: '10px'
                        }}
                    >
                        Entra
                    </button>
                </form>
                
                {/* Box Rosso per gli errori */}
                {error && (
                    <div style={{ 
                        marginTop: '20px', 
                        padding: '10px', 
                        backgroundColor: '#ffebee', 
                        color: '#c62828', 
                        borderRadius: '4px',
                        textAlign: 'center',
                        fontSize: '14px',
                        border: '1px solid #ef9a9a'
                    }}>
                        ⚠️ {error}
                    </div>
                )}
                
                <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '12px', color: '#888' }}>
                    <p>Non hai un account? Registrati tramite Postman:</p>
                    <code>POST /api/auth/register</code>
                </div>
            </div>
        </div>
    );
}