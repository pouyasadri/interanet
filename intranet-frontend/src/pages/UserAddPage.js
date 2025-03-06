import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import UserForm from '../components/users/UserForm';

const UserAddPage = () => {
    const { createUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (userData) => {
        try {
            const newUser = await createUser(userData);
            if (newUser) {
                navigate('/users');
            } else {
                setError('Erreur lors de la création du collaborateur.');
            }
        } catch (err) {
            setError('Erreur lors de la création du collaborateur.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-12">
                    <div className="card shadow">
                        <div className="card-body">
                            <h2 className="card-title mb-4">Ajouter un collaborateur</h2>

                            {error && (
                                <div className="alert alert-danger mb-4">{error}</div>
                            )}

                            <UserForm onSubmit={handleSubmit} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserAddPage;
