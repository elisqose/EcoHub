import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { User } from '../types';

interface UserListProps {
    title: string;
    users: User[];
    currentUserId: number;
    profileOwnerId: number;
    listType: 'FOLLOWERS' | 'FOLLOWING';
    onClose: () => void;
}

export default function UserList({ title, users, currentUserId, profileOwnerId, listType, onClose }: UserListProps) {
    const navigate = useNavigate();
    const isMyProfile = currentUserId === profileOwnerId;

    const handleRemove = async (e: React.MouseEvent, userInList: User) => {
        e.stopPropagation(); // Evita di aprire il profilo cliccando il bottone

        if (!confirm("Sei sicuro?")) return;

        try {
            if (listType === 'FOLLOWING') {
                // Smetto di seguire questa persona
                await api.unfollow(currentUserId, userInList.id);
            } else {
                // Rimuovo questa persona dai miei follower
                await api.removeFollower(currentUserId, userInList.id);
            }
            alert("Fatto! Chiudi e riapri per vedere le modifiche.");
            // In un'app reale aggiorneremmo lo stato locale qui, ma per semplicità va bene ricaricare al close
        } catch (err) {
            alert("Errore rimozione");
        }
    };

    return (
        <div
            style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000
            }}
            onClick={onClose}
        >
            <div
                style={{
                    backgroundColor: 'white', padding: '20px', borderRadius: '8px',
                    width: '90%', maxWidth: '400px', maxHeight: '80vh', overflowY: 'auto'
                }}
                onClick={e => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <h3 style={{ margin: 0, color: '#2e7d32' }}>{title}</h3>
                    <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>&times;</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {users.map(user => (
                        <div
                            key={user.id}
                            onClick={() => { navigate(`/profile/${user.id}`); onClose(); }}
                            style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '8px', borderRadius: '8px', cursor: 'pointer', border: '1px solid #eee'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{
                                    width: '35px', height: '35px', borderRadius: '50%',
                                    backgroundColor: '#2e7d32', color: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                                }}>
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                                <span>@{user.username}</span>
                            </div>

                            {/* Mostra bottone rimozione SOLO se sono sul MIO profilo */}
                            {isMyProfile && (
                                <button
                                    onClick={(e) => handleRemove(e, user)}
                                    style={{
                                        backgroundColor: '#ffebee', color: '#c62828',
                                        border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px'
                                    }}
                                >
                                    {listType === 'FOLLOWING' ? 'Unfollow' : 'Rimuovi'}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}