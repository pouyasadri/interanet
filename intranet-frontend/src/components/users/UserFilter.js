import React, { useState, useEffect, useCallback } from 'react';

const UserFilter = ({ onFilter }) => {
    const [filters, setFilters] = useState({
        name: '',
        location: '',
        category: '',
    });

    const debouncedFilter = useCallback(
        (() => {
            let timer;
            return (filterValues) => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    onFilter(filterValues);
                }, 500);
            };
        })(),
        [onFilter]
    );

    const onChange = (e) => {
        const newFilters = {
            ...filters,
            [e.target.name]: e.target.value,
        };

        setFilters(newFilters);
        debouncedFilter(newFilters);
    };

    const onReset = () => {
        const resetFilters = {
            name: '',
            location: '',
            category: '',
        };
        setFilters(resetFilters);
        onFilter(resetFilters);
    };

    return (
        <div className="card mb-4 shadow-sm">
            <div className="card-body">
                <h5 className="card-title mb-3">Filtrer les collaborateurs</h5>
                <div className="row g-3">
                    <div className="col-md-4">
                        <label htmlFor="name" className="form-label">
                            Nom
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={filters.name}
                            onChange={onChange}
                            placeholder="Rechercher par nom"
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="location" className="form-label">
                            Localisation
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="location"
                            name="location"
                            value={filters.location}
                            onChange={onChange}
                            placeholder="Ville ou pays"
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="category" className="form-label">
                            Catégorie
                        </label>
                        <select
                            className="form-select"
                            id="category"
                            name="category"
                            value={filters.category}
                            onChange={onChange}
                        >
                            <option value="">Toutes les catégories</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Technique">Technique</option>
                            <option value="Client">Client</option>
                        </select>
                    </div>
                </div>
                <div className="d-flex justify-content-end mt-3">
                    <button type="button" className="btn btn-secondary" onClick={onReset}>
                        Réinitialiser
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserFilter;
