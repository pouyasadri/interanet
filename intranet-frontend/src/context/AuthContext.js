import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkLoggedIn = async () => {
            if (localStorage.token) {
                setAuthToken(localStorage.token);
                try {
                    const res = await axios.get('http://localhost:8000/api/auth/me');
                    setUser(res.data.data);
                    setIsAuthenticated(true);
                } catch (err) {
                    localStorage.removeItem('token');
                    setUser(null);
                    setIsAuthenticated(false);
                }
            }
            setIsLoading(false);
        };

        checkLoggedIn();
    }, []);

    const setAuthToken = (token) => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    };

    const login = async (email, password) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        try {
            const res = await axios.post(
                'http://localhost:8000/api/auth/login',
                { email, password },
                config
            );

            localStorage.setItem('token', res.data.token);
            setAuthToken(res.data.token);
            setUser(res.data.user);
            setIsAuthenticated(true);
            return true;
        } catch (err) {
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAuthToken();
        setUser(null);
        setIsAuthenticated(false);
        window.location.href = '/login';
    };

    const updateUserDetails = async (userData) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        try {
            const res = await axios.put(
                'http://localhost:8000/api/auth/updatedetails',
                userData,
                config
            );
            setUser(res.data.data);
            return true;
        } catch (err) {
            return false;
        }
    };

    const updatePassword = async (passwords) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        try {
            await axios.put(
                'http://localhost:8000/api/auth/updatepassword',
                passwords,
                config
            );
            return true;
        } catch (err) {
            return false;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isLoading,
                login,
                logout,
                updateUserDetails,
                updatePassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
