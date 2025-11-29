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
        <nav style={{ backgroundColor: 'white', padding: '15px 20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 1000 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <h2 style={{ color: '#2e7d32', margin: 0, cursor: 'pointer' }} onClick={() => navigate('/feed')}>EcoHub 🌱</h2>
                {user?.role === 'MODERATOR' && (
                    <button onClick={() => navigate('/moderation')} style={{ backgroundColor: '#ff9800', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                        🛡️ Area Moderatore
                    </button>
                )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button onClick={() => navigate('/create-post')} style={{ backgroundColor: '#2e7d32', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
                    + Nuovo Post
                </button>
                <span style={{ color: '#555' }}>Ciao, <b>{user?.username}</b></span>
                <button onClick={handleLogout} style={{ padding: '8px 12px', backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>Esci</button>
            </div>
        </nav>
    );
}