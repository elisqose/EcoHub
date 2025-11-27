import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// --- 1. DEFINIZIONE DEI TIPI (Types) ---

export interface User {
    id: number;
    username: string;
    email: string;
    role: 'STANDARD' | 'MODERATOR';
    bio?: string;
}

export interface Post {
    id: number;
    title: string;
    content: string;
    imageUrl?: string;
    creationDate: string;
    status: 'PENDING' | 'APPROVED' | 'REQUIRES_CHANGES' | 'REJECTED';
    moderatorNote?: string;
    author: User;
    comments: Comment[];
    tags: Tag[];
}

export interface Comment {
    id: number;
    text: string;
    creationDate: string;
    author: User;
}

export interface Tag {
    id: number;
    name: string;
}

// --- 2. SERVIZIO API (Service) ---

const API_URL = 'http://localhost:8080/api';

async function request(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`Errore API: ${response.statusText}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
}

const api = {
    // AUTENTICAZIONE
    login: (username: string, password: string) => 
        request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        }),

    register: (user: any) => 
        request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(user)
        }),

    // POSTS
    getFeed: () => request('/posts'),
    
    createPost: (post: any, userId: number, tags: string[]) => 
        request(`/posts?userId=${userId}&tags=${tags.join(',')}`, {
            method: 'POST',
            body: JSON.stringify(post)
        }),

    // UTENTI
    follow: (followerId: number, followedId: number) => 
        request(`/users/${followedId}/follow?followerId=${followerId}`, {
            method: 'POST'
        })
};

// --- 3. COMPONENTI (Pages) ---

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const user: User = await api.login(username, password);
            localStorage.setItem('user', JSON.stringify(user));
            // alert('Login effettuato! Ciao ' + user.username);
            navigate('/feed'); 
        } catch (err) {
            console.error(err);
            setError('Credenziali sbagliate o server non raggiungibile!');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-6 text-center text-green-600">EcoHub 🌱</h1>
                <h2 className="text-lg mb-4 text-center text-gray-700">Login</h2>
                
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                    <button 
                        type="submit" 
                        className="p-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                        Entra
                    </button>
                </form>
                
                {error && <p className="mt-4 text-red-500 text-sm text-center">{error}</p>}
                
                <div className="mt-4 text-center text-xs text-gray-500">
                    <p>Non hai un account? Usa il backend per registrarti o creane uno via Postman.</p>
                </div>
            </div>
        </div>
    );
}

const FeedPagePlaceholder = () => (
    <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Bacheca Principale</h2>
        <p className="text-gray-600">Benvenuto su EcoHub! Qui vedrai i post della community.</p>
        <p className="mt-2 text-sm text-gray-400">(Pagina in costruzione...)</p>
    </div>
);

// --- 4. APP PRINCIPALE (Routing) ---

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/feed" element={<FeedPagePlaceholder />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;