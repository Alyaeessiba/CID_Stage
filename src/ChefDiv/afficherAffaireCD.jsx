/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown, faInfo, faTasks, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import Sidebar from './components/sideBar';
import MainHeader from './components/mainHeader';
import Footer from './components/footer';

const TableRow = ({ item, onShowInfo, onDesignateChef }) => (
    <tr>
        <td>{item.idAffaire}</td>
        <td>{item.libelle_affaire}</td>
        <td>{item.statusAffaire}</td>
        <td>{item.client.nom_client}</td>
        <td>
            <button onClick={() => onShowInfo(item)} className="btn btn-link btn-primary me-2" title="Informations">
                <FontAwesomeIcon icon={faInfo} />
            </button>
            <button onClick={() => onDesignateChef(item)} className="btn btn-link btn-primary" title="Désigner Chef de Projet">
                <FontAwesomeIcon icon={faUserPlus} />
            </button>
        </td>
    </tr>
);

const AfficherAffaire = () => {
    const navigate = useNavigate();
    const [affaires, setAffaires] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [userDivision, setUserDivision] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedAffaire, setSelectedAffaire] = useState(null);

    const fetchUserDivision = async () => {
        const userId = localStorage.getItem('userId');
        try {
            const response = await axios.get(`http://localhost:8080/api/utilisateurs/${userId}`);
            setUserDivision(response.data.division);
        } catch (error) {
            console.error('Error fetching user division:', error);
            setError('Failed to fetch user information');
        }
    };

    const fetchAffaires = useCallback(async () => {
        if (!userDivision) return;

        try {
            const response = await axios.get('http://localhost:8080/api/affaires');
            const filteredAffaires = response.data.filter(affaire => 
                affaire.divisionPrincipale.id_division === userDivision.id_division
            );
            setAffaires(filteredAffaires);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching affaires:', error);
            setError('Failed to fetch affaires');
            setLoading(false);
        }
    }, [userDivision]);

    useEffect(() => {
        fetchUserDivision();
    }, []);

    useEffect(() => {
        if (userDivision) {
            fetchAffaires();
        }
    }, [userDivision, fetchAffaires]);

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const filteredAffaires = useMemo(() => {
        return affaires.filter(affaire =>
            affaire.libelle_affaire.toLowerCase().includes(searchTerm.toLowerCase()) ||
            affaire.client.nom_client.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [affaires, searchTerm]);

    const sortedData = useMemo(() => {
        let sortableItems = [...filteredAffaires];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredAffaires, sortConfig]);

    const getSortIcon = (columnName) => {
        if (sortConfig.key === columnName) {
            return sortConfig.direction === 'ascending' ? faSortUp : faSortDown;
        }
        return faSort;
    };

    const handleShowInfo = (affaire) => {
        setSelectedAffaire(affaire);
        setShowModal(true);
    };

    const handleDesignateChef = (affaire) => {
        // Navigate to the chef de projet designation page with the affaire ID
        navigate(`/designationChefProjetCD/${affaire.idAffaire}`);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedAffaire(null);
    };

    const handleShowMissions = (affaireId) => {
        navigate(`/afficherMissionCD/${affaireId}`);
        handleCloseModal();
    };

    return (
        <div className="wrapper">
            <Sidebar />
            <div className="main-panel">
                <MainHeader onSearch={handleSearch} />
                <div className="container">
                    <div className="page-inner">
                        <div className="page-header">
                            <h3 className="fw-bold mb-3">Gestion des Affaires</h3>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        <div className="d-flex align-items-center">
                                            <h4 className="card-title">Liste des affaires de la division {userDivision?.nom_division}</h4>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            {loading ? (
                                                <p>Loading...</p>
                                            ) : error ? (
                                                <p>{error}</p>
                                            ) : (
                                                <table className="table table-striped table-hover mt-3">
                                                    <thead>
                                                        <tr>
                                                            <th onClick={() => requestSort('idAffaire')}>
                                                                ID Affaire <FontAwesomeIcon icon={getSortIcon('idAffaire')} />
                                                            </th>
                                                            <th onClick={() => requestSort('libelle_affaire')}>
                                                                Libellé Affaire <FontAwesomeIcon icon={getSortIcon('libelle_affaire')} />
                                                            </th>
                                                            <th onClick={() => requestSort('statusAffaire')}>
                                                                Status <FontAwesomeIcon icon={getSortIcon('statusAffaire')} />
                                                            </th>
                                                            <th onClick={() => requestSort('client.nom_client')}>
                                                                Client <FontAwesomeIcon icon={getSortIcon('client.nom_client')} />
                                                            </th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {sortedData.map((item) => (
                                                            <TableRow 
                                                                key={item.idAffaire} 
                                                                item={item} 
                                                                onShowInfo={handleShowInfo} 
                                                                onDesignateChef={handleDesignateChef}
                                                            />
                                                        ))}
                                                    </tbody>
                                                </table>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>

            <Modal show={showModal} onHide={handleCloseModal} size="lg" c>
                <Modal.Header closeButton>
                    <Modal.Title>Détails de l'Affaire</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedAffaire && (
                        <div>
                            <p><strong>ID Affaire:</strong> {selectedAffaire.idAffaire}</p>
                            <p><strong>Libellé Affaire:</strong> {selectedAffaire.libelle_affaire}</p>
                            <p><strong>Prix Global:</strong> {selectedAffaire.prixGlobal} DH</p>
                            <p><strong>Status:</strong> {selectedAffaire.statusAffaire}</p>
                            <p><strong>Numéro de Marché:</strong> {selectedAffaire.marche}</p>
                            <p><strong>Date de Début:</strong> {new Date(selectedAffaire.dateDebut).toLocaleDateString()}</p>
                            <p><strong>Date de Fin:</strong> {new Date(selectedAffaire.dateFin).toLocaleDateString()}</p>
                            {selectedAffaire.dateArret && (
                                <p><strong>Date d'Arrêt:</strong> {new Date(selectedAffaire.dateArret).toLocaleDateString()}</p>
                            )}
                            {selectedAffaire.dateRecommencement && (
                                <p><strong>Date de Recommencement:</strong> {new Date(selectedAffaire.dateRecommencement).toLocaleDateString()}</p>
                            )}
                            <p><strong>Client:</strong> {selectedAffaire.client.nom_client}</p>
                            <p><strong>Pôle Principal:</strong> {selectedAffaire.polePrincipale.libelle_pole}</p>
                            <p><strong>Division Principale:</strong> {selectedAffaire.divisionPrincipale.nom_division}</p>
                            <p><strong>Part CID:</strong> {selectedAffaire.partCID} DH</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Fermer
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={() => handleShowMissions(selectedAffaire.idAffaire)}
                    >
                        <FontAwesomeIcon icon={faTasks} className="me-2" />
                        Afficher Missions
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AfficherAffaire;
