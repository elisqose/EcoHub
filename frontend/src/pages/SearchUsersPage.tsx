import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import type { User } from '../types';

export default function SearchUsersPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const userString = localStorage.getItem('user');
    const currentUser: User | null = userString ? JSON.parse(userString) : null;

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            const users = await api.searchUsers(query);
            const filtered = users.filter((u: User) => u.id !== currentUser?.id);
            setResults(filtered);
        } catch (error) {
            console.error("Errore ricerca:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFollow = async (e: React.MouseEvent, userToFollow: User) => {
        e.stopPropagation();
        if (!currentUser) return alert("Devi essere loggato!");

        try {
            await api.follow(currentUser.id, userToFollow.id);
            alert(`Ora segui @${userToFollow.username}! 🎉`);
        } catch (error) {
            console.error("Errore follow:", error);
            alert("Errore durante l'operazione.");
        }
    };

    if (!currentUser) return (
        <div style={{ padding: '40px', textAlign: 'center'}}>
            <h2 style={{ color: '#2e7d32' }}>EcoHub</h2>
            <p>Devi effettuare il login per cercare utenti.</p>
            <a href="/login" style={{ color: '#2e7d32', fontWeight: 'bold' }}>Vai al login</a>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
            <Navbar user={currentUser} />

            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
                <h1 style={{ color: '#2e7d32', textAlign: 'center', marginBottom: '30px' }}>🔍 Cerca Utenti</h1>

                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            placeholder="Cerca per username..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            style={{ flex: 1, padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px' }}
                        />
                        <button
                            type="submit"
                            style={{ backgroundColor: '#2e7d32', color: 'white', border: 'none', padding: '0 25px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
                        >
                            Cerca
                        </button>
                    </form>
                </div>

                {loading && <p style={{ textAlign: 'center', color: '#666' }}>Ricerca in corso...</p>}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {results.map(user => (
                        <div
                            key={user.id}
                            onClick={() => navigate(`/profile/${user.id}`)}
                            style={{
                                backgroundColor: 'white',
                                padding: '15px',
                                borderRadius: '8px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{
                                    width: '50px', height: '50px', borderRadius: '50%',
                                    backgroundColor: '#e8f5e9', color: '#2e7d32',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '20px', fontWeight: 'bold',
                                    overflow: 'hidden', border: '1px solid #eee'
                                }}>
                                    {user.profilePicture ? (
                                        <img
                                            src={user.profilePicture}
                                            alt={user.username}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        user.username.charAt(0).toUpperCase()
                                    )}
                                </div>

                                <div>
                                    <strong style={{ display: 'block', fontSize: '18px', color: '#333' }}>@{user.username}</strong>
                                    <span style={{ color: '#888', fontSize: '14px' }}>{user.email}</span>
                                </div>
                            </div>

                            <button
                                onClick={(e) => handleFollow(e, user)}
                                style={{
                                    backgroundColor: 'white',
                                    border: '1px solid #2e7d32',
                                    color: '#2e7d32',
                                    padding: '8px 20px',
                                    borderRadius: '20px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2e7d32'; e.currentTarget.style.color = 'white'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = '#2e7d32'; }}
                            >
                                + Segui
                            </button>
                        </div>
                    ))}
                    {results.length === 0 && !loading && query && (
                        <p style={{ textAlign: 'center', color: '#999', marginTop: '20px' }}>Nessun utente trovato.</p>
                    )}
                </div>
            </div>
        </div>
    );
}