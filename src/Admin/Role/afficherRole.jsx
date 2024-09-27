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
import HomeCA from '../../CadreAdmin/homeCA.jsx';
import HomeCP from '../../ChefPole/homeCP.jsx';
import HomeCD from '../../ChefDiv/homeCD.jsx';
import HomeCDP from '../../ChefProjet/homeCDP.jsx';
import HomeAdmin from '../HomeAdmin';

const AfficherRole = () => {
    const [roles, setRoles] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [deletingRole, setDeletingRole] = useState(null);
    const [newRole, setNewRole] = useState({ nom_role: '', requiresDivision: false, requiresPole: false, redirectionLink: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [routes, setRoutes] = useState([]);

    useEffect(() => {
        fetchRoles();
        fetchRoutes();
    }, []);

    const fetchRoles = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/api/roles');
            setRoles(response.data);
        } catch (error) {
            console.error('Error fetching roles:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRoutes = () => {
        const appRoutes = [
            { path: '/HomeAdmin', element: HomeAdmin, title: 'Accueil d\'admin' },
            { path: '/HomeCA', element: HomeCA, title: 'Accueil de Cadre Administratif' },
            { path: '/HomeCP', element: HomeCP, title: 'Accueil de Chef de Pôle' },
            { path: '/HomeCD', element: HomeCD, title: 'Accueil de Chef de Division' },
            { path: '/HomeCDP', element: HomeCDP, title: 'Accueil de Chef de Projet' },
        ];
        setRoutes(appRoutes);
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const sortedRoles = useMemo(() => {
        let sortableRoles = [...roles];
        if (sortConfig.key !== null) {
            sortableRoles.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableRoles;
    }, [roles, sortConfig]);

    const filteredRoles = useMemo(() => {
        return sortedRoles.filter(role =>
            role.nom_role.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [sortedRoles, searchTerm]);

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

    const handleEditRole = (role) => {
        setEditingRole(role);
        setShowEditModal(true);
    };

    const handleUpdateRole = async () => {
        try {
            await axios.put(`http://localhost:8080/api/roles/${editingRole.id_role}`, editingRole);
            fetchRoles();
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating role:', error);
        }
    };

    const handleDeleteRole = (role) => {
        setDeletingRole(role);
        setShowDeleteModal(true);
    };

    const confirmDeleteRole = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/roles/${deletingRole.id_role}`);
            fetchRoles();
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting role:', error);
        }
    };

    const handleAddRole = async () => {
        try {
            await axios.post('http://localhost:8080/api/roles', newRole);
            fetchRoles();
            setShowAddModal(false);
            setNewRole({ nom_role: '', requiresDivision: false, requiresPole: false, redirectionLink: '' });
        } catch (error) {
            console.error('Error adding role:', error);
        }
    };

    const handleInputChange = (e, isEditing = false) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        if (isEditing) {
            setEditingRole(prev => {
                const updatedRole = { ...prev, [name]: newValue };
                if (name === 'requiresDivision' && newValue) {
                    updatedRole.requiresPole = true;
                }
                return updatedRole;
            });
        } else {
            setNewRole(prev => {
                const updatedRole = { ...prev, [name]: newValue };
                if (name === 'requiresDivision' && newValue) {
                    updatedRole.requiresPole = true;
                }
                return updatedRole;
            });
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

        if (roles.length === 0) {
            return (
                <tr>
                    <td colSpan="3" className="text-center">
                        <Alert variant="info">
                            Aucun rôle n'existe dans la base de données.
                        </Alert>
                    </td>
                </tr>
            );
        }

        if (filteredRoles.length === 0) {
            return (
                <tr>
                    <td colSpan="3" className="text-center">
                        <Alert variant="warning">
                            Aucun rôle ne correspond à la recherche "{searchTerm}".
                        </Alert>
                    </td>
                </tr>
            );
        }

        return filteredRoles.map((role) => (
            <tr key={role.id_role}>
                <td>{role.id_role}</td>
                <td>{role.nom_role}</td>
                <td>
                    <Button variant="link" className="btn-primary" onClick={() => handleEditRole(role)}>
                        <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button variant="link" className="btn-danger" onClick={() => handleDeleteRole(role)}>
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
                            <h3 className="fw-bold mb-3">Gestion des Rôles</h3>
                            <ul className="breadcrumbs mb-3">
                                <li className="nav-home">
                                    <span><FontAwesomeIcon icon={faHome} /></span>
                                </li>
                                <li className="separator">
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </li>
                                <li className="nav-item">
                                    <span>Gestion des Rôles</span>
                                </li>
                            </ul>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                        <h4 className="card-title mb-0">Liste des Rôles</h4>
                                        <Button
                                            variant="primary"
                                            onClick={() => setShowAddModal(true)}
                                            className="btn-lg"
                                        >
                                            <FontAwesomeIcon icon={faPlus} /> Ajouter un rôle
                                        </Button>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <Table className="table table-striped table-hover mt-3">
                                                <thead>
                                                    <tr>
                                                        <th onClick={() => requestSort('id_role')}>
                                                            ID <FontAwesomeIcon icon={getSortIcon('id_role')} />
                                                        </th>
                                                        <th onClick={() => requestSort('nom_role')}>
                                                            Nom du Rôle <FontAwesomeIcon icon={getSortIcon('nom_role')} />
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

            {/* Add Role Modal */}
            <Modal
                show={showAddModal}
                onHide={() => setShowAddModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Ajouter un nouveau rôle</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Nom du rôle</Form.Label>
                        <Form.Control
                            type="text"
                            name="nom_role"
                            value={newRole.nom_role}
                            onChange={(e) => handleInputChange(e)}
                        />
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Check
                            type="checkbox"
                            label="Appartient à une division"
                            name="requiresDivision"
                            checked={newRole.requiresDivision}
                            onChange={(e) => handleInputChange(e)}
                        />
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Check
                            type="checkbox"
                            label="Appartient à un pôle"
                            name="requiresPole"
                            checked={newRole.requiresPole}
                            onChange={(e) => handleInputChange(e)}
                            disabled={newRole.requiresDivision}
                        />
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>Lien de redirection</Form.Label>
                        <Form.Control
                            as="select"
                            name="redirectionLink"
                            value={newRole.redirectionLink}
                            onChange={(e) => handleInputChange(e)}
                        >
                            <option value="">Sélectionnez un lien</option>
                            {routes.map((route) => (
                                <option key={route.path} value={route.path}>
                                    {route.title}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleAddRole}>
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
                    <Modal.Title>Modifier le rôle</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Nom du rôle</Form.Label>
                        <Form.Control
                            type="text"
                            name="nom_role"
                            value={editingRole?.nom_role || ''}
                            onChange={(e) => handleInputChange(e, true)}
                        />
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Check
                            type="checkbox"
                            label="Appartient à une division"
                            name="requiresDivision"
                            checked={editingRole?.requiresDivision || false}
                            onChange={(e) => handleInputChange(e, true)}
                        />
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Check
                            type="checkbox"
                            label="Appartient à un pôle"
                            name="requiresPole"
                            checked={editingRole?.requiresPole || false}
                            onChange={(e) => handleInputChange(e, true)}
                            disabled={editingRole?.requiresDivision}
                        />
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>Lien de redirection</Form.Label>
                        <Form.Control
                            as="select"
                            name="redirectionLink"
                            value={editingRole?.redirectionLink || ''}
                            onChange={(e) => handleInputChange(e, true)}
                        >
                            <option value="">Sélectionnez un lien</option>
                            {routes.map((route) => (
                                <option key={route.path} value={route.path}>
                                    {route.title}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleUpdateRole}>
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
                    Êtes-vous sûr de vouloir supprimer ce rôle ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="danger" onClick={confirmDeleteRole}>
                        Supprimer
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AfficherRole;
