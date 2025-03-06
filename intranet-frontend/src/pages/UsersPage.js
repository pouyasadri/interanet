import React, { useState, useEffect } from 'react';
import UserCard from '../components/users/UserCard';
import UserFilter from '../components/users/UserFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8000/api/users', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.success) {
                setUsers(response.data.data);
                setFilteredUsers(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = async (filters) => {
        setLoading(true);

        try {
            const { name, location, category } = filters;

            if (!name && !location && !category) {
                // If no filters are applied, show all users
                setFilteredUsers(users);
                setLoading(false);
                return;
            }

            let queryString = 'http://localhost:8000/api/users/filter?';
            if (name) queryString += `name=${name}&`;
            if (location) queryString += `location=${location}&`;
            if (category) queryString += `category=${category}`;

            const response = await axios.get(queryString, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.success) {
                setFilteredUsers(response.data.data);
            }
        } catch (error) {
            console.error('Error filtering users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (userId) => {
        setUserToDelete(userId);
        setShowConfirmation(true);
    };

    const confirmDelete = async () => {
        if (userToDelete) {
            setLoading(true);
            try {
                await axios.delete(`http://localhost:8000/api/users/${userToDelete}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                await fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
            } finally {
                setShowConfirmation(false);
                setUserToDelete(null);
                setLoading(false);
            }
        }
    };

    const cancelDelete = () => {
        setShowConfirmation(false);
        setUserToDelete(null);
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Nos Collaborateurs</h2>

            <UserFilter onFilter={handleFilter} />

            {loading ? (
                <div className="text-center py-5">
                    <FontAwesomeIcon icon={faSpinner} spin size="3x" />
                    <p className="mt-3">Chargement des collaborateurs...</p>
                </div>
            ) : (
                <>
                    {filteredUsers.length === 0 ? (
                        <div className="alert alert-info">
                            Aucun collaborateur trouvé pour ces critères.
                        </div>
                    ) : (
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                            {filteredUsers.map((user) => (
                                <UserCard
                                    key={user._id}
                                    user={user}
                                    onDelete={handleDeleteClick}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}

            {showConfirmation && (
                <div className="modal-container position-fixed top-0 start-0 w-100 h-100"
                     style={{ zIndex: 1050 }}>
                    <div className="modal-backdrop fade show"
                         onClick={cancelDelete}
                         style={{ zIndex: 1040 }}></div>
                    <div className="modal fade show d-block"
                         style={{ zIndex: 1050 }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirmation</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={cancelDelete}
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p>Êtes-vous sûr de vouloir supprimer ce collaborateur ?</p>
                                    <p className="text-danger">Cette action est irréversible.</p>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={cancelDelete}
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={confirmDelete}
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersPage;
