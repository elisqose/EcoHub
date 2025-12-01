import { useNavigate } from 'react-router-dom';
import type { User } from '../types';

interface UserListProps {
    title: string;
    users: User[];
    onClose: () => void;
}

export default function UserList({ title, users, onClose }: UserListProps) {
    const navigate = useNavigate();

    return (
        // Overlay scuro sfondo
        <div
            style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                zIndex: 2000
            }}
            onClick={onClose}
        >
            {/* Contenuto Modale */}
            <div
                style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    width: '90%',
                    maxWidth: '400px',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    display: 'flex', flexDirection: 'column'
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                    <h3 style={{ margin: 0, color: '#2e7d32' }}>{title}</h3>
                    <button
                        onClick={onClose}
                        style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#888', lineHeight: 1 }}
                    >
                        &times;
                    </button>
                </div>

                {/* Lista Utenti */}
                {users.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>Nessun utente trovato.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {users.map(user => (
                            <div
                                key={user.id}
                                onClick={() => {
                                    navigate(`/profile/${user.id}`);
                                    onClose();
                                }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                    padding: '8px', borderRadius: '8px',
                                    cursor: 'pointer', transition: 'background-color 0.2s',
                                    border: '1px solid transparent'
                                }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f8e9'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                {/* Avatar */}
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '50%',
                                    backgroundColor: '#2e7d32', color: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 'bold', fontSize: '16px'
                                }}>
                                    {user.username.charAt(0).toUpperCase()}
                                </div>

                                {/* Info */}
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontWeight: 'bold', color: '#333' }}>@{user.username}</span>
                                    <span style={{ fontSize: '12px', color: '#888' }}>{user.email}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}