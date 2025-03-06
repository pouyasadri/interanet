import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../context/UserContext';
import UserForm from '../components/users/UserForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const UserEditPage = () => {
    const { id } = useParams();
    const { updateUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/users/${id}`);
                setUser(res.data.data);
                setLoading(false);
            } catch (err) {
                setError('Erreur lors du chargement du collaborateur');
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    const handleSubmit = async (userData) => {
        try {
            const updatedUser = await updateUser(id, userData);
            if (updatedUser) {
                navigate('/users');
            } else {
                setError('Erreur lors de la mise à jour du collaborateur.');
            }
        } catch (err) {
            setError('Erreur lors de la mise à jour du collaborateur.');
        }
    };

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <FontAwesomeIcon icon={faSpinner} spin size="3x" />
                <p className="mt-3">Chargement du collaborateur...</p>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-12">
                    <div className="card shadow">
                        <div className="card-body">
                            <h2 className="card-title mb-4">Modifier le collaborateur</h2>

                            {error && (
                                <div className="alert alert-danger mb-4">{error}</div>
                            )}

                            {user ? (
                                <UserForm user={user} onSubmit={handleSubmit} isEdit={true} />
                            ) : (
                                <div className="alert alert-danger">
                                    Collaborateur non trouvé
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserEditPage;
