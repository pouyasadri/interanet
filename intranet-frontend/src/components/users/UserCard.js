import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';

const UserCard = ({ user, onDelete }) => {
    const { user: currentUser } = useContext(AuthContext);
    const isAdmin = currentUser?.isAdmin;

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    };

    return (
        <div className="col">
            <div className="card h-100 shadow-sm">
                <div className="position-relative">
                    <img
                        src={user.photo}
                        className="card-img-top"
                        alt={`${user.firstname} ${user.lastname}`}
                        style={{ height: '200px', objectFit: 'cover' }}
                    />
                    {isAdmin && (
                        <div className="position-absolute top-0 end-0 p-2">
                            <Link to={`/users/edit/${user._id}`} className="btn btn-sm btn-light me-1">
                                <FontAwesomeIcon icon={faPencilAlt} />
                            </Link>
                            <button className="btn btn-sm btn-light" onClick={() => onDelete(user._id)}>
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </div>
                    )}
                </div>
                <div className="card-body">
                    <h5 className="card-title">
                        {user.firstname} {user.lastname}
                    </h5>
                    <h6 className="card-subtitle mb-2 text-muted">{user.category}</h6>
                    <div className="card-text">
                        <p>
                            <strong>Email:</strong> {user.email}
                        </p>
                        <p>
                            <strong>Téléphone:</strong> {user.phone}
                        </p>
                        <p>
                            <strong>Date de naissance:</strong> {formatDate(user.birthdate)}
                        </p>
                        <p>
                            <strong>Localisation:</strong> {user.city}, {user.country}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserCard;
