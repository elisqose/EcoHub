import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import CreatePostPage from './pages/CreatePostPage';
import ModeratorPage from './pages/ModeratorPage';
import UserProfilePage from './pages/UserProfilePage';
import MessagesPage from './pages/MessagesPage';
import SearchUsersPage from './pages/SearchUsersPage';
import RegisterPage from './pages/RegisterPage'; // <--- Import
import ModeratorRequestPage from './pages/ModeratorRequestPage'; // <--- Import

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Redirect iniziale */}
                <Route path="/" element={<Navigate to="/login" />} />

                {/* Pagine Auth */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} /> {/* <--- Nuova Rotta */}
                <Route path="/moderator-request" element={<ModeratorRequestPage />} /> {/* <--- Nuova Rotta */}

                {/* Pagine App */}
                <Route path="/feed" element={<HomePage />} />
                <Route path="/create-post" element={<CreatePostPage />} />
                <Route path="/moderation" element={<ModeratorPage />} />
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/search-users" element={<SearchUsersPage />} />

                <Route path="/profile/:id" element={<UserProfilePage />} />
                <Route path="/profile" element={<UserProfilePage />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;