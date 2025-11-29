import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import CreatePostPage from './pages/CreatePostPage';
import ModeratorPage from './pages/ModeratorPage';
import UserProfilePage from './pages/UserProfilePage';
import MessagesPage from './pages/MessagesPage'; // <--- 1. Importiamo la nuova pagina dei messaggi

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Redirect iniziale */}
                <Route path="/" element={<Navigate to="/login" />} />

                {/* Pagine esistenti */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/feed" element={<HomePage />} />
                <Route path="/create-post" element={<CreatePostPage />} />
                <Route path="/moderation" element={<ModeratorPage />} />
                <Route path="/profile" element={<UserProfilePage />} />

                {/* --- 2. Aggiungiamo la rotta per i messaggi --- */}
                <Route path="/messages" element={<MessagesPage />} />
                {/* --------------------------------------------- */}

                {/* Fallback per rotte sconosciute */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;