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

const AfficherPays = () => {
    const [pays, setPays] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingPays, setEditingPays] = useState(null);
    const [deletingPays, setDeletingPays] = useState(null);
    const [newPays, setNewPays] = useState({ libelle_pays: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    useEffect(() => {
        fetchPays();
    }, []);

    const fetchPays = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/api/pays');
            setPays(response.data);
        } catch (error) {
            console.error('Error fetching pays:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const sortedPays = useMemo(() => {
        let sortablePays = [...pays];
        if (sortConfig.key !== null) {
            sortablePays.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortablePays;
    }, [pays, sortConfig]);

    const filteredPays = useMemo(() => {
        return sortedPays.filter(p => 
            p.libelle_pays.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [sortedPays, searchTerm]);

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

    const handleEditPays = (p) => {
        setEditingPays(p);
        setShowEditModal(true);
    };

    const handleUpdatePays = async () => {
        try {
            await axios.put(`http://localhost:8080/api/pays/${editingPays.id_pays}`, editingPays);
            fetchPays();
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating pays:', error);
        }
    };

    const handleDeletePays = (p) => {
        setDeletingPays(p);
        setShowDeleteModal(true);
    };

    const confirmDeletePays = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/pays/${deletingPays.id_pays}`);
            fetchPays();
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting pays:', error);
        }
    };

    const handleAddPays = async () => {
        try {
            await axios.post('http://localhost:8080/api/pays', newPays);
            fetchPays();
            setShowAddModal(false);
            setNewPays({ libelle_pays: '' });
        } catch (error) {
            console.error('Error adding pays:', error);
        }
    };

    const renderTableContent = () => {
        if (isLoading) {
            return (
                <tr>
                    <td colSpan="3" className="text-center">Chargement...</td>
                </tr>
            );
        }

        if (pays.length === 0) {
            return (
                <tr>
                    <td colSpan="3" className="text-center">
                        <Alert variant="info">
                            Aucun pays n'existe dans la base de données.
                        </Alert>
                    </td>
                </tr>
            );
        }

        if (filteredPays.length === 0) {
            return (
                <tr>
                    <td colSpan="3" className="text-center">
                        <Alert variant="warning">
                            Aucun pays ne correspond à la recherche "{searchTerm}".
                        </Alert>
                    </td>
                </tr>
            );
        }

        return filteredPays.map((p) => (
            <tr key={p.id_pays}>
                <td>{p.id_pays}</td>
                <td>{p.libelle_pays}</td>
                <td>
                    <Button variant="link" className="btn-primary" onClick={() => handleEditPays(p)}>
                        <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button variant="link" className="btn-danger" onClick={() => handleDeletePays(p)}>
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
                            <h3 className="fw-bold mb-3">Gestion des Pays</h3>
                            <ul className="breadcrumbs mb-3">
                                <li className="nav-home">
                                    <span><FontAwesomeIcon icon={faHome} /></span>
                                </li>
                                <li className="separator">
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </li>
                                <li className="nav-item">
                                    <span>Gestion des Pays</span>
                                </li>
                            </ul>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                        <h4 className="card-title mb-0">Liste des Pays</h4>
                                        <Button
                                            variant="primary"
                                            onClick={() => setShowAddModal(true)}
                                            className="btn-lg"
                                        >
                                            <FontAwesomeIcon icon={faPlus} /> Ajouter un pays
                                        </Button>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <Table className="table table-striped table-hover mt-3">
                                                <thead>
                                                    <tr>
                                                        <th onClick={() => requestSort('id_pays')}>
                                                            ID <FontAwesomeIcon icon={getSortIcon('id_pays')} />
                                                        </th>
                                                        <th onClick={() => requestSort('libelle_pays')}>
                                                            Nom du Pays <FontAwesomeIcon icon={getSortIcon('libelle_pays')} />
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

            {/* Add Pays Modal */}
            <Modal 
                show={showAddModal} 
                onHide={() => setShowAddModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Ajouter un nouveau pays</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Nom du pays</Form.Label>
                        <Form.Control
                            type="text"
                            value={newPays.libelle_pays}
                            onChange={(e) => setNewPays({ ...newPays, libelle_pays: e.target.value })}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleAddPays}>
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
                    <Modal.Title>Modifier le pays</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Nom du pays</Form.Label>
                        <Form.Control
                            type="text"
                            value={editingPays?.libelle_pays || ''}
                            onChange={(e) => setEditingPays({ ...editingPays, libelle_pays: e.target.value })}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleUpdatePays}>
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
                    Êtes-vous sûr de vouloir supprimer ce pays ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="danger" onClick={confirmDeletePays}>
                        Supprimer
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AfficherPays;
