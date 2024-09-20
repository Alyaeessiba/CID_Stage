import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Button, Modal, Form, Table, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHome,
    faArrowRight,
    faEdit,
    faTimes,
    faPlus,
    faSort,
    faSortUp,
    faSortDown,
} from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../components/sideBar';
import MainHeader from '../components/mainHeader';
import Footer from '../components/footer';

const AfficherDivision = () => {
    const [divisions, setDivisions] = useState([]);
    const [poles, setPoles] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingDivision, setEditingDivision] = useState(null);
    const [deletingDivision, setDeletingDivision] = useState(null);
    const [newDivision, setNewDivision] = useState({ nom_division: '', pole: { id_pole: '' } });
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    useEffect(() => {
        fetchDivisions();
        fetchPoles();
    }, []);

    const fetchDivisions = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/api/divisions');
            setDivisions(response.data);
        } catch (error) {
            console.error('Error fetching divisions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPoles = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/poles');
            setPoles(response.data);
        } catch (error) {
            console.error('Error fetching poles:', error);
        }
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const sortedDivisions = useMemo(() => {
        let sortableDivisions = [...divisions];
        if (sortConfig.key !== null) {
            sortableDivisions.sort((a, b) => {
                if (sortConfig.key === 'pole.libelle_pole') {
                    if (a.pole.libelle_pole < b.pole.libelle_pole) {
                        return sortConfig.direction === 'ascending' ? -1 : 1;
                    }
                    if (a.pole.libelle_pole > b.pole.libelle_pole) {
                        return sortConfig.direction === 'ascending' ? 1 : -1;
                    }
                } else {
                    if (a[sortConfig.key] < b[sortConfig.key]) {
                        return sortConfig.direction === 'ascending' ? -1 : 1;
                    }
                    if (a[sortConfig.key] > b[sortConfig.key]) {
                        return sortConfig.direction === 'ascending' ? 1 : -1;
                    }
                }
                return 0;
            });
        }
        return sortableDivisions;
    }, [divisions, sortConfig]);

    const filteredDivisions = useMemo(() => {
        return sortedDivisions.filter(division => 
            division.nom_division.toLowerCase().includes(searchTerm.toLowerCase()) ||
            division.pole.libelle_pole.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [sortedDivisions, searchTerm]);

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

    const handleEditDivision = (division) => {
        setEditingDivision(division);
        setShowEditModal(true);
    };

    const handleUpdateDivision = async () => {
        try {
            await axios.put(`http://localhost:8080/api/divisions/${editingDivision.id_division}`, editingDivision);
            fetchDivisions();
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating division:', error);
        }
    };

    const handleDeleteDivision = (division) => {
        setDeletingDivision(division);
        setShowDeleteModal(true);
    };

    const confirmDeleteDivision = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/divisions/${deletingDivision.id_division}`);
            fetchDivisions();
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting division:', error);
        }
    };

    const handleAddDivision = async () => {
        try {
            await axios.post('http://localhost:8080/api/divisions', newDivision);
            fetchDivisions();
            setShowAddModal(false);
            setNewDivision({ nom_division: '', pole: { id_pole: '' } });
        } catch (error) {
            console.error('Error adding division:', error);
        }
    };

    const renderTableContent = () => {
        if (isLoading) {
            return (
                <tr>
                    <td colSpan="4" className="text-center">Chargement...</td>
                </tr>
            );
        }

        if (divisions.length === 0) {
            return (
                <tr>
                    <td colSpan="4" className="text-center">
                        <Alert variant="info">
                            Aucune division n'existe dans la base de données.
                        </Alert>
                    </td>
                </tr>
            );
        }

        if (filteredDivisions.length === 0) {
            return (
                <tr>
                    <td colSpan="4" className="text-center">
                        <Alert variant="warning">
                            Aucune division ne correspond à la recherche "{searchTerm}".
                        </Alert>
                    </td>
                </tr>
            );
        }

        return filteredDivisions.map((division) => (
            <tr key={division.id_division}>
                <td>{division.id_division}</td>
                <td>{division.nom_division}</td>
                <td>{division.pole.libelle_pole}</td>
                <td>
                    <Button variant="link" className="btn-primary" onClick={() => handleEditDivision(division)}>
                        <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button variant="link" className="btn-danger" onClick={() => handleDeleteDivision(division)}>
                        <FontAwesomeIcon icon={faTimes} />
                    </Button>
                </td>
            </tr>
        ));
    };

    return (
        <div className="wrapper">
            <Sidebar />
            <div className="main-panel">
                <MainHeader onSearch={handleSearch} />
                <div className="container">
                    <div className="page-inner">
                        <div className="page-header">
                            <h3 className="fw-bold mb-3">Gestion des Divisions</h3>
                            <ul className="breadcrumbs mb-3">
                                <li className="nav-home">
                                    <span><FontAwesomeIcon icon={faHome} /></span>
                                </li>
                                <li className="separator">
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </li>
                                <li className="nav-item">
                                    <span>Gestion des Divisions</span>
                                </li>
                            </ul>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                        <h4 className="card-title mb-0">Liste des Divisions</h4>
                                        <Button
                                            variant="primary"
                                            onClick={() => setShowAddModal(true)}
                                            className="btn-lg"
                                        >
                                            <FontAwesomeIcon icon={faPlus} /> Ajouter une division
                                        </Button>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <Table className="table table-striped table-hover mt-3">
                                                <thead>
                                                    <tr>
                                                        <th onClick={() => requestSort('id_division')}>
                                                            ID <FontAwesomeIcon icon={getSortIcon('id_division')} />
                                                        </th>
                                                        <th onClick={() => requestSort('nom_division')}>
                                                            Nom de la Division <FontAwesomeIcon icon={getSortIcon('nom_division')} />
                                                        </th>
                                                        <th onClick={() => requestSort('pole.libelle_pole')}>
                                                            Pôle <FontAwesomeIcon icon={getSortIcon('pole.libelle_pole')} />
                                                        </th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {renderTableContent()}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>

            {/* Add Division Modal */}
            <Modal 
                show={showAddModal} 
                onHide={() => setShowAddModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Ajouter une nouvelle division</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Nom de la division</Form.Label>
                        <Form.Control
                            type="text"
                            value={newDivision.nom_division}
                            onChange={(e) => setNewDivision({ ...newDivision, nom_division: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Pôle</Form.Label>
                        <Form.Control
                            as="select"
                            value={newDivision.pole.id_pole}
                            onChange={(e) => setNewDivision({ ...newDivision, pole: { id_pole: e.target.value } })}
                        >
                            <option value="">Sélectionnez un pôle</option>
                            {poles.map((pole) => (
                                <option key={pole.id_pole} value={pole.id_pole}>
                                    {pole.libelle_pole}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleAddDivision}>
                        Ajouter
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Modal */}
            <Modal 
                show={showEditModal} 
                onHide={() => setShowEditModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Modifier la division</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Nom de la division</Form.Label>
                        <Form.Control
                            type="text"
                            value={editingDivision?.nom_division || ''}
                            onChange={(e) => setEditingDivision({ ...editingDivision, nom_division: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Pôle</Form.Label>
                        <Form.Control
                            as="select"
                            value={editingDivision?.pole?.id_pole || ''}
                            onChange={(e) => setEditingDivision({ ...editingDivision, pole: { id_pole: e.target.value } })}
                        >
                            <option value="">Sélectionnez un pôle</option>
                            {poles.map((pole) => (
                                <option key={pole.id_pole} value={pole.id_pole}>
                                    {pole.libelle_pole}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleUpdateDivision}>
                        Sauvegarder
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal 
                show={showDeleteModal} 
                onHide={() => setShowDeleteModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirmer la suppression</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Êtes-vous sûr de vouloir supprimer cette division ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="danger" onClick={confirmDeleteDivision}>
                        Supprimer
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AfficherDivision;
