import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        bio: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await api.register(formData);
            alert("Registrazione completata! Ora puoi accedere.");
            navigate('/login');
        } catch (err: any) {
            console.error(err);
            setError("Errore durante la registrazione. Username potrebbe essere già in uso.");
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5'}}>
            <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', color: '#2e7d32', marginBottom: '20px' }}>Crea Account 🌱</h2>

                {error && <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input
                        type="text" placeholder="Username" required
                        value={formData.username}
                        onChange={e => setFormData({...formData, username: e.target.value})}
                        style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <input
                        type="email" placeholder="Email" required
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <input
                        type="password" placeholder="Password" required
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <textarea
                        placeholder="Parlaci un po' di te (Bio opzionale)"
                        value={formData.bio}
                        onChange={e => setFormData({...formData, bio: e.target.value})}
                        style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'inherit' }}
                    />

                    <button type="submit" style={{ padding: '12px', backgroundColor: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
                        Registrati
                    </button>
                </form>

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <a href="/login" style={{ color: '#666', textDecoration: 'none', fontSize: '14px' }}>Hai già un account? Accedi</a>
                </div>
            </div>
        </div>
    );
}