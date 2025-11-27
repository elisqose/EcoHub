import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); // Resetta errori precedenti

        try {
            // Chiamata al Back-End Spring Boot
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                throw new Error('Credenziali errate');
            }

            const user: User = await response.json();

            // Salva l'utente nel browser
            localStorage.setItem('ecohub_user', JSON.stringify(user));

            // Vai alla Home
            navigate('/');

        } catch (err) {
            setError('Login fallito. Controlla username e password.');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <div style={{ width: '300px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
                <h2>Accedi a EcoHub</h2>
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ width: '100%', padding: '8px' }}
                            required
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '8px' }}
                            required
                        />
                    </div>

                    <button type="submit" style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>
                        Login
                    </button>

                    {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
                </form>
            </div>
        </div>
    );
}