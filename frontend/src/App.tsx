import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import CreatePostPage from './pages/CreatePostPage';
import ModeratorPage from './pages/ModeratorPage';
import UserProfilePage from './pages/UserProfilePage'; // <--- 1. Importiamo la pagina

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

                {/* --- 2. Aggiungiamo la rotta per il profilo --- */}
                <Route path="/profile" element={<UserProfilePage />} />
                {/* --------------------------------------------- */}

                {/* Fallback per rotte sconosciute */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;