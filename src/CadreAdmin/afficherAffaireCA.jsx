/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo, faEdit, faTimes, faHome, faArrowRight,faPlus, faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import Sidebar from './components/sideBar';
import MainHeader from './components/mainHeader';
import Footer from './components/footer';
import { useAffaire } from '../context/AffaireContext';

const TableHeader = ({ columns, sortConfig, requestSort }) => (
    <thead>
        <tr>
            {columns.map((column) => (
                <th key={column.key} onClick={() => requestSort(column.key)} style={{ textAlign: 'left', cursor: 'pointer' }}>
                    {column.label}
                    {sortConfig.key === column.key && (
                        <i className={`fa fa-sort-${sortConfig.direction}`} style={{ marginLeft: '5px' }} />
                    )}
                </th>
            ))}
            <th>Actions</th>
        </tr>
    </thead>
);

const TableRow = ({ item, onShowModal }) => (
    <tr>
        <td style={{ textAlign: 'left' }}>{item.idAffaire}</td>
        <td style={{ textAlign: 'left' }}>{item.libelle_affaire}</td>
        <td style={{ textAlign: 'left' }}>{item.statusAffaire}</td>
        <td style={{ textAlign: 'left' }}>{item.client.nom_client}</td>
        <td style={{ textAlign: 'left' }}>
            <div className="form-button-action">
                <button type="button" onClick={() => onShowModal('info', item)} className="btn btn-link btn-primary">
                    <FontAwesomeIcon icon={faInfo} />
                </button>
                <button type="button" onClick={() => onShowModal('edit', item)} className="btn btn-link btn-primary">
                    <FontAwesomeIcon icon={faEdit} />
                </button>
                <button type="button" onClick={() => onShowModal('delete', item)} className="btn btn-link btn-danger">
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </div>
        </td>
    </tr>
);

const Breadcrumb = ({ items }) => (
    <ul className="breadcrumbs mb-3">
        {items.map((item, index) => (
            <React.Fragment key={index}>
                <li className={item.icon ? "nav-home" : "nav-item"}>
                    <Link to={item.link}>
                        {item.icon ? <FontAwesomeIcon icon={item.icon} /> : item.text}
                    </Link>
                </li>
                {index < items.length - 1 && (
                    <li className="separator">
                        <FontAwesomeIcon icon={faArrowRight} />
                    </li>
                )}
            </React.Fragment>
        ))}
    </ul>
);

