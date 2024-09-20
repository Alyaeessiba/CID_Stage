import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTimes, faPlus, faSort, faSortUp, faSortDown, faHome, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../components/sideBar';
import MainHeader from '../components/mainHeader';
import Footer from '../components/footer';

const AfficherSousTraitant = () => {
    const [sousTraitants, setSousTraitants] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [newSousTraitant, setNewSousTraitant] = useState({ nom_soustrait: '' });
    const [editingSousTraitant, setEditingSousTraitant] = useState(null);
    const [deletingSousTraitant, setDeletingSousTraitant] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchSousTraitants();
    }, []);

    const fetchSousTraitants = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/api/sous-traitants');
            setSousTraitants(response.data);
        } catch (error) {
            console.error('Error fetching sous-traitants:', error);
        }
        setIsLoading(false);
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const filteredSousTraitants = sousTraitants.filter(sousTraitant =>
        sousTraitant.nom_soustrait.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedSousTraitants = React.useMemo(() => {
        let sortableSousTraitants = [...filteredSousTraitants];
        if (sortConfig.key) {
            sortableSousTraitants.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableSousTraitants;
    }, [filteredSousTraitants, sortConfig]);

    const getSortIcon = (columnName) => {
        if (sortConfig.key === columnName) {
            return sortConfig.direction === 'ascending' ? faSortUp : faSortDown;
        }
        return faSort;
    };

    const handleAddSousTraitant = async () => {
        try {
            await axios.post('http://localhost:8080/api/sous-traitants', newSousTraitant);
            fetchSousTraitants();
            setShowAddModal(false);
            setNewSousTraitant({ nom_soustrait: '' });
        } catch (error) {
            console.error('Error adding sous-traitant:', error);
        }
    };

    const handleEditSousTraitant = (sousTraitant) => {
        setEditingSousTraitant(sousTraitant);
        setShowEditModal(true);
    };

    const handleUpdateSousTraitant = async () => {
        try {
            await axios.put(`http://localhost:8080/api/sous-traitants/${editingSousTraitant.id_soustrait}`, editingSousTraitant);
            fetchSousTraitants();
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating sous-traitant:', error);
        }
    };

    const handleDeleteSousTraitant = (sousTraitant) => {
        setDeletingSousTraitant(sousTraitant);
        setShowDeleteModal(true);
    };

    const confirmDeleteSousTraitant = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/sous-traitants/${deletingSousTraitant.id_soustrait}`);
            fetchSousTraitants();
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting sous-traitant:', error);
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

        if (sousTraitants.length === 0) {
            return (
                <tr>
                    <td colSpan="3" className="text-center">
                        <Alert variant="info">
                            Aucun sous-traitant n'existe dans la base de données.
                        </Alert>
                    </td>
                </tr>
            );
        }

        if (sortedSousTraitants.length === 0) {
            return (
                <tr>
                    <td colSpan="3" className="text-center">
                        <Alert variant="warning">
                            Aucun sous-traitant ne correspond à la recherche "{searchTerm}".
                        </Alert>
                    </td>
                </tr>
            );
        }

        return sortedSousTraitants.map((sousTraitant) => (
            <tr key={sousTraitant.id_soustrait}>
                <td>{sousTraitant.id_soustrait}</td>
                <td>{sousTraitant.nom_soustrait}</td>
                <td>
                    <Button variant="link" className="btn-primary" onClick={() => handleEditSousTraitant(sousTraitant)}>
                        <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button variant="link" className="btn-danger" onClick={() => handleDeleteSousTraitant(sousTraitant)}>
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
                            <h3 className="fw-bold mb-3">Gestion des Sous-traitants</h3>
                            <ul className="breadcrumbs mb-3">
                                <li className="nav-home">
                                    <span><FontAwesomeIcon icon={faHome} /></span>
                                </li>
                                <li className="separator">
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </li>
                                <li className="nav-item">
                                    <span>Gestion des Sous-traitants</span>
                                </li>
                            </ul>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                        <h4 className="card-title mb-0">Liste des Sous-traitants</h4>
                                        <Button
                                            variant="primary"
                                            onClick={() => setShowAddModal(true)}
                                            className="btn-lg"
                                        >
                                            <FontAwesomeIcon icon={faPlus} /> Ajouter un sous-traitant
                                        </Button>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <Table className="table table-striped table-hover mt-3">
                                                <thead>
                                                    <tr>
                                                        <th onClick={() => requestSort('id_soustrait')}>
                                                            ID <FontAwesomeIcon icon={getSortIcon('id_soustrait')} />
                                                        </th>
                                                        <th onClick={() => requestSort('nom_soustrait')}>
                                                            Nom du Sous-traitant <FontAwesomeIcon icon={getSortIcon('nom_soustrait')} />
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

            {/* Add Sous-traitant Modal */}
            <Modal
                show={showAddModal}
                onHide={() => setShowAddModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Ajouter un Sous-traitant</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Nom du Sous-traitant</Form.Label>
                        <Form.Control
                            type="text"
                            value={newSousTraitant.nom_soustrait}
                            onChange={(e) => setNewSousTraitant({ ...newSousTraitant, nom_soustrait: e.target.value })}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleAddSousTraitant}>
                        Ajouter
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Sous-traitant Modal */}
            <Modal
                show={showEditModal}
                onHide={() => setShowEditModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Modifier le Sous-traitant</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Nom du Sous-traitant</Form.Label>
                        <Form.Control
                            type="text"
                            value={editingSousTraitant?.nom_soustrait || ''}
                            onChange={(e) => setEditingSousTraitant({ ...editingSousTraitant, nom_soustrait: e.target.value })}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleUpdateSousTraitant}>
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
                    Êtes-vous sûr de vouloir supprimer ce sous-traitant ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="danger" onClick={confirmDeleteSousTraitant}>
                        Supprimer
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AfficherSousTraitant;
