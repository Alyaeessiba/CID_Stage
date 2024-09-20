/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useMemo } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHome,
    faArrowRight,
    faInfo,
    faEdit,
    faTimes,
    faPlus,
    faSortUp,
    faSortDown,
    faHeart
} from '@fortawesome/free-solid-svg-icons';
import Sidebar from './components/sideBar';
import MainHeader from './components/mainHeader';

const AfficherMission = () => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [selectedMission, setSelectedMission] = useState(null);
    const [missions, setMissions] = useState([
        { libelle: "Gare LGV Casa Voyageurs", prix: '342,000.00', forfait: 'Oui', division: 'ET', Pourcentage: '70 %' },
        { libelle: "Gare LGV Rabat Agdal", prix: '342,000.00', forfait: 'Oui', division: 'ET', Pourcentage: '100 %' },
        { libelle: "Gare LGV Kénitra", prix: '405,000.00', forfait: 'Oui', division: 'ET', Pourcentage: '90 %' },
        { libelle: "Gare LGV Tanger", prix: '378,000.00', forfait: 'Non', division: 'ET', Pourcentage: '100 %' }
    ]);

    const sortedData = useMemo(() => {
        let sortableData = [...missions];
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
    }, [missions, sortConfig]);

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

    const handleShowModal = (type, mission) => {
        setModalType(type);
        setSelectedMission(mission);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleDelete = () => {
        setMissions(missions.filter(mission => mission.libelle !== selectedMission.libelle));
        handleCloseModal();
    };

    const handleEdit = (e) => {
        e.preventDefault();
        const updatedMission = {
            libelle: e.target.libelle.value,
            prix: e.target.prix.value,
            forfait: e.target.forfait.value,
            division: e.target.division.value,
            Pourcentage: e.target.Pourcentage.value
        };
        setMissions(missions.map(mission =>
            mission.libelle === selectedMission.libelle ? updatedMission : mission
        ));
        handleCloseModal();
    };

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
                                    <a href="#"><FontAwesomeIcon icon={faHome} /></a>
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
                                    <a href="#">Liste des Missions</a>
                                </li>
                            </ul>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        <div className="d-flex align-items-center">
                                            <h4 className="card-title">Liste des missions de l'affaire "Réalisation des études de circulation 4"</h4>
                                            <a href="/AddMissionCA" className="btn btn-primary btn-round ms-auto">
                                                <FontAwesomeIcon icon={faPlus} />
                                                &nbsp;&nbsp;Ajouter une mission
                                            </a>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table className="table table-striped table-hover mt-3">
                                                <thead>
                                                    <tr>
                                                        {['libelle', 'prix', 'forfait', 'division', 'Pourcentage'].map((key) => (
                                                            <th key={key} style={{ textAlign: 'left' }} onClick={() => requestSort(key)} className={getClassNamesFor(key)}>
                                                                {key.charAt(0).toUpperCase() + key.slice(1)}
                                                                <FontAwesomeIcon icon={getClassNamesFor(key) === 'ascending' ? faSortUp : faSortDown} />
                                                            </th>
                                                        ))}
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {sortedData.map((item, index) => (
                                                        <tr key={index}>
                                                            <td style={{ textAlign: 'left' }}>{item.libelle}</td>
                                                            <td style={{ textAlign: 'left' }}>{item.prix}</td>
                                                            <td style={{ textAlign: 'left' }}>{item.forfait}</td>
                                                            <td style={{ textAlign: 'left' }}>{item.division}</td>
                                                            <td style={{ textAlign: 'left' }}>{item.Pourcentage}</td>
                                                            <td style={{ textAlign: 'left' }}>
                                                                <div className="form-button-action">
                                                                    <Button variant="link" className="btn-primary" onClick={() => handleShowModal('info', item)}>
                                                                        <FontAwesomeIcon icon={faInfo} />
                                                                    </Button>
                                                                    <Button variant="link" className="btn-primary" onClick={() => handleShowModal('edit', item)}>
                                                                        <FontAwesomeIcon icon={faEdit} />
                                                                    </Button>
                                                                    <Button variant="link" className="btn-danger" onClick={() => handleShowModal('delete', item)}>
                                                                        <FontAwesomeIcon icon={faTimes} />
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <Modal show={showModal} onHide={handleCloseModal} centered>
                                            <Modal.Header closeButton>
                                                <Modal.Title>
                                                    {modalType === 'delete' && 'Supprimer la Mission'}
                                                    {modalType === 'edit' && 'Modifier la Mission'}
                                                    {modalType === 'info' && 'Détails de la Mission'}
                                                </Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                {modalType === 'delete' && (
                                                    <p>Êtes-vous sûr de vouloir supprimer cette mission : "{selectedMission?.libelle}"?</p>
                                                )}
                                                {modalType === 'edit' && selectedMission && (
                                                    <Form id="editForm" onSubmit={handleEdit}>
                                                        {Object.keys(selectedMission).map((key) => (
                                                            <Form.Group key={key} className="mb-3">
                                                                <Form.Label>{key.charAt(0).toUpperCase() + key.slice(1)}</Form.Label>
                                                                {key === 'forfait' ? (
                                                                    <Form.Select name={key} defaultValue={selectedMission[key]}>
                                                                        <option value="Oui">Oui</option>
                                                                        <option value="Non">Non</option>
                                                                    </Form.Select>
                                                                ) : (
                                                                    <Form.Control type="text" name={key} defaultValue={selectedMission[key]} />
                                                                )}
                                                            </Form.Group>
                                                        ))}
                                                    </Form>
                                                )}
                                                {modalType === 'info' && selectedMission && (
                                                    <div>
                                                        {Object.entries(selectedMission).map(([key, value]) => (
                                                            <p key={key}><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}</p>
                                                        ))}
                                                    </div>
                                                )}
                                            </Modal.Body>
                                            <Modal.Footer>
                                                {modalType === 'delete' && (
                                                    <>
                                                        <Button variant="danger" onClick={handleDelete}>
                                                            Supprimer
                                                        </Button>
                                                        <Button variant="secondary" onClick={handleCloseModal}>
                                                            Annuler
                                                        </Button>
                                                    </>
                                                )}
                                                {modalType === 'edit' && (
                                                    <>
                                                        <Button variant="primary" type="submit" form="editForm">
                                                            Enregistrer les modifications
                                                        </Button>
                                                        <Button variant="secondary" onClick={handleCloseModal}>
                                                            Fermer
                                                        </Button>
                                                    </>
                                                )}
                                                {modalType === 'info' && (
                                                    <Button variant="secondary" onClick={handleCloseModal}>
                                                        Fermer
                                                    </Button>
                                                )}
                                            </Modal.Footer>
                                        </Modal>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <footer className="footer">
                        <div className="container-fluid d-flex justify-content-between">
                            <nav className="pull-left">
                                <ul className="nav">
                                    <li className="nav-item">
                                        <a className="nav-link" href="https://github.com/Alyaeessiba">
                                            Alyae Essiba
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="https://github.com/0ZEUS01"> Yahya Zini </a>
                                    </li>
                                </ul>
                            </nav>
                            <div className="copyright">
                                2024, made with <FontAwesomeIcon icon={faHeart} className="heart text-info" /> by
                                <a href="http://cid.co.ma/"> CID</a>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default AfficherMission;
