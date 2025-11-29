import { useNavigate } from 'react-router-dom';
import type { User } from '../types';

interface NavbarProps {
    user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Rimuoviamo l'utente salvato e torniamo alla home/login
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <nav style={{
            backgroundColor: 'white',
            padding: '15px 20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>

            {/* SINISTRA: Logo e Bottone Moderazione */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <h2
                    style={{ color: '#2e7d32', margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                    onClick={() => navigate('/feed')}
                    title="Torna alla Home"
                >
                    EcoHub 🌱
                </h2>

                {/* Mostra questo bottone SOLO se l'utente è un Moderatore */}
                {user?.role === 'MODERATOR' && (
                    <button
                        onClick={() => navigate('/moderation')}
                        style={{
                            backgroundColor: '#ff9800',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '14px',
                            fontWeight: 'bold'
                        }}
                    >
                        🛡️ Area Moderatore
                    </button>
                )}
            </div>

            {/* DESTRA: Azioni Utente */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>

                {/* Bottone Crea Nuovo Post */}
                <button
                    onClick={() => navigate('/create-post')}
                    style={{
                        backgroundColor: '#2e7d32',
                        color: 'white',
                        border: 'none',
                        padding: '8px 15px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 5px rgba(46, 125, 50, 0.2)'
                    }}
                >
                    + Nuovo Post
                </button>

                {/* Link al Profilo (Cliccabile) */}
                <div
                    onClick={() => navigate('/profile')}
                    style={{
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '5px 10px',
                        borderRadius: '20px',
                        transition: 'background-color 0.2s'
                    }}
                    title="Vai al tuo profilo personale"
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f8e9'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    <span style={{ color: '#555', fontSize: '14px' }}>Ciao, <b>{user?.username}</b></span>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: '#2e7d32',
                        borderRadius: '50%',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 'bold'
                    }}>
                        {user?.username ? user.username.charAt(0).toUpperCase() : '?'}
                    </div>
                </div>

                {/* Bottone Esci */}
                <button
                    onClick={handleLogout}
                    style={{
                        padding: '8px 12px',
                        backgroundColor: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        color: '#666',
                        fontSize: '14px'
                    }}
                    title="Disconnetti"
                >
                    Esci
                </button>
            </div>
        </nav>
    );
}