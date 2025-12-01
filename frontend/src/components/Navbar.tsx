import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types';

interface NavbarProps {
    user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Gestione ridimensionamento finestra per la responsività
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <nav style={{
            backgroundColor: 'white',
            padding: isMobile ? '10px' : '15px 20px', // Meno padding su mobile
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row', // Colonna su mobile, Riga su PC
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            gap: isMobile ? '10px' : '0' // Spazio tra le righe su mobile
        }}>

            {/* SINISTRA: Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'center' : 'flex-start' }}>
                <h2
                    style={{ color: '#2e7d32', margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: isMobile ? '22px' : '24px' }}
                    onClick={() => navigate('/feed')}
                    title="Torna alla Home"
                >
                    🌱 EcoHub
                </h2>

                {/* Tasto Moderatore (Solo se admin) */}
                {user?.role === 'MODERATOR' && !isMobile && (
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
                        🛡️ Mod
                    </button>
                )}
            </div>

            {/* DESTRA: Azioni Utente */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: isMobile ? '8px' : '15px',
                flexWrap: isMobile ? 'wrap' : 'nowrap', // Permette ai bottoni di andare a capo su mobile
                justifyContent: isMobile ? 'center' : 'flex-end',
                width: isMobile ? '100%' : 'auto'
            }}>

                {/* Tasto Moderatore (Su mobile lo metto qui per comodità) */}
                {user?.role === 'MODERATOR' && isMobile && (
                    <button
                        onClick={() => navigate('/moderation')}
                        style={{ backgroundColor: '#ff9800', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
                    >
                        🛡️ Mod
                    </button>
                )}

                {/* Cerca */}
                <button
                    onClick={() => navigate('/search-users')}
                    style={{
                        backgroundColor: 'transparent',
                        color: '#555',
                        border: '1px solid #ccc',
                        padding: isMobile ? '6px 10px' : '8px 15px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: isMobile ? '12px' : '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}
                >
                    🔍 {isMobile ? '' : 'Cerca'}
                </button>

                {/* Nuovo Post */}
                <button
                    onClick={() => navigate('/create-post')}
                    style={{
                        backgroundColor: '#2e7d32',
                        color: 'white',
                        border: 'none',
                        padding: isMobile ? '6px 10px' : '8px 15px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: isMobile ? '12px' : '14px',
                        boxShadow: '0 2px 5px rgba(46, 125, 50, 0.2)'
                    }}
                >
                    + Post
                </button>

                {/* Messaggi */}
                <button
                    onClick={() => navigate('/messages')}
                    style={{
                        backgroundColor: '#e8f5e9',
                        color: '#2e7d32',
                        border: 'none',
                        padding: isMobile ? '6px 10px' : '8px 15px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: isMobile ? '12px' : '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}
                >
                    📩 {isMobile ? '' : 'Messaggi'}
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
                        transition: 'background-color 0.2s',
                        border: isMobile ? '1px solid #eee' : 'none'
                    }}
                    title="Vai al tuo profilo"
                >
                    {/* Nascondiamo il nome su mobile per risparmiare spazio */}
                    {!isMobile && (
                        <span style={{ color: '#555', fontSize: '14px', textTransform: 'capitalize' }}>
                            Ciao, <b>{user?.username}</b>
                        </span>
                    )}

                    {/* AVATAR */}
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
                        padding: isMobile ? '6px 10px' : '8px 12px',
                        backgroundColor: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        color: '#666',
                        fontSize: isMobile ? '12px' : '14px'
                    }}
                >
                    Esci
                </button>
            </div>
        </nav>
    );
}