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
} from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../components/sideBar';
import MainHeader from '../components/mainHeader';
import Footer from '../components/footer';

const AfficherPole = () => {
    const [poles, setPoles] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingPole, setEditingPole] = useState(null);
    const [deletingPole, setDeletingPole] = useState(null);
    const [newPole, setNewPole] = useState({ libelle_pole: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showCascadeDeleteModal, setShowCascadeDeleteModal] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    useEffect(() => {
        fetchPoles();
    }, []);

    const fetchPoles = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/api/poles');
            setPoles(response.data);
        } catch (error) {
            console.error('Error fetching poles:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const filteredPoles = useMemo(() => {
        return poles.filter(pole => 
            pole.libelle_pole.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [poles, searchTerm]);

    const handleEditPole = (pole) => {
        setEditingPole(pole);
        setShowEditModal(true);
    };

    const handleUpdatePole = async () => {
        try {
            await axios.put(`http://localhost:8080/api/poles/${editingPole.id_pole}`, editingPole);
            fetchPoles();
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating pole:', error);
        }
    };

    const handleDeletePole = (pole) => {
        setDeletingPole(pole);
        setShowDeleteModal(true);
    };

    const confirmDeletePole = async () => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/poles/${deletingPole.id_pole}`);
            if (response.status === 200) {
                fetchPoles();
                setShowDeleteModal(false);
                setShowCascadeDeleteModal(false);
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setDeleteError(error.response.data);
                setShowDeleteModal(false);
                setShowCascadeDeleteModal(true);
            } else {
                console.error('Error deleting pole:', error);
            }
        }
    };

    const confirmCascadeDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/poles/${deletingPole.id_pole}/cascade`);
            fetchPoles();
            setShowCascadeDeleteModal(false);
        } catch (error) {
            console.error('Error performing cascade delete:', error);
        }
    };

    const handleAddPole = async () => {
        try {
            await axios.post('http://localhost:8080/api/poles', newPole);
            fetchPoles();
            setShowAddModal(false);
            setNewPole({ libelle_pole: '' });
        } catch (error) {
            console.error('Error adding pole:', error);
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

        if (poles.length === 0) {
            return (
                <tr>
                    <td colSpan="3" className="text-center">
                        <Alert variant="info">
                            Aucun pôle n'existe dans la base de données.
                        </Alert>
                    </td>
                </tr>
            );
        }

        if (filteredPoles.length === 0) {
            return (
                <tr>
                    <td colSpan="3" className="text-center">
                        <Alert variant="warning">
                            Aucun pôle n'existe avec le nom "{searchTerm}".
                        </Alert>
                    </td>
                </tr>
            );
        }

        return filteredPoles.map((pole) => (
            <tr key={pole.id_pole}>
                <td>{pole.id_pole}</td>
                <td>{pole.libelle_pole}</td>
                <td>
                    <Button variant="link" className="btn-primary" onClick={() => handleEditPole(pole)}>
                        <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button variant="link" className="btn-danger" onClick={() => handleDeletePole(pole)}>
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
                            <h3 className="fw-bold mb-3">Gestion des Pôles</h3>
                            <ul className="breadcrumbs mb-3">
                                <li className="nav-home">
                                    <span><FontAwesomeIcon icon={faHome} /></span>
                                </li>
                                <li className="separator">
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </li>
                                <li className="nav-item">
                                    <span>Gestion des Pôles</span>
                                </li>
                            </ul>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                        <h4 className="card-title mb-0">Liste des Pôles</h4>
                                        <Button
                                            variant="primary"
                                            onClick={() => setShowAddModal(true)}
                                            className="btn-lg"
                                        >
                                            <FontAwesomeIcon icon={faPlus} /> Ajouter un pôle
                                        </Button>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <Table className="table table-striped table-hover mt-3">
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Libellé du Pôle</th>
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

                {/* Add Pole Modal */}
                <Modal 
                    show={showAddModal} 
                    onHide={() => setShowAddModal(false)}
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Ajouter un nouveau pôle</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Libellé du pôle</Form.Label>
                            <Form.Control
                                type="text"
                                value={newPole.libelle_pole}
                                onChange={(e) => setNewPole({ ...newPole, libelle_pole: e.target.value })}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                            Annuler
                        </Button>
                        <Button variant="primary" onClick={handleAddPole}>
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
                        <Modal.Title>Modifier le pôle</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Libellé du pôle</Form.Label>
                            <Form.Control
                                type="text"
                                value={editingPole?.libelle_pole || ''}
                                onChange={(e) => setEditingPole({ ...editingPole, libelle_pole: e.target.value })}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                            Annuler
                        </Button>
                        <Button variant="primary" onClick={handleUpdatePole}>
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
                        Êtes-vous sûr de vouloir supprimer ce pôle ?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                            Annuler
                        </Button>
                        <Button variant="danger" onClick={confirmDeletePole}>
                            Supprimer
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Cascade Delete Confirmation Modal */}
                <Modal 
                    show={showCascadeDeleteModal} 
                    onHide={() => setShowCascadeDeleteModal(false)}
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmer la suppression en cascade</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>{deleteError}</p>
                        <p>Êtes-vous sûr de vouloir supprimer ce pôle et toutes les données associées ?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowCascadeDeleteModal(false)}>
                            Annuler
                        </Button>
                        <Button variant="danger" onClick={confirmCascadeDelete}>
                            Supprimer en cascade
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default AfficherPole;
