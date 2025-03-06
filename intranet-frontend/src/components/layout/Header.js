import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Header = () => {
    const { isAuthenticated, logout, user } = useContext(AuthContext);
    const handleLogout = (e) => {
        e.preventDefault();
        logout();
    };
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    Intranet
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    {isAuthenticated ? (
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">
                                    Accueil
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/users">
                                    Collaborateurs
                                </Link>
                            </li>
                            {user && user.isAdmin && (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/users/add">
                                        Ajouter un collaborateur
                                    </Link>
                                </li>
                            )}
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    id="navbarDropdown"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <img
                                        src={user?.photo}
                                        alt="Profile"
                                        className="rounded-circle"
                                        width="30"
                                        height="30"
                                    />
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                    <li>
                                        <Link className="dropdown-item" to="/profile">
                                            Mon profil
                                        </Link>
                                    </li>
                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>
                                    <li>
                                        <button className="dropdown-item" onClick={handleLogout}>
                                            Déconnexion
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    ) : (
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">
                                    Connexion
                                </Link>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Header;
