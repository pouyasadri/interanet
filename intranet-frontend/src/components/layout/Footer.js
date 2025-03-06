import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-light py-4 mt-5">
            <div className="container text-center">
                <p className="mb-0">
                    &copy; {new Date().getFullYear()} Intranet Collaborateurs - Tous droits réservés
                </p>
            </div>
        </footer>
    );
};

export default Footer;
