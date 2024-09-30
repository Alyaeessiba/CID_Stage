/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo, faSort, faSortUp, faSortDown, faEye } from '@fortawesome/free-solid-svg-icons';
import Sidebar from './components/sideBar';
import MainHeader from './components/mainHeader';
import Footer from './components/footer';

// At the top of your file, configure axios
axios.defaults.withCredentials = true;
axios.defaults.timeout = 5000; // 5 seconds timeout

const AfficherMissionCD = () => {
    const navigate = useNavigate();
    const { idAffaire } = useParams();
    const [missions, setMissions] = useState([]);
    const [affaire, setAffaire] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [showModal, setShowModal] = useState(false);
    const [selectedMission, setSelectedMission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAffaireAndMissions = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch affaire data
                const affaireResponse = await axios.get(`http://localhost:8080/api/affaires/${idAffaire}`);
                setAffaire(affaireResponse.data);

                // Fetch missions data
                const missionsResponse = await axios.get(`http://localhost:8080/api/missions/affaire/${idAffaire}`);
                setMissions(missionsResponse.data);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                if (error.response) {
                    setError(`Server error: ${error.response.status}`);
                } else if (error.request) {
                    setError('No response received from server. Please check your network connection.');
                } else {
                    setError(`Request error: ${error.message}`);
                }
                setLoading(false);
            }
        };

        fetchAffaireAndMissions();
    }, [idAffaire]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (columnName) => {
        if (sortConfig.key === columnName) {
            return sortConfig.direction === 'ascending' ? faSortUp : faSortDown;
        }
        return faSort;
    };

    const sortedMissions = useMemo(() => {
        let sortableMissions = [...missions];
        if (sortConfig.key !== null) {
            sortableMissions.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableMissions;
    }, [missions, sortConfig]);

    const handleShowModal = (mission) => {
        setSelectedMission(mission);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleConsultMission = (missionId) => {
        navigate(`/consultMissionCDP/${missionId}`);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="wrapper">
            <Sidebar />
            <div className="main-panel">
                <MainHeader />
                <div className="container">
                    <div className="page-inner">
                        <div className="page-header">
                            <h3 className="fw-bold mb-3">Gestion des Missions</h3>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        <div className="d-flex align-items-center">
                                            <h4 className="card-title">Liste des missions pour: {affaire?.libelle_affaire}</h4>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table className="table table-striped table-hover mt-3">
                                                <thead>
                                                    <tr>
                                                        <th onClick={() => requestSort('id_mission')}>
                                                            ID Mission <FontAwesomeIcon icon={getSortIcon('id_mission')} />
                                                        </th>
                                                        <th onClick={() => requestSort('libelle_mission')}>
                                                            Libellé Mission <FontAwesomeIcon icon={getSortIcon('libelle_mission')} />
                                                        </th>
                                                        <th onClick={() => requestSort('prixMissionTotal')}>
                                                            Prix Total <FontAwesomeIcon icon={getSortIcon('prixMissionTotal')} />
                                                        </th>
                                                        <th onClick={() => requestSort('principalDivision.nom_division')}>
                                                            Division Principale <FontAwesomeIcon icon={getSortIcon('principalDivision.nom_division')} />
                                                        </th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {sortedMissions.map((mission) => (
                                                        <tr key={mission.id_mission}>
                                                            <td>{mission.id_mission}</td>
                                                            <td>{mission.libelle_mission}</td>
                                                            <td>{mission.prixMissionTotal}</td>
                                                            <td>{mission.principalDivision?.nom_division}</td>
                                                            <td>
                                                                <Button variant="link" onClick={() => handleShowModal(mission)}>
                                                                    <FontAwesomeIcon icon={faInfo} />
                                                                </Button>
                                                                <Button variant="link" onClick={() => handleConsultMission(mission.id_mission)}>
                                                                    <FontAwesomeIcon icon={faEye} />
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            {missions.length === 0 && <p>No missions found for this affaire.</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>

            <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Détails de la Mission</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedMission && (
                        <div>
                            <p><strong>ID Mission:</strong> {selectedMission.id_mission}</p>
                            <p><strong>Libellé Mission:</strong> {selectedMission.libelle_mission}</p>
                            <p><strong>Prix Total:</strong> {selectedMission.prixMissionTotal}</p>
                            <p><strong>Prix Unitaire:</strong> {selectedMission.prixMissionUnitaire}</p>
                            <p><strong>Quantité:</strong> {selectedMission.quantite}</p>
                            <p><strong>Unité:</strong> {selectedMission.unite?.nom_unite}</p>
                            <p><strong>Part CID:</strong> {selectedMission.partMissionCID}</p>
                            <p><strong>Compte Client:</strong> {selectedMission.compteClient}</p>
                            <p><strong>Date de Début:</strong> {new Date(selectedMission.dateDebut).toLocaleDateString()}</p>
                            <p><strong>Date de Fin:</strong> {new Date(selectedMission.dateFin).toLocaleDateString()}</p>
                            {selectedMission.dateArret && (
                                <p><strong>Date d'Arrêt:</strong> {new Date(selectedMission.dateArret).toLocaleDateString()}</p>
                            )}
                            {selectedMission.dateRecommencement && (
                                <p><strong>Date de Recommencement:</strong> {new Date(selectedMission.dateRecommencement).toLocaleDateString()}</p>
                            )}
                            <p><strong>Division Principale:</strong> {selectedMission.principalDivision?.nom_division}</p>
                            <p><strong>Divisions Secondaires:</strong></p>
                            <ul>
                                {selectedMission.secondaryDivisions?.map((missionDivision, index) => (
                                    <li key={index}>{missionDivision.division?.nom_division} - {missionDivision.pourcentage}%</li>
                                ))}
                            </ul>
                            <p><strong>Sous-traitants:</strong></p>
                            <ul>
                                {selectedMission.sousTraitants?.map((missionST, index) => (
                                    <li key={index}>{missionST.sousTraitant?.nom_st} - {missionST.pourcentage}%</li>
                                ))}
                            </ul>
                            <p><strong>Partenaires:</strong></p>
                            <ul>
                                {selectedMission.partenaires?.map((missionPartenaire, index) => (
                                    <li key={index}>{missionPartenaire.partenariat?.nom_partenariat} - {missionPartenaire.pourcentage}%</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Fermer
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AfficherMissionCD;