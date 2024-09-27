import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo, faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import Sidebar from './components/sideBar';
import MainHeader from './components/mainHeader';
import Footer from './components/footer';

const AfficherMissionCP = () => {
    const navigate = useNavigate();
    const [missions, setMissions] = useState([]);
    const [affaire, setAffaire] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedMission, setSelectedMission] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const { affaireId } = useParams();

    useEffect(() => {
        const fetchAffaireAndMissions = async () => {
            try {
                const affaireResponse = await axios.get(`http://localhost:8080/api/affaires/${affaireId}`);
                setAffaire(affaireResponse.data);

                const missionsResponse = await axios.get(`http://localhost:8080/api/missions/affaire/${affaireId}`);
                setMissions(missionsResponse.data);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data. Please try again later.');
                setLoading(false);
            }
        };

        fetchAffaireAndMissions();
    }, [affaireId]);

    const handleShowDetails = (mission) => {
        setSelectedMission(mission);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedMission(null);
    };

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

    const sortedMissions = React.useMemo(() => {
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="wrapper">
            <Sidebar />
            <div className="main-panel">
                <MainHeader />
                <div className="container">
                    <div className="page-inner">
                        <div className="page-header">
                            <h3 className="fw-bold mb-3">Missions de l'affaire</h3>
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
                                                                <button onClick={() => handleShowDetails(mission)} className="btn btn-link btn-primary">
                                                                    <FontAwesomeIcon icon={faInfo} />
                                                                </button>
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
            </Modal>
        </div>
    );
};

export default AfficherMissionCP;
