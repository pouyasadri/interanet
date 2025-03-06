import React, {useState, useEffect} from 'react';

const UserForm = ({user = {}, onSubmit, isEdit = false}) => {
    const [formData, setFormData] = useState({
        gender: user.gender || 'male',
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        email: user.email || '',
        password: '',
        phone: user.phone || '',
        birthdate: user.birthdate ? user.birthdate.substring(0, 10) : '',
        city: user.city || '',
        country: user.country || '',
        photo: user.photo || '',
        category: user.category || 'Marketing',
        isAdmin: user.isAdmin || false,
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isEdit && user) {
            setFormData({
                gender: user.gender || 'male',
                firstname: user.firstname || '',
                lastname: user.lastname || '',
                email: user.email || '',
                password: '',
                phone: user.phone || '',
                birthdate: user.birthdate ? new Date(user.birthdate).toISOString().substring(0, 10) : '',
                city: user.city || '',
                country: user.country || '',
                photo: user.photo || '',
                category: user.category || 'Marketing',
                isAdmin: user.isAdmin || false,
            });
        }
    }, [user, isEdit]);

    const {
        gender,
        firstname,
        lastname,
        email,
        password,
        phone,
        birthdate,
        city,
        country,
        photo,
        category,
        isAdmin,
    } = formData;

    const onChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.name === 'isAdmin' ? e.target.checked : e.target.value,
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!firstname) newErrors.firstname = 'Le prénom est requis';
        if (!lastname) newErrors.lastname = 'Le nom est requis';
        if (!email) newErrors.email = 'L\'email est requis';
        if (!isEdit && !password) newErrors.password = 'Le mot de passe est requis';
        if (!phone) newErrors.phone = 'Le téléphone est requis';
        if (!birthdate) newErrors.birthdate = 'La date de naissance est requise';
        if (!city) newErrors.city = 'La ville est requise';
        if (!country) newErrors.country = 'Le pays est requis';
        if (!photo) newErrors.photo = 'La photo est requise';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSubmitForm = (e) => {
        e.preventDefault();
        if (validateForm()) {
            if (isEdit && !password) {
                const {password, ...rest} = formData;
                onSubmit(rest);
            } else {
                onSubmit(formData);
            }
        }
    };

    return (
        <form onSubmit={onSubmitForm}>
            <div className="row g-3">
                <div className="col-md-6">
                    <label htmlFor="firstname" className="form-label">
                        Prénom
                    </label>
                    <input
                        type="text"
                        className={`form-control ${errors.firstname ? 'is-invalid' : ''}`}
                        id="firstname"
                        name="firstname"
                        value={firstname}
                        onChange={onChange}
                    />
                    {errors.firstname && <div className="invalid-feedback">{errors.firstname}</div>}
                </div>

                <div className="col-md-6">
                    <label htmlFor="lastname" className="form-label">
                        Nom
                    </label>
                    <input
                        type="text"
                        className={`form-control ${errors.lastname ? 'is-invalid' : ''}`}
                        id="lastname"
                        name="lastname"
                        value={lastname}
                        onChange={onChange}
                    />
                    {errors.lastname && <div className="invalid-feedback">{errors.lastname}</div>}
                </div>

                <div className="col-md-6">
                    <label htmlFor="email" className="form-label">
                        Email
                    </label>
                    <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        id="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="col-md-6">
                    <label htmlFor="password" className="form-label">
                        {isEdit ? 'Mot de passe (laisser vide pour ne pas modifier)' : 'Mot de passe'}
                    </label>
                    <input
                        type="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        id="password"
                        name="password"
                        value={password}
                        onChange={onChange}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>

                <div className="col-md-6">
                    <label htmlFor="phone" className="form-label">
                        Téléphone
                    </label>
                    <input
                        type="text"
                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                        id="phone"
                        name="phone"
                        value={phone}
                        onChange={onChange}
                    />
                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                </div>

                <div className="col-md-6">
                    <label htmlFor="birthdate" className="form-label">
                        Date de naissance
                    </label>
                    <input
                        type="date"
                        className={`form-control ${errors.birthdate ? 'is-invalid' : ''}`}
                        id="birthdate"
                        name="birthdate"
                        value={birthdate}
                        onChange={onChange}
                    />
                    {errors.birthdate && <div className="invalid-feedback">{errors.birthdate}</div>}
                </div>

                <div className="col-md-6">
                    <label htmlFor="city" className="form-label">
                        Ville
                    </label>
                    <input
                        type="text"
                        className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                        id="city"
                        name="city"
                        value={city}
                        onChange={onChange}
                    />
                    {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                </div>

                <div className="col-md-6">
                    <label htmlFor="country" className="form-label">
                        Pays
                    </label>
                    <input
                        type="text"
                        className={`form-control ${errors.country ? 'is-invalid' : ''}`}
                        id="country"
                        name="country"
                        value={country}
                        onChange={onChange}
                    />
                    {errors.country && <div className="invalid-feedback">{errors.country}</div>}
                </div>

                <div className="col-md-6">
                    <label htmlFor="gender" className="form-label">
                        Genre
                    </label>
                    <select
                        className="form-select"
                        id="gender"
                        name="gender"
                        value={gender}
                        onChange={onChange}
                    >
                        <option value="male">Homme</option>
                        <option value="female">Femme</option>
                    </select>
                </div>

                <div className="col-md-6">
                    <label htmlFor="category" className="form-label">
                        Catégorie
                    </label>
                    <select
                        className="form-select"
                        id="category"
                        name="category"
                        value={category}
                        onChange={onChange}
                    >
                        <option value="Marketing">Marketing</option>
                        <option value="Technique">Technique</option>
                        <option value="Client">Client</option>
                    </select>
                </div>

                <div className="col-12">
                    <label htmlFor="photo" className="form-label">
                        URL de la photo
                    </label>
                    <input
                        type="text"
                        className={`form-control ${errors.photo ? 'is-invalid' : ''}`}
                        id="photo"
                        name="photo"
                        value={photo}
                        onChange={onChange}
                    />
                    {errors.photo && <div className="invalid-feedback">{errors.photo}</div>}
                </div>

                {photo && (
                    <div className="col-12 mb-3">
                        <img
                            src={photo}
                            alt="Photo preview"
                            className="img-thumbnail mt-2"
                            style={{maxHeight: '150px'}}
                        />
                    </div>
                )}

                <div className="col-12">
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="isAdmin"
                            name="isAdmin"
                            checked={isAdmin}
                            onChange={onChange}
                        />
                        <label className="form-check-label" htmlFor="isAdmin">
                            Administrateur
                        </label>
                    </div>
                </div>
            </div>

            <div className="d-grid gap-2 mt-4">
                <button type="submit" className="btn btn-primary">
                    {isEdit ? 'Mettre à jour' : 'Créer le collaborateur'}
                </button>
            </div>
        </form>
    );
};

export default UserForm;
