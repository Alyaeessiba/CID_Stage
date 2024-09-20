/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import Sidebar from './components/sideBar';
import MainHeader from './components/mainHeader';
import Footer from './components/footer';

const DesignationChefProjetCD = () => {
    // Mock data for available chefs de projet with Moroccan names
    const availableChefs = [
        { id: '1', name: 'Youssef El Amrani' },
        { id: '2', name: 'Fatima Benali' },
        { id: '3', name: 'Mohammed Tazi' },
        { id: '4', name: 'Amina Ouazzani' },
        { id: '5', name: 'Karim Benjelloun' },
    ];

    const [selectedChef, setSelectedChef] = useState('');

    const handleChefChange = (e) => {
        setSelectedChef(e.target.value);
    };

    const handleApply = () => {
        if (selectedChef) {
            console.log('Selected Chef de Projet:', selectedChef);
            // Here you would typically send this data to your backend
        } else {
            console.log('Please select a Chef de Projet');
        }
    };

    return (
        <div className="wrapper">
            <Sidebar />
            <div className="main-panel">
                <MainHeader />
                <div className="container">
                    <div className="page-inner">
                        <div className="page-header">
                            <h3 className="fw-bold mb-3">Désignation du Chef de Projet</h3>
                            <ul className="breadcrumbs mb-3">
                                <li className="nav-home">
                                    <a href="#">
                                        <i className="icon-home" />
                                    </a>
                                </li>
                                <li className="separator">
                                    <i className="icon-arrow-right" />
                                </li>
                                <li className="nav-item">
                                    <a href="#">Gestion des Affaires</a>
                                </li>
                                <li className="separator">
                                    <i className="icon-arrow-right" />
                                </li>
                                <li className="nav-item">
                                    <a href="#">Désignation du Chef de Projet</a>
                                </li>
                            </ul>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        <div className="card-title" style={{ textAlign: 'left' }}>
                                            Sélectionner le Chef de Projet pour l'affaire " Réalisation des études de circulation 4	"
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="form-group">
                                            <label htmlFor="chefProjet" className="form-label">Chef de Projet</label>
                                            <select
                                                className="form-select form-control"
                                                id="chefProjet"
                                                value={selectedChef}
                                                onChange={handleChefChange}
                                            >
                                                <option value="">Sélectionner un Chef de Projet</option>
                                                {availableChefs.map((chef) => (
                                                    <option key={chef.id} value={chef.id}>
                                                        {chef.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="card-action" style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '20px' }}>
                                            <button className="btn btn-primary" onClick={handleApply}>Appliquer</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default DesignationChefProjetCD;
