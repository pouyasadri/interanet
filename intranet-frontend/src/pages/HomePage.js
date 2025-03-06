import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUserPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const HomePage = () => {
    const { user } = useContext(AuthContext);
    const [randomUser, setRandomUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const usersResponse = await axios.get('http://localhost:8000/api/users', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setTotalUsers(usersResponse.data.count || 0);

                const randomResponse = await axios.get('http://localhost:8000/api/users/random', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (randomResponse.data.success) {
                    setRandomUser(randomResponse.data.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getNewRandomUser = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8000/api/users/random', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.success) {
                setRandomUser(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching random user:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row mb-4">
                <div className="col-md-12">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title">Bienvenue, {user?.firstname}!</h2>
                            <p className="card-text">
                                Explorez notre plateforme intranet pour découvrir et connecter avec vos collègues.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h3 className="card-title">
                                <FontAwesomeIcon icon={faUsers} className="me-2 text-primary" />
                                Statistiques
                            </h3>
                            <hr />
                            <div className="d-flex justify-content-around text-center">
                                <div>
                                    <h4>{totalUsers}</h4>
                                    <p className="text-muted">Collaborateurs</p>
                                </div>
                                <div>
                                    <h4>{user?.isAdmin ? 'Oui' : 'Non'}</h4>
                                    <p className="text-muted">Administrateur</p>
                                </div>
                            </div>
                            <div className="d-grid gap-2 mt-3">
                                <Link to="/users" className="btn btn-outline-primary">
                                    Voir tous les collaborateurs
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h3 className="card-title">Collègue aléatoire</h3>
                            <hr />
                            {loading ? (
                                <div className="text-center py-5">
                                    <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                                    <p className="mt-2">Chargement...</p>
                                </div>
                            ) : randomUser ? (
                                <div className="text-center">
                                    <img
                                        src={randomUser.photo}
                                        alt={`${randomUser.firstname} ${randomUser.lastname}`}
                                        className="rounded-circle img-fluid mb-3"
                                        style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                    />
                                    <h4>
                                        {randomUser.firstname} {randomUser.lastname}
                                    </h4>
                                    <p className="text-muted">{randomUser.category}</p>
                                    <p>
                                        <strong>Email:</strong> {randomUser.email}
                                    </p>
                                    <p>
                                        <strong>Localisation:</strong> {randomUser.city}, {randomUser.country}
                                    </p>
                                    <button
                                        onClick={getNewRandomUser}
                                        className="btn btn-primary mt-2"
                                    >
                                        Découvrir un autre collègue
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-5">
                                    <p>Aucun collègue trouvé</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {user?.isAdmin && (
                <div className="row">
                    <div className="col-md-12">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h3 className="card-title">
                                    <FontAwesomeIcon icon={faUserPlus} className="me-2 text-primary" />
                                    Administration
                                </h3>
                                <hr />
                                <p>
                                    En tant qu'administrateur, vous pouvez gérer tous les collaborateurs de la plateforme.
                                </p>
                                <div className="d-grid gap-2">
                                    <Link to="/users/add" className="btn btn-success">
                                        Ajouter un nouveau collaborateur
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
