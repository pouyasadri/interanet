import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';

const ProfilePage = () => {
    const { user, updateUserDetails, updatePassword } = useContext(AuthContext);
    const [profileData, setProfileData] = useState({
        firstname: user?.firstname || '',
        lastname: user?.lastname || '',
        email: user?.email || '',
        phone: user?.phone || '',
        city: user?.city || '',
        country: user?.country || '',
        photo: user?.photo || '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [profileSuccess, setProfileSuccess] = useState('');
    const [profileError, setProfileError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleProfileChange = (e) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value,
        });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setProfileSuccess('');
        setProfileError('');

        try {
            const success = await updateUserDetails(profileData);
            if (success) {
                setProfileSuccess('Profil mis à jour avec succès');
            } else {
                setProfileError('Erreur lors de la mise à jour du profil');
            }
        } catch (error) {
            setProfileError('Erreur lors de la mise à jour du profil');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordSuccess('');
        setPasswordError('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('Les mots de passe ne correspondent pas');
            return;
        }

        try {
            const success = await updatePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });

            if (success) {
                setPasswordSuccess('Mot de passe mis à jour avec succès');
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            } else {
                setPasswordError('Erreur lors de la mise à jour du mot de passe');
            }
        } catch (error) {
            setPasswordError('Erreur lors de la mise à jour du mot de passe');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-4 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-body text-center">
                            <img
                                src={user?.photo || 'https://via.placeholder.com/150'}
                                alt="Profile"
                                className="rounded-circle img-fluid mb-3"
                                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                            />
                            <h3>{user?.firstname} {user?.lastname}</h3>
                            <p className="text-muted">{user?.category}</p>
                            <p>
                                <strong>Email:</strong> {user?.email}
                            </p>
                            <p>
                                <strong>Téléphone:</strong> {user?.phone}
                            </p>
                            <p>
                                <strong>Localisation:</strong> {user?.city}, {user?.country}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-md-8">
                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h4 className="card-title mb-4">Mettre à jour le profil</h4>

                            {profileSuccess && (
                                <div className="alert alert-success">{profileSuccess}</div>
                            )}

                            {profileError && (
                                <div className="alert alert-danger">{profileError}</div>
                            )}

                            <form onSubmit={handleProfileSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label htmlFor="firstname" className="form-label">Prénom</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="firstname"
                                            name="firstname"
                                            value={profileData.firstname}
                                            onChange={handleProfileChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="lastname" className="form-label">Nom</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="lastname"
                                            name="lastname"
                                            value={profileData.lastname}
                                            onChange={handleProfileChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            value={profileData.email}
                                            onChange={handleProfileChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="phone" className="form-label">Téléphone</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="phone"
                                            name="phone"
                                            value={profileData.phone}
                                            onChange={handleProfileChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="city" className="form-label">Ville</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="city"
                                            name="city"
                                            value={profileData.city}
                                            onChange={handleProfileChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="country" className="form-label">Pays</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="country"
                                            name="country"
                                            value={profileData.country}
                                            onChange={handleProfileChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label htmlFor="photo" className="form-label">URL de la photo</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="photo"
                                            name="photo"
                                            value={profileData.photo}
                                            onChange={handleProfileChange}
                                            required
                                        />
                                    </div>

                                    {profileData.photo && (
                                        <div className="col-12">
                                            <img
                                                src={profileData.photo}
                                                alt="Photo preview"
                                                className="img-thumbnail mt-2"
                                                style={{ maxHeight: '100px' }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="d-grid gap-2 mt-4">
                                    <button type="submit" className="btn btn-primary">
                                        Mettre à jour le profil
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h4 className="card-title mb-4">Changer de mot de passe</h4>

                            {passwordSuccess && (
                                <div className="alert alert-success">{passwordSuccess}</div>
                            )}

                            {passwordError && (
                                <div className="alert alert-danger">{passwordError}</div>
                            )}

                            <form onSubmit={handlePasswordSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="currentPassword" className="form-label">Mot de passe actuel</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="currentPassword"
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="newPassword" className="form-label">Nouveau mot de passe</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="newPassword"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="confirmPassword" className="form-label">Confirmer le mot de passe</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                </div>

                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary">
                                        Changer le mot de passe
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
