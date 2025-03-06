import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import AuthContext from './context/AuthContext';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import HomePage from './pages/HomePage';
import LoginPage from './components/auth/Login';
import UsersPage from './pages/UsersPage';
import UserAddPage from './pages/UserAddPage';
import UserEditPage from './pages/UserEditPage';
import ProfilePage from './pages/ProfilePage';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
    const { user, isAuthenticated } = useContext(AuthContext);

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (!user || !user.isAdmin) {
        return <Navigate to="/" />;
    }

    return children;
};

function AppContent() {
    return (
        <Router>
            <Header />
            <main className="min-vh-100">
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <HomePage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/users"
                        element={
                            <PrivateRoute>
                                <UsersPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/users/add"
                        element={
                            <PrivateRoute>
                                <AdminRoute>
                                    <UserAddPage />
                                </AdminRoute>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/users/edit/:id"
                        element={
                            <PrivateRoute>
                                <AdminRoute>
                                    <UserEditPage />
                                </AdminRoute>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <PrivateRoute>
                                <ProfilePage />
                            </PrivateRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
            <Footer />
        </Router>
    );
}

function App() {
    return (
        <AuthProvider>
            <UserProvider>
                <AppContent />
            </UserProvider>
        </AuthProvider>
    );
}

export default App;
