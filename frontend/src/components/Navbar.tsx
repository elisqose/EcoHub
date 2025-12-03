import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types';

interface NavbarProps {
    user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    const commonButtonStyle = {
        height: isMobile ? '34px' : '40px',
        padding: isMobile ? '0 10px' : '0 20px',
        borderRadius: '20px',
        cursor: 'pointer',
        fontWeight: 'bold' as const,
        fontSize: isMobile ? '12px' : '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        whiteSpace: 'nowrap' as const
    };

    return (
        <nav style={{
            backgroundColor: 'white',
            padding: isMobile ? '10px' : '15px 20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            gap: isMobile ? '10px' : '0'
        }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'center' : 'flex-start' }}>
                <h2
                    style={{ color: '#2e7d32', margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: isMobile ? '22px' : '24px' }}
                    onClick={() => navigate('/feed')}
                    title="Torna alla Home"
                >
                    🌱 EcoHub
                </h2>

                {user?.role === 'MODERATOR' && !isMobile && (
                    <button
                        onClick={() => navigate('/moderation')}
                        style={{
                            ...commonButtonStyle,
                            backgroundColor: '#ff9800',
                            color: 'white',
                            border: '1px solid transparent',
                        }}
                    >
                        🛡️ Moderazione
                    </button>
                )}
            </div>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: isMobile ? '8px' : '12px',
                flexWrap: isMobile ? 'wrap' : 'nowrap',
                justifyContent: isMobile ? 'center' : 'flex-end',
                width: isMobile ? '100%' : 'auto'
            }}>

                {user?.role === 'MODERATOR' && isMobile && (
                    <button
                        onClick={() => navigate('/moderation')}
                        style={{
                            ...commonButtonStyle,
                            backgroundColor: '#ff9800',
                            color: 'white',
                            border: '1px solid transparent',
                        }}
                    >
                        🛡️ Mod
                    </button>
                )}

                <button
                    onClick={() => navigate('/search-users')}
                    style={{
                        ...commonButtonStyle,
                        backgroundColor: 'transparent',
                        color: '#555',
                        border: '1px solid #ccc',
                    }}
                >
                    🔍 {isMobile ? '' : 'Cerca'}
                </button>

                <button
                    onClick={() => navigate('/create-post')}
                    style={{
                        ...commonButtonStyle,
                        backgroundColor: '#2e7d32',
                        color: 'white',
                        border: '1px solid transparent',
                        boxShadow: '0 2px 5px rgba(46, 125, 50, 0.2)'
                    }}
                >
                    <span style={{ fontSize: '16px', lineHeight: 1 }}>+</span>
                    {isMobile ? 'Post' : 'Nuovo Post'}
                </button>

                <button
                    onClick={() => navigate('/messages')}
                    style={{
                        ...commonButtonStyle,
                        backgroundColor: '#e8f5e9',
                        color: '#2e7d32',
                        border: '1px solid transparent',
                    }}
                >
                    📩 {isMobile ? '' : 'Messaggi'}
                </button>

                <div
                    onClick={() => navigate('/profile')}
                    style={{
                        ...commonButtonStyle,
                        backgroundColor: 'transparent',
                        border: isMobile ? '1px solid #eee' : '1px solid transparent',
                        padding: '0 5px',
                        gap: '8px'
                    }}
                    title="Vai al tuo profilo"
                >
                    {!isMobile && (
                        <span style={{ color: '#555', fontSize: '14px', textTransform: 'capitalize' }}>
                            Ciao, <b>{user?.username}</b>
                        </span>
                    )}

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
                        border: '1px solid #e8f5e9',
                        flexShrink: 0
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

                <button
                    onClick={handleLogout}
                    style={{
                        ...commonButtonStyle,
                        backgroundColor: 'white',
                        border: '1px solid #ddd',
                        color: '#666',
                        padding: isMobile ? '0 10px' : '0 15px'
                    }}
                >
                    Esci
                </button>
            </div>
        </nav>
    );
}