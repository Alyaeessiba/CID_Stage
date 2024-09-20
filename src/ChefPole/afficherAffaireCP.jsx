/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useMemo } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faHome, 
    faArrowRight, 
    faInfo, 
    faSortUp, 
    faSortDown 
} from '@fortawesome/free-solid-svg-icons';
import Sidebar from './components/sideBar';
import MainHeader from './components/mainHeader';
import Footer from './components/footer';

const AfficherAffaire = () => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [showModal, setShowModal] = useState(false);
    const [selectedAffaire, setSelectedAffaire] = useState(null);

    const data = [
        { code: '202100890', libelle: "Réalisation des études de circulation 4", division: 'ET', client: 'Direction des amenagements hydrauliques', chef: 'Ammari Yousra' },
        { code: '202100891', libelle: 'Etude de la rehabilitation du canal de distribution', division: 'G iu', client: 'Direction des infrastructures urbaines', chef: 'Elidrissi Mohamed' },
        { code: '202100892', libelle: "Etude d'impact environnemental de l'extension de la zone industrielle", division: 'G edd', client: "Direction de l'environnement", chef: 'Rahimi Nour' },
        { code: '202100893', libelle: "Construction de la station d'epuration des eaux usees", division: 'G edd', client: "Ministere de l'environnement", chef: 'Bouziane Samira' },
        { code: '202100894', libelle: 'Amenagement des infrastructures routieres', division: 'G iu', client: "Ministere de l'equipement", chef: 'Benjelloun Yassir' },
        { code: '202100895', libelle: "Rehabilitation du reseau d'assainissement", division: 'G ah', client: "Ministere de l'eau", chef: 'El Hammouchi Noura' },
        { code: '202100896', libelle: "Etude technique pour l'extension de la zone industrielle", division: 'G edd', client: "Ministere de l'industrie", chef: 'El Ouardighi Anas' },
        { code: '202100897', libelle: 'Projet de developpement durable des ressources en eau', division: 'G ah', client: "Ministere de l'eau", chef: 'Jabir Salima' },
        { code: '202100898', libelle: "Construction d'une nouvelle usine de traitement des dechets", division: 'G edd', client: "Ministere de l'environnement", chef: 'Rahmani Fatima' },
        { code: '202100899', libelle: 'Projet de renovation des infrastructures scolaires', division: 'G iu', client: "Ministere de l'education", chef: 'Habibi Soufiane' }
    ];

    const sortedData = useMemo(() => {
        let sortableData = [...data];
        if (sortConfig !== null) {
            sortableData.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableData;
    }, [data, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getClassNamesFor = (name) => {
        if (!sortConfig) {
            return;
        }
        return sortConfig.key === name ? sortConfig.direction : undefined;
    };

    const handleShowModal = (affaire) => {
        setSelectedAffaire(affaire);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    return (
        <div className="wrapper">
            <Sidebar />
            <div className="main-panel">
                <MainHeader />
                <div className="container">
                    <div className="page-inner">
                        <div className="page-header">
                            <h3 className="fw-bold mb-3">Gestion des Affaires</h3>
                            <ul className="breadcrumbs mb-3">
                                <li className="nav-home">
                                    <a href="#">
                                        <FontAwesomeIcon icon={faHome} />
                                    </a>
                                </li>
                                <li className="separator">
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </li>
                                <li className="nav-item">
                                    <a href="#">Gestion des Affaires</a>
                                </li>
                                <li className="separator">
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </li>
                                <li className="nav-item">
                                    <a href="#">Liste des affaires</a>
                                </li>
                            </ul>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        <div className="d-flex align-items-center">
                                            <h4 className="card-title">Liste des affaires de pole Batiment, VRD </h4>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table className="table table-striped table-hover mt-3">
                                                <thead>
                                                    <tr>
                                                        <th onClick={() => requestSort('code')} className={getClassNamesFor('code')}>
                                                            Code Affaire <FontAwesomeIcon icon={getClassNamesFor('code') === 'ascending' ? faSortUp : faSortDown} />
                                                        </th>
                                                        <th onClick={() => requestSort('libelle')} className={getClassNamesFor('libelle')}>
                                                            Libelle Affaire <FontAwesomeIcon icon={getClassNamesFor('libelle') === 'ascending' ? faSortUp : faSortDown} />
                                                        </th>
                                                        <th onClick={() => requestSort('division')} className={getClassNamesFor('division')}>
                                                            Division <FontAwesomeIcon icon={getClassNamesFor('division') === 'ascending' ? faSortUp : faSortDown} />
                                                        </th>
                                                        <th onClick={() => requestSort('client')} className={getClassNamesFor('client')}>
                                                            Client <FontAwesomeIcon icon={getClassNamesFor('client') === 'ascending' ? faSortUp : faSortDown} />
                                                        </th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {sortedData.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>{item.code}</td>
                                                            <td>{item.libelle}</td>
                                                            <td>{item.division}</td>
                                                            <td>{item.client}</td>
                                                            <td>
                                                                <Button variant="link" onClick={() => handleShowModal(item)}>
                                                                    <FontAwesomeIcon icon={faInfo} />
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Détails de l'Affaire</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedAffaire && (
                        <div>
                            <p><strong>Code:</strong> {selectedAffaire.code}</p>
                            <p><strong>Libelle:</strong> {selectedAffaire.libelle}</p>
                            <p><strong>Division:</strong> {selectedAffaire.division}</p>
                            <p><strong>Client:</strong> {selectedAffaire.client}</p>
                            <p><strong>Chef de Projet:</strong> {selectedAffaire.chef}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Fermer
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => window.location.href = '/AfficherMissionCP'}>
                        Voir Missions
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AfficherAffaire;