const AfficherAffaire = () => {
    const navigate = useNavigate();
    const { setCurrentAffaireId } = useAffaire();
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [selectedAffaire, setSelectedAffaire] = useState(null);
    const [editedAffaire, setEditedAffaire] = useState(null);
    const [affaires, setAffaires] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statuses, setStatuses] = useState([]);
    const [clients, setClients] = useState([]);
    const [poles, setPoles] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAffaires();
        fetchStatuses();
        fetchClients();
        fetchPoles();
        fetchDivisions();
    }, []);

    const fetchAffaires = async () => {
        try {
            setLoading(true);
            // Update this URL to match your backend URL and port
            const response = await axios.get('http://localhost:8080/api/affaires');
            setAffaires(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching affaires:', err);
            setError('Error fetching affaires');
            setLoading(false);
        }
    };

    const fetchStatuses = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/affaires/statuses');
            setStatuses(response.data);
        } catch (err) {
            console.error('Error fetching statuses:', err);
        }
    };

    const fetchClients = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/clients');
            setClients(response.data);
        } catch (err) {
            console.error('Error fetching clients:', err);
        }
    };

    const fetchPoles = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/poles');
            setPoles(response.data);
        } catch (err) {
            console.error('Error fetching poles:', err);
        }
    };

    const fetchDivisions = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/divisions');
            setDivisions(response.data);
        } catch (err) {
            console.error('Error fetching divisions:', err);
        }
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const filteredAffaires = useMemo(() => {
        return affaires.filter(affaire => 
            affaire.idAffaire.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            affaire.libelle_affaire.toLowerCase().includes(searchTerm.toLowerCase()) ||
            affaire.client.nom_client.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [affaires, searchTerm]);

    const sortedData = useMemo(() => {
        let sortableData = [...filteredAffaires];
        if (sortConfig.key !== null) {
            sortableData.sort((a, b) => {
                if (sortConfig.key === 'client.nom_client') {
                    // Handle nested client.nom_client property
                    const aValue = a.client?.nom_client?.toLowerCase() || '';
                    const bValue = b.client?.nom_client?.toLowerCase() || '';
                    if (aValue < bValue) {
                        return sortConfig.direction === 'ascending' ? -1 : 1;
                    }
                    if (aValue > bValue) {
                        return sortConfig.direction === 'ascending' ? 1 : -1;
                    }
                    return 0;
                } else {
                    // Handle other properties
                    if (a[sortConfig.key] < b[sortConfig.key]) {
                        return sortConfig.direction === 'ascending' ? -1 : 1;
                    }
                    if (a[sortConfig.key] > b[sortConfig.key]) {
                        return sortConfig.direction === 'ascending' ? 1 : -1;
                    }
                    return 0;
                }
            });
        }
        return sortableData;
    }, [filteredAffaires, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleShowModal = (type, affaire) => {
        setModalType(type);
        setSelectedAffaire(affaire);
        setEditedAffaire(affaire);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleViewMissions = () => {
        if (selectedAffaire) {
            setCurrentAffaireId(selectedAffaire.idAffaire);
            navigate('/addMissionCA');
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/affaires/${selectedAffaire.idAffaire}`);
            fetchAffaires(); // Refresh the list after deletion
            handleCloseModal();
        } catch (err) {
            setError('Error deleting affaire');
        }
    };

    const handleEditChange = useCallback((updatedAffaire) => {
        setEditedAffaire(updatedAffaire);
    }, []);

    const handleDateChange = useCallback((field, date) => {
        setEditedAffaire(prevState => ({
            ...prevState,
            [field]: date
        }));
    }, []);

    const handleEditSubmit = async () => {
        try {
            await axios.put(`/api/affaires/${editedAffaire.idAffaire}`, editedAffaire);
            fetchAffaires(); 
            handleCloseModal();
        } catch (err) {
            setError('Error updating affaire');
        }
    };

    const columns = [
        { key: 'idAffaire', label: 'ID Affaire' },
        { key: 'libelle_affaire', label: 'Libellé Affaire' },
        { key: 'statusAffaire', label: 'Status' },
        { key: 'client.nom_client', label: 'Client' },
    ];

    const breadcrumbItems = [
        { icon: faHome, link: "/HomeCA" },
        { text: "Gestion des Affaires", link: "/gestion-affaires" },
        { text: "Liste des affaires", link: "#" }
    ];

    const EditForm = React.memo(({ affaire, onChange, onDateChange, poles, divisions, clients }) => {
        const [localAffaire, setLocalAffaire] = useState(affaire);
        const [filteredDivisions, setFilteredDivisions] = useState([]);
        const [error, setError] = useState('');

        useEffect(() => {
            setLocalAffaire(affaire);
        }, [affaire]);

        useEffect(() => {
            const filtered = divisions.filter(division => division.pole.id_pole === parseInt(localAffaire.polePrincipale.id_pole));
            setFilteredDivisions(filtered);
        }, [localAffaire.polePrincipale.id_pole, divisions]);

        const handleChange = useCallback((e) => {
            const { name, value } = e.target;
            setLocalAffaire(prev => {
                const newState = { ...prev };
                if (name.includes('.')) {
                    const [objName, objProp] = name.split('.');
                    newState[objName] = { ...newState[objName], [objProp]: value };
                } else {
                    newState[name] = value;
                }

                if (name === 'polePrincipale.id_pole') {
                    newState.divisionPrincipale = { id_division: '' };
                }

                return newState;
            });
        }, []);

        useEffect(() => {
            if (parseFloat(localAffaire.partCID) > parseFloat(localAffaire.prixGlobal)) {
                setError('La Part CID ne peut pas être supérieure au Prix Global');
            } else {
                setError('');
            }

            const timer = setTimeout(() => {
                onChange(localAffaire);
            }, 300);

            return () => clearTimeout(timer);
        }, [localAffaire, onChange]);

        return (
            <form>
                <div className="mb-3">
                    <label htmlFor="idAffaire" className="form-label">ID Affaire</label>
                    <input type="text" className="form-control" id="idAffaire" name="idAffaire" value={localAffaire.idAffaire} readOnly />
                </div>
                <div className="mb-3">
                    <label htmlFor="marche" className="form-label">Numéro de Marché</label>
                    <input type="text" className="form-control" id="marche" name="marche" value={localAffaire.marche} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="libelle_affaire" className="form-label">Libellé Affaire</label>
                    <input type="text" className="form-control" id="libelle_affaire" name="libelle_affaire" value={localAffaire.libelle_affaire} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="prixGlobal" className="form-label">Prix Global</label>
                    <input 
                        type="number" 
                        className="form-control" 
                        id="prixGlobal" 
                        name="prixGlobal" 
                        value={localAffaire.prixGlobal} 
                        onChange={handleChange} 
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="partCID" className="form-label">Part CID</label>
                    <input 
                        type="number" 
                        className="form-control" 
                        id="partCID" 
                        name="partCID" 
                        value={localAffaire.partCID} 
                        onChange={handleChange} 
                    />
                    {error && <div className="text-danger">{error}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="statusAffaire" className="form-label">Status</label>
                    <select 
                        className="form-control" 
                        id="statusAffaire" 
                        name="statusAffaire" 
                        value={localAffaire.statusAffaire} 
                        onChange={handleChange}
                    >
                        {statuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label htmlFor="dateDebut" className="form-label">Date de Début</label>
                        <input
                            type="date"
                            className="form-control"
                            id="dateDebut"
                            name="dateDebut"
                            value={localAffaire.dateDebut ? new Date(localAffaire.dateDebut).toISOString().split('T')[0] : ''}
                            onChange={(e) => onDateChange('dateDebut', new Date(e.target.value))}
                            max={localAffaire.dateFin ? new Date(localAffaire.dateFin).toISOString().split('T')[0] : ''}
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="dateFin" className="form-label">Date de Fin</label>
                        <input
                            type="date"
                            className="form-control"
                            id="dateFin"
                            name="dateFin"
                            value={localAffaire.dateFin ? new Date(localAffaire.dateFin).toISOString().split('T')[0] : ''}
                            onChange={(e) => onDateChange('dateFin', new Date(e.target.value))}
                            min={localAffaire.dateDebut ? new Date(localAffaire.dateDebut).toISOString().split('T')[0] : ''}
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label htmlFor="dateArret" className="form-label">Date d'Arrêt</label>
                        <input
                            type="date"
                            className="form-control"
                            id="dateArret"
                            name="dateArret"
                            value={localAffaire.dateArret ? new Date(localAffaire.dateArret).toISOString().split('T')[0] : ''}
                            onChange={(e) => onDateChange('dateArret', new Date(e.target.value))}
                            max={localAffaire.dateRecommencement ? new Date(localAffaire.dateRecommencement).toISOString().split('T')[0] : ''}
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="dateRecommencement" className="form-label">Date de Recommencement</label>
                        <input
                            type="date"
                            className="form-control"
                            id="dateRecommencement"
                            name="dateRecommencement"
                            value={localAffaire.dateRecommencement ? new Date(localAffaire.dateRecommencement).toISOString().split('T')[0] : ''}
                            onChange={(e) => onDateChange('dateRecommencement', new Date(e.target.value))}
                            min={localAffaire.dateArret ? new Date(localAffaire.dateArret).toISOString().split('T')[0] : ''}
                        />
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="client" className="form-label">Client</label>
                    <select 
                        className="form-control" 
                        id="client" 
                        name="client.id_client" 
                        value={localAffaire.client.id_client} 
                        onChange={handleChange}
                    >
                        <option value="">Sélectionnez un client</option>
                        {clients.map(client => (
                            <option key={client.id_client} value={client.id_client}>
                                {client.nom_client}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="polePrincipale" className="form-label">Pôle Principal</label>
                    <select 
                        className="form-control" 
                        id="polePrincipale" 
                        name="polePrincipale.id_pole" 
                        value={localAffaire.polePrincipale.id_pole} 
                        onChange={handleChange}
                    >
                        <option value="">Sélectionnez un pôle</option>
                        {poles.map(pole => (
                            <option key={pole.id_pole} value={pole.id_pole}>{pole.libelle_pole}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="divisionPrincipale" className="form-label">Division Principale</label>
                    <select 
                        className="form-control" 
                        id="divisionPrincipale" 
                        name="divisionPrincipale.id_division" 
                        value={localAffaire.divisionPrincipale.id_division} 
                        onChange={handleChange}
                    >
                        <option value="">Sélectionnez une division</option>
                        {filteredDivisions.map(division => (
                            <option key={division.id_division} value={division.id_division}>{division.nom_division}</option>
                        ))}
                    </select>
                </div>
            </form>
        );
    });

    const getSortIcon = (columnName) => {
        if (sortConfig.key === columnName) {
            return sortConfig.direction === 'ascending' ? faSortUp : faSortDown;
        }
        return faSort;
    };

    return (
        <div className="wrapper">
            <Sidebar />
            <div className="main-panel">
                <MainHeader onSearch={handleSearch} />
                <div className="container">
                    <div className="page-inner">
                        <div className="page-header">
                            <h3 className="fw-bold mb-3">Gestion des Affaires</h3>
                            <Breadcrumb items={breadcrumbItems} />
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        <div className="d-flex align-items-center">
                                            <h4 className="card-title">Liste des affaires de pole Batiment, VRD </h4>
                                            <Link to="/AddAffaireCA" className="btn btn-primary btn-round ms-auto">
                                                <FontAwesomeIcon icon={faPlus} />
                                                &nbsp;&nbsp;Ajouter une affaire
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            {loading ? (
                                                <p>Loading...</p>
                                            ) : error ? (
                                                <p>{error}</p>
                                            ) : (
                                                <table className="table table-striped table-hover mt-3">
                                                    <thead>
                                                        <tr>
                                                            <th onClick={() => requestSort('idAffaire')}>
                                                                ID Affaire <FontAwesomeIcon icon={getSortIcon('idAffaire')} />
                                                            </th>
                                                            <th onClick={() => requestSort('libelle_affaire')}>
                                                                Libellé Affaire <FontAwesomeIcon icon={getSortIcon('libelle_affaire')} />
                                                            </th>
                                                            <th onClick={() => requestSort('statusAffaire')}>
                                                                Status <FontAwesomeIcon icon={getSortIcon('statusAffaire')} />
                                                            </th>
                                                            <th onClick={() => requestSort('client.nom_client')}>
                                                                Client <FontAwesomeIcon icon={getSortIcon('client.nom_client')} />
                                                            </th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {sortedData.map((item) => (
                                                            <TableRow key={item.idAffaire} item={item} onShowModal={handleShowModal} />
                                                        ))}
                                                    </tbody>
                                                </table>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>

            <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {modalType === 'delete' && 'Supprimer l\'affaire'}
                        {modalType === 'edit' && 'Modifier l\'affaire'}
                        {modalType === 'info' && 'Détails de l\'affaire'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalType === 'delete' && (
                        <p>Êtes-vous sûr de vouloir supprimer l'affaire "{selectedAffaire?.libelle_affaire}"?</p>
                    )}
                    {modalType === 'edit' && selectedAffaire && (
                        <EditForm 
                            affaire={editedAffaire || selectedAffaire} 
                            onChange={handleEditChange}
                            onDateChange={handleDateChange}
                            poles={poles}
                            divisions={divisions}
                            clients={clients}
                        />
                    )}
                    {modalType === 'info' && selectedAffaire && (
                        <div>
                            <p><strong>ID:</strong> {selectedAffaire.idAffaire}</p>
                            <p><strong>Numéro de Marché:</strong> {selectedAffaire.marche}</p>
                            <p><strong>Libellé:</strong> {selectedAffaire.libelle_affaire}</p>
                            <p><strong>Prix Global:</strong> {selectedAffaire.prixGlobal}</p>
                            <p><strong>Part CID:</strong> {selectedAffaire.partCID}</p>
                            <p><strong>Status:</strong> {selectedAffaire.statusAffaire}</p>
                            <p><strong>Date de Début:</strong> {new Date(selectedAffaire.dateDebut).toLocaleDateString()}</p>
                            <p><strong>Date de Fin:</strong> {new Date(selectedAffaire.dateFin).toLocaleDateString()}</p>
                            <p><strong>Date d'Arrêt:</strong> {selectedAffaire.dateArret ? new Date(selectedAffaire.dateArret).toLocaleDateString() : 'N/A'}</p>
                            <p><strong>Date de Recommencement:</strong> {selectedAffaire.dateRecommencement ? new Date(selectedAffaire.dateRecommencement).toLocaleDateString() : 'N/A'}</p>
                            <p><strong>Client:</strong> {selectedAffaire.client.nom_client}</p>
                            <p><strong>Pôle Principal:</strong> {selectedAffaire.polePrincipale.libelle_pole}</p>
                            <p><strong>Division Principale:</strong> {selectedAffaire.divisionPrincipale.nom_division}</p>
                            
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
                            <Button variant="primary" onClick={handleEditSubmit}>
                                Enregistrer les modifications
                            </Button>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Annuler
                            </Button>
                        </>
                    )}
                    {modalType === 'info' && (
                        <>
                            <Button variant="primary" onClick={handleViewMissions}>
                                Voir les missions
                            </Button>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Fermer
                            </Button>
                        </>
                    )}
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AfficherAffaire;
