import { useNavigate } from 'react-router-dom';

export default function HomePage() {
    const navigate = useNavigate();

    // Recuperiamo l'utente salvato (se c'è)
    const userJson = localStorage.getItem('ecohub_user');
    const user = userJson ? JSON.parse(userJson) : null;

    const handleLogout = () => {
        localStorage.removeItem('ecohub_user');
        navigate('/login');
    };

    if (!user) {
        return (
            <div style={{ padding: '20px' }}>
                <h2>Non sei loggato!</h2>
                <button onClick={() => navigate('/login')}>Vai al Login</button>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Benvenuto su EcoHub, {user.username}!</h1>
            <p>Il tuo ruolo è: <strong>{user.role}</strong></p>

            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f0f0' }}>
                <h3>Bacheca Post</h3>
                <p>Qui presto vedrai la lista dei post.</p>
            </div>

            <button
                onClick={handleLogout}
                style={{ marginTop: '20px', padding: '10px', backgroundColor: '#ff4444', color: 'white', border: 'none', cursor: 'pointer' }}
            >
                Esci (Logout)
            </button>
        </div>
    );
}