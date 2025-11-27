import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Se l'indirizzo è /login, mostra la pagina di Login */}
                <Route path="/login" element={<LoginPage />} />

                {/* Se l'indirizzo è / (la home), mostra la Home Page */}
                <Route path="/" element={<HomePage />} />

                {/* Se l'utente scrive un indirizzo a caso (es. /pippo), riportalo al login */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;