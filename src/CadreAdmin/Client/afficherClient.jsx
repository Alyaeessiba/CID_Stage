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

const AfficherClient = () => {
    const [clients, setClients] = useState([]);
    const [pays, setPays] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [deletingClient, setDeletingClient] = useState(null);
    const [newClient, setNewClient] = useState({ nom_client: '', pays: { id_pays: '' } });
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    useEffect(() => {
        fetchClients();
        fetchPays();
    }, []);

    const fetchClients = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/api/clients');
            setClients(response.data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPays = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/pays');
            setPays(response.data);
        } catch (error) {
            console.error('Error fetching pays:', error);
        }
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const sortedClients = useMemo(() => {
        let sortableClients = [...clients];
        if (sortConfig.key !== null) {
            sortableClients.sort((a, b) => {
                if (sortConfig.key === 'pays.libelle_pays') {
                    if (a.pays.libelle_pays < b.pays.libelle_pays) {
                        return sortConfig.direction === 'ascending' ? -1 : 1;
                    }
                    if (a.pays.libelle_pays > b.pays.libelle_pays) {
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
        return sortableClients;
    }, [clients, sortConfig]);

    const filteredClients = useMemo(() => {
        return sortedClients.filter(client => 
            client.nom_client.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.pays.libelle_pays.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [sortedClients, searchTerm]);

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

    const handleEditClient = (client) => {
        setEditingClient(client);
        setShowEditModal(true);
    };

    const handleUpdateClient = async () => {
        try {
            await axios.put(`http://localhost:8080/api/clients/${editingClient.id_client}`, editingClient);
            fetchClients();
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating client:', error);
        }
    };

    const handleDeleteClient = (client) => {
        setDeletingClient(client);
        setShowDeleteModal(true);
    };

    const confirmDeleteClient = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/clients/${deletingClient.id_client}`);
            fetchClients();
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting client:', error);
        }
    };

    const handleAddClient = async () => {
        try {
            await axios.post('http://localhost:8080/api/clients', newClient);
            fetchClients();
            setShowAddModal(false);
            setNewClient({ nom_client: '', pays: { id_pays: '' } });
        } catch (error) {
            console.error('Error adding client:', error);
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

        if (clients.length === 0) {
            return (
                <tr>
                    <td colSpan="4" className="text-center">
                        <Alert variant="info">
                            Aucun client n'existe dans la base de données.
                        </Alert>
                    </td>
                </tr>
            );
        }

        if (filteredClients.length === 0) {
            return (
                <tr>
                    <td colSpan="4" className="text-center">
                        <Alert variant="warning">
                            Aucun client ne correspond à la recherche "{searchTerm}".
                        </Alert>
                    </td>
                </tr>
            );
        }

        return filteredClients.map((client) => (
            <tr key={client.id_client}>
                <td>{client.id_client}</td>
                <td>{client.nom_client}</td>
                <td>{client.pays.libelle_pays}</td>
                <td>
                    <Button variant="link" className="btn-primary" onClick={() => handleEditClient(client)}>
                        <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button variant="link" className="btn-danger" onClick={() => handleDeleteClient(client)}>
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
                            <h3 className="fw-bold mb-3">Gestion des Clients</h3>
                            <ul className="breadcrumbs mb-3">
                                <li className="nav-home">
                                    <span><FontAwesomeIcon icon={faHome} /></span>
                                </li>
                                <li className="separator">
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </li>
                                <li className="nav-item">
                                    <span>Gestion des Clients</span>
                                </li>
                            </ul>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                        <h4 className="card-title mb-0">Liste des Clients</h4>
                                        <Button
                                            variant="primary"
                                            onClick={() => setShowAddModal(true)}
                                            className="btn-lg"
                                        >
                                            <FontAwesomeIcon icon={faPlus} /> Ajouter un client
                                        </Button>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <Table className="table table-striped table-hover mt-3">
                                                <thead>
                                                    <tr>
                                                        <th onClick={() => requestSort('id_client')}>
                                                            ID <FontAwesomeIcon icon={getSortIcon('id_client')} />
                                                        </th>
                                                        <th onClick={() => requestSort('nom_client')}>
                                                            Nom du Client <FontAwesomeIcon icon={getSortIcon('nom_client')} />
                                                        </th>
                                                        <th onClick={() => requestSort('pays.libelle_pays')}>
                                                            Pays <FontAwesomeIcon icon={getSortIcon('pays.libelle_pays')} />
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

            {/* Add Client Modal */}
            <Modal 
                show={showAddModal} 
                onHide={() => setShowAddModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Ajouter un nouveau client</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Nom du client</Form.Label>
                        <Form.Control
                            type="text"
                            value={newClient.nom_client}
                            onChange={(e) => setNewClient({ ...newClient, nom_client: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Pays</Form.Label>
                        <Form.Control
                            as="select"
                            value={newClient.pays.id_pays}
                            onChange={(e) => setNewClient({ ...newClient, pays: { id_pays: e.target.value } })}
                        >
                            <option value="">Sélectionnez un pays</option>
                            {pays.map((p) => (
                                <option key={p.id_pays} value={p.id_pays}>
                                    {p.libelle_pays}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleAddClient}>
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
                    <Modal.Title>Modifier le client</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Nom du client</Form.Label>
                        <Form.Control
                            type="text"
                            value={editingClient?.nom_client || ''}
                            onChange={(e) => setEditingClient({ ...editingClient, nom_client: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Pays</Form.Label>
                        <Form.Control
                            as="select"
                            value={editingClient?.pays.id_pays || ''}
                            onChange={(e) => setEditingClient({ ...editingClient, pays: { id_pays: e.target.value } })}
                        >
                            <option value="">Sélectionnez un pays</option>
                            {pays.map((p) => (
                                <option key={p.id_pays} value={p.id_pays}>
                                    {p.libelle_pays}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleUpdateClient}>
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
                    Êtes-vous sûr de vouloir supprimer ce client ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="danger" onClick={confirmDeleteClient}>
                        Supprimer
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AfficherClient;
