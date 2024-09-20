import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTimes, faPlus, faSort, faSortUp, faSortDown, faHome, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../components/sideBar';
import MainHeader from '../components/mainHeader';
import Footer from '../components/footer';

const AfficherPartenaire = () => {
    const [partenaires, setPartenaires] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [newPartenaire, setNewPartenaire] = useState({ nom_partenaire: '' });
    const [editingPartenaire, setEditingPartenaire] = useState(null);
    const [deletingPartenaire, setDeletingPartenaire] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPartenaires();
    }, []);

    const fetchPartenaires = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/api/partenaires');
            setPartenaires(response.data);
        } catch (error) {
            console.error('Error fetching partenaires:', error);
        }
        setIsLoading(false);
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const filteredPartenaires = partenaires.filter(partenaire =>
        partenaire.nom_partenaire.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedPartenaires = React.useMemo(() => {
        let sortablePartenaires = [...filteredPartenaires];
        if (sortConfig.key) {
            sortablePartenaires.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortablePartenaires;
    }, [filteredPartenaires, sortConfig]);

    const getSortIcon = (columnName) => {
        if (sortConfig.key === columnName) {
            return sortConfig.direction === 'ascending' ? faSortUp : faSortDown;
        }
        return faSort;
    };

    const handleAddPartenaire = async () => {
        try {
            await axios.post('http://localhost:8080/api/partenaires', newPartenaire);
            fetchPartenaires();
            setShowAddModal(false);
            setNewPartenaire({ nom_partenaire: '' });
        } catch (error) {
            console.error('Error adding partenaire:', error);
        }
    };

    const handleEditPartenaire = (partenaire) => {
        setEditingPartenaire(partenaire);
        setShowEditModal(true);
    };

    const handleUpdatePartenaire = async () => {
        try {
            await axios.put(`http://localhost:8080/api/partenaires/${editingPartenaire.id_partenaire}`, editingPartenaire);
            fetchPartenaires();
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating partenaire:', error);
        }
    };

    const handleDeletePartenaire = (partenaire) => {
        setDeletingPartenaire(partenaire);
        setShowDeleteModal(true);
    };

    const confirmDeletePartenaire = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/partenaires/${deletingPartenaire.id_partenaire}`);
            fetchPartenaires();
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting partenaire:', error);
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

        if (partenaires.length === 0) {
            return (
                <tr>
                    <td colSpan="3" className="text-center">
                        <Alert variant="info">
                            Aucun partenaire n'existe dans la base de données.
                        </Alert>
                    </td>
                </tr>
            );
        }

        if (sortedPartenaires.length === 0) {
            return (
                <tr>
                    <td colSpan="3" className="text-center">
                        <Alert variant="warning">
                            Aucun partenaire ne correspond à la recherche "{searchTerm}".
                        </Alert>
                    </td>
                </tr>
            );
        }

        return sortedPartenaires.map((partenaire) => (
            <tr key={partenaire.id_partenaire}>
                <td>{partenaire.id_partenaire}</td>
                <td>{partenaire.nom_partenaire}</td>
                <td>
                    <Button variant="link" className="btn-primary" onClick={() => handleEditPartenaire(partenaire)}>
                        <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button variant="link" className="btn-danger" onClick={() => handleDeletePartenaire(partenaire)}>
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
                            <h3 className="fw-bold mb-3">Gestion des Partenaires</h3>
                            <ul className="breadcrumbs mb-3">
                                <li className="nav-home">
                                    <span><FontAwesomeIcon icon={faHome} /></span>
                                </li>
                                <li className="separator">
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </li>
                                <li className="nav-item">
                                    <span>Gestion des Partenaires</span>
                                </li>
                            </ul>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                        <h4 className="card-title mb-0">Liste des Partenaires</h4>
                                        <Button
                                            variant="primary"
                                            onClick={() => setShowAddModal(true)}
                                            className="btn-lg"
                                        >
                                            <FontAwesomeIcon icon={faPlus} /> Ajouter un partenaire
                                        </Button>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <Table className="table table-striped table-hover mt-3">
                                                <thead>
                                                    <tr>
                                                        <th onClick={() => requestSort('id_partenaire')}>
                                                            ID <FontAwesomeIcon icon={getSortIcon('id_partenaire')} />
                                                        </th>
                                                        <th onClick={() => requestSort('nom_partenaire')}>
                                                            Nom du Partenaire <FontAwesomeIcon icon={getSortIcon('nom_partenaire')} />
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

            {/* Add Partenaire Modal */}
            <Modal
                show={showAddModal}
                onHide={() => setShowAddModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Ajouter un Partenaire</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Nom du Partenaire</Form.Label>
                        <Form.Control
                            type="text"
                            value={newPartenaire.nom_partenaire}
                            onChange={(e) => setNewPartenaire({ ...newPartenaire, nom_partenaire: e.target.value })}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleAddPartenaire}>
                        Ajouter
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Partenaire Modal */}
            <Modal
                show={showEditModal}
                onHide={() => setShowEditModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Modifier le Partenaire</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Nom du Partenaire</Form.Label>
                        <Form.Control
                            type="text"
                            value={editingPartenaire?.nom_partenaire || ''}
                            onChange={(e) => setEditingPartenaire({ ...editingPartenaire, nom_partenaire: e.target.value })}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleUpdatePartenaire}>
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
                    Êtes-vous sûr de vouloir supprimer ce partenaire ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="danger" onClick={confirmDeletePartenaire}>
                        Supprimer
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AfficherPartenaire;
