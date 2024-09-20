/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useMemo } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import Sidebar from './components/sideBar';
import MainHeader from './components/mainHeader';
import Footer from './components/footer';

const AfficherMission = () => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [showModal, setShowModal] = useState(false);
    const [selectedMission, setSelectedMission] = useState(null);

    const data = [
        { libelle: "Gare LGV Casa Voyageurs", prix: '342,000.00', forfait: 'Oui', division: 'ET', Pourcentage: '70 %' },
        { libelle: "Gare LGV Rabat Agdal", prix: '342,000.00', forfait: 'Oui', division: 'ET', Pourcentage: '100 %' },
        { libelle: "Gare LGV Kénitra", prix: '405,000.00', forfait: 'Oui', division: 'ET', Pourcentage: '90 %' },
        { libelle: "Gare LGV Tanger", prix: '378,000.00', forfait: 'Non', division: 'ET', Pourcentage: '' }
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

    const handleShowModal = (mission) => {
        setSelectedMission(mission);
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
                            <h3 className="fw-bold mb-3">Gestion des Missions</h3>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        <div className="d-flex align-items-center">
                                            <h4 className="card-title">Liste des missions de l'affaire "Réalisation des études de circulation 4"</h4>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table className="table table-striped table-hover mt-3">
                                                <thead>
                                                    <tr>
                                                        <th onClick={() => requestSort('libelle')}>
                                                            Libellé Mission {sortConfig.key === 'libelle' && (
                                                                <FontAwesomeIcon icon={sortConfig.direction === 'ascending' ? faSortUp : faSortDown} />
                                                            )}
                                                        </th>
                                                        <th onClick={() => requestSort('prix')}>
                                                            Prix Total {sortConfig.key === 'prix' && (
                                                                <FontAwesomeIcon icon={sortConfig.direction === 'ascending' ? faSortUp : faSortDown} />
                                                            )}
                                                        </th>
                                                        <th onClick={() => requestSort('forfait')}>
                                                            Forfait {sortConfig.key === 'forfait' && (
                                                                <FontAwesomeIcon icon={sortConfig.direction === 'ascending' ? faSortUp : faSortDown} />
                                                            )}
                                                        </th>
                                                        <th onClick={() => requestSort('division')}>
                                                            Division Principale {sortConfig.key === 'division' && (
                                                                <FontAwesomeIcon icon={sortConfig.direction === 'ascending' ? faSortUp : faSortDown} />
                                                            )}
                                                        </th>
                                                        <th onClick={() => requestSort('Pourcentage')}>
                                                            Pourcentage de Division Principale {sortConfig.key === 'Pourcentage' && (
                                                                <FontAwesomeIcon icon={sortConfig.direction === 'ascending' ? faSortUp : faSortDown} />
                                                            )}
                                                        </th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {sortedData.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>{item.libelle}</td>
                                                            <td>{item.prix}</td>
                                                            <td>{item.forfait}</td>
                                                            <td>{item.division}</td>
                                                            <td>{item.Pourcentage}</td>
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
                    <Modal.Title>Détails de la Mission</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedMission && (
                        <div>
                            <p><strong>Libellé:</strong> {selectedMission.libelle}</p>
                            <p><strong>Prix:</strong> {selectedMission.prix}</p>
                            <p><strong>Forfait:</strong> {selectedMission.forfait}</p>
                            <p><strong>Division:</strong> {selectedMission.division}</p>
                            <p><strong>Pourcentage:</strong> {selectedMission.Pourcentage || 'Non défini'}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Fermer
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => window.location.href = '/addDivisionsCD'}>
                        Répartition des tâches
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AfficherMission;
