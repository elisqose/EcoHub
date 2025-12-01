import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import CreatePostPage from './pages/CreatePostPage';
import ModeratorPage from './pages/ModeratorPage';
import UserProfilePage from './pages/UserProfilePage';
import MessagesPage from './pages/MessagesPage'; //
import SearchUsersPage from './pages/SearchUsersPage'; //

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/feed" element={<HomePage />} />
                <Route path="/create-post" element={<CreatePostPage />} />
                <Route path="/moderation" element={<ModeratorPage />} />
                <Route path="/profile/:id" element={<UserProfilePage />} />
                <Route path="/profile" element={<UserProfilePage />} />
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/search-users" element={<SearchUsersPage />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;