import { useNavigate } from 'react-router-dom';
import type { User } from '../types';

interface NavbarProps {
    user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
    const navigate = useNavigate();

    const handleLogout = () => {
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

            {/* SINISTRA: Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <h2
                    style={{ color: '#2e7d32', margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                    onClick={() => navigate('/feed')}
                    title="Torna alla Home"
                >
                    🌱 EcoHub
                </h2>

                {/* Tasto Moderatore (Solo se admin) */}
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

                {/* Cerca */}
                <button
                    onClick={() => navigate('/search-users')}
                    style={{
                        backgroundColor: 'transparent',
                        color: '#555',
                        border: '1px solid #ccc',
                        padding: '8px 15px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}
                >
                    🔍 Cerca
                </button>

                {/* Nuovo Post */}
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

                {/* Messaggi */}
                <button
                    onClick={() => navigate('/messages')}
                    style={{
                        backgroundColor: '#e8f5e9',
                        color: '#2e7d32',
                        border: 'none',
                        padding: '8px 15px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}
                >
                    📩 Messaggi
                </button>

                {/* Profilo Utente (Con Foto) */}
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
                    title="Vai al tuo profilo"
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f8e9'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    {/* --- MODIFICA QUI: Aggiunto textTransform: 'capitalize' --- */}
                    <span style={{ color: '#555', fontSize: '14px', textTransform: 'capitalize' }}>
                        Ciao, <b>{user?.username}</b>
                    </span>

                    {/* AVATAR: Immagine o Iniziale */}
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#2e7d32',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        overflow: 'hidden',
                        border: '1px solid #e8f5e9'
                    }}>
                        {user?.profilePicture ? (
                            <img
                                src={user.profilePicture}
                                alt="avatar"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            user?.username ? user.username.charAt(0).toUpperCase() : '?'
                        )}
                    </div>
                </div>

                {/* Logout */}
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
                >
                    Esci
                </button>
            </div>
        </nav>
    );
}