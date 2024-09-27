import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faEdit, faTrashAlt, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Sidebar from './components/sideBar';
import MainHeader from './components/mainHeader';
import Footer from './components/footer';
import { useAffaire } from '../context/AffaireContext';


const FormField = ({ label, id, type = 'text', placeholder, value, onChange, options, disabled }) => (
    <div className="mb-3 col-md-6 form-group">
        <label htmlFor={id} className="form-label" style={{ textAlign: 'left', display: 'block' }}>{label}</label>
        {type === 'select' ? (
            <select
                className="form-select form-control"
                id={id}
                value={value}
                onChange={onChange}
                disabled={disabled}
            >
                <option value="">Sélectionnez une option</option>
                {options && options.map((option, index) => (
                    <option key={index} value={option.value}>{option.label}</option>
                ))}
            </select>
        ) : (
            <input
                type={type}
                className="form-control"
                id={id}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
            />
        )}
    </div>
);

const AddMission = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentAffaireId, setCurrentAffaireId } = useAffaire();
    const [affaireId, setAffaireId] = useState(null);
    const [missions, setMissions] = useState([]);
    const [formData, setFormData] = useState({
        libelle_mission: '',
        quantite: '',
        unite: '',
        prixMissionTotal: '',
        prixMissionUnitaire: '',
        partMissionCID: '',
        dateDebut: '',
        dateFin: '',
        pole: '',
        divisionPrincipale: '',
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [poles, setPoles] = useState([]);
    const [allDivisions, setAllDivisions] = useState([]);
    const [filteredDivisions, setFilteredDivisions] = useState([]);
    const [unites, setUnites] = useState([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errors, setErrors] = useState({});
    const [editingMission, setEditingMission] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [missionToDelete, setMissionToDelete] = useState(null);

    useEffect(() => {
        // Check if affaireId is passed through location state (from AddAffaire)
        const passedAffaireId = location.state?.affaireId;

        if (passedAffaireId) {
            setAffaireId(passedAffaireId);
            setCurrentAffaireId(passedAffaireId);
        } else if (currentAffaireId) {
            setAffaireId(currentAffaireId);
        } else {
            navigate('/afficherAffaireCA'); // Redirect if no affaire ID is available
        }
    }, [location, currentAffaireId, setCurrentAffaireId, navigate]);

    useEffect(() => {
        if (affaireId) {
            fetchMissions(affaireId);
        }
    }, [affaireId]);

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const filteredMissions = missions.filter(mission => 
        mission.libelle_mission.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const fetchMissions = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/missions/affaire/${id}`);
            if (response.data) {
                setMissions(response.data);
            } else {
                setMissions([]);
            }
        } catch (error) {
            console.error('Error fetching missions:', error);
            setMissions([]);
        }
    };

    useEffect(() => {
        // Fetch poles
        axios.get('http://localhost:8080/api/poles')
            .then(response => setPoles(response.data))
            .catch(error => console.error('Error fetching poles:', error));

        // Fetch all divisions
        axios.get('http://localhost:8080/api/divisions')
            .then(response => setAllDivisions(response.data))
            .catch(error => console.error('Error fetching divisions:', error));

        // Fetch unites
        axios.get('http://localhost:8080/api/unites')
            .then(response => setUnites(response.data))
            .catch(error => console.error('Error fetching unites:', error));
    }, []);

    useEffect(() => {
        if (formData.pole) {
            const divisionsForPole = allDivisions.filter(div => div.pole.id_pole === parseInt(formData.pole));
            setFilteredDivisions(divisionsForPole);
        } else {
            setFilteredDivisions([]);
        }
    }, [formData.pole, allDivisions]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));

        // Clear errors when input changes
        setErrors(prevErrors => ({
            ...prevErrors,
            [id]: undefined
        }));

        if (id === 'pole') {
            setFormData(prevState => ({
                ...prevState,
                divisionPrincipale: ''
            }));
        }

        if (id === 'unite') {
            // Reset related fields when changing unite
            setFormData(prevState => ({
                ...prevState,
                quantite: '',
                prixMissionUnitaire: '',
                prixMissionTotal: ''
            }));
        }

        if (id === 'quantite' || id === 'prixMissionUnitaire') {
            const quantite = id === 'quantite' ? parseFloat(value) : parseFloat(formData.quantite);
            const prixUnitaire = id === 'prixMissionUnitaire' ? parseFloat(value) : parseFloat(formData.prixMissionUnitaire);
            if (!isNaN(quantite) && !isNaN(prixUnitaire)) {
                setFormData(prevState => ({
                    ...prevState,
                    prixMissionTotal: (quantite * prixUnitaire).toFixed(2)
                }));
            }
        }

        // Validate Part CID
        if (id === 'partMissionCID' || id === 'prixMissionTotal') {
            const partCID = id === 'partMissionCID' ? parseFloat(value) : parseFloat(formData.partMissionCID);
            const prixTotal = id === 'prixMissionTotal' ? parseFloat(value) : parseFloat(formData.prixMissionTotal);
            if (partCID > prixTotal) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    partMissionCID: 'La part CID ne peut pas être supérieure au prix total'
                }));
            }
        }

        // Validate dates
        if (id === 'dateDebut' || id === 'dateFin') {
            const dateDebut = id === 'dateDebut' ? new Date(value) : new Date(formData.dateDebut);
            const dateFin = id === 'dateFin' ? new Date(value) : new Date(formData.dateFin);
            if (dateDebut > dateFin) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    dateFin: 'La date de fin doit être postérieure à la date de début'
                }));
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (parseFloat(formData.partMissionCID) > parseFloat(formData.prixMissionTotal)) {
            newErrors.partMissionCID = 'La part CID ne peut pas être supérieure au prix total';
        }

        if (new Date(formData.dateDebut) > new Date(formData.dateFin)) {
            newErrors.dateFin = 'La date de fin doit être postérieure à la date de début';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {
            const dataToSend = {
                libelle_mission: formData.libelle_mission,
                unite: { id_unite: parseInt(formData.unite) },
                prixMissionTotal: parseFloat(formData.prixMissionTotal),
                partMissionCID: parseFloat(formData.partMissionCID),
                dateDebut: formData.dateDebut,
                dateFin: formData.dateFin,
                affaire: { idAffaire: affaireId },
                principalDivision: { id_division: parseInt(formData.divisionPrincipale) },
                secondaryDivisions: [],
                compteClient: 0.0,
            };

            // Add quantite and prixMissionUnitaire if not a forfait
            if (formData.unite !== '10') {
                dataToSend.quantite = parseInt(formData.quantite);
                dataToSend.prixMissionUnitaire = parseFloat(formData.prixMissionUnitaire);
            }

            console.log('Data being sent:', dataToSend);

            const response = await axios.post('http://localhost:8080/api/missions', dataToSend);
            console.log('Response:', response.data);
            setShowSuccessModal(true);
            // Add the new mission to the list
            setMissions(prevMissions => [...prevMissions, response.data]);

            // Reset form
            setFormData({
                libelle_mission: '',
                quantite: '',
                unite: '',
                prixMissionTotal: '',
                prixMissionUnitaire: '',
                partMissionCID: '',
                dateDebut: '',
                dateFin: '',
                pole: '',
                divisionPrincipale: '',
            });
        } catch (error) {
            console.error('Error adding mission:', error);
            console.error('Error response:', error.response?.data);
            alert('Erreur lors de l\'ajout de la mission: ' + (error.response?.data || error.message));
        }
    };
    const isForfait = formData.unite === '10';

    const handleDelete = (mission) => {
        setMissionToDelete(mission);
        setShowDeleteModal(true);
    };

    const handleDeleteMission = async () => {
        if (!missionToDelete || !missionToDelete.id_mission) {
            console.error('No mission selected for deletion');
            return;
        }
        try {
            await axios.delete(`http://localhost:8080/api/missions/${missionToDelete.id_mission}`);
            setMissions(prevMissions => prevMissions.filter(m => m.id_mission !== missionToDelete.id_mission));
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting mission:', error);
            alert('Erreur lors de la suppression de la mission: ' + (error.response?.data || error.message));
        }
    };
    const handleEdit = (mission) => {
        setEditingMission({ ...mission });
        setShowEditModal(true);
    };

    const handleUpdateMission = async () => {
        if (!editingMission || !editingMission.id_mission) {
            console.error('No mission selected for editing');
            return;
        }
        if (!validateEditForm()) {
            return;
        }
        try {
            const dataToSend = {
                id_mission: editingMission.id_mission,
                libelle_mission: editingMission.libelle_mission,
                unite: { id_unite: parseInt(editingMission.unite.id_unite) },
                prixMissionTotal: parseFloat(editingMission.prixMissionTotal),
                partMissionCID: parseFloat(editingMission.partMissionCID),
                dateDebut: editingMission.dateDebut,
                dateFin: editingMission.dateFin,
                principalDivision: { id_division: parseInt(editingMission.principalDivision.id_division) },
                affaire: { idAffaire: editingMission.affaire.idAffaire }
            };

            if (editingMission.unite.id_unite !== 10) {
                dataToSend.quantite = parseInt(editingMission.quantite);
                dataToSend.prixMissionUnitaire = parseFloat(editingMission.prixMissionUnitaire);
            }

            console.log('Data being sent:', JSON.stringify(dataToSend, null, 2));

            const response = await axios.put(`http://localhost:8080/api/missions/${editingMission.id_mission}`, dataToSend);
            console.log('Response:', response.data);
            setMissions(prevMissions => prevMissions.map(m => m.id_mission === editingMission.id_mission ? response.data : m));
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating mission:', error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
                console.error('Error response headers:', error.response.headers);
            } else if (error.request) {
                console.error('Error request:', error.request);
            } else {
                console.error('Error message:', error.message);
            }
            alert('Erreur lors de la mise à jour de la mission: ' + (error.response?.data || error.message));
        }
    };
    const validateEditForm = () => {
        const newErrors = {};

        if (parseFloat(editingMission.partMissionCID) > parseFloat(editingMission.prixMissionTotal)) {
            newErrors.partMissionCID = 'La part CID ne peut pas être supérieure au prix total';
        }

        if (new Date(editingMission.dateDebut) > new Date(editingMission.dateFin)) {
            newErrors.dateFin = 'La date de fin doit être postérieure à la date de début';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    return (
        <div className="wrapper">
            <Sidebar />
            <div className="main-panel">
                <MainHeader onSearch={handleSearch} />
                <div className="container">
                    <div className="page-inner">
                        <h3 className="fw-bold mb-3">Ajouter des Missions pour l'Affaire #{affaireId}</h3>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        <div className="card-title">Nouvelle Mission</div>
                                    </div>
                                    <form onSubmit={handleSubmit}>
                                        <div className="card-body">
                                            <div className="row">
                                                <FormField label="Libellé de Mission" id="libelle_mission" value={formData.libelle_mission} onChange={handleInputChange} />
                                                <FormField label="Unité" id="unite" type="select" value={formData.unite} onChange={handleInputChange} options={unites.map(unite => ({ value: unite.id_unite, label: unite.nom_unite }))} />
                                                {!isForfait && (
                                                    <>
                                                        <FormField label="Quantité" id="quantite" type="number" value={formData.quantite} onChange={handleInputChange} />
                                                        <FormField label="Prix Unitaire" id="prixMissionUnitaire" type="number" value={formData.prixMissionUnitaire} onChange={handleInputChange} />
                                                    </>
                                                )}
                                                <FormField label="Prix Total" id="prixMissionTotal" type="number" value={formData.prixMissionTotal} onChange={handleInputChange} disabled={!isForfait} />
                                                <FormField label="Part Mission CID" id="partMissionCID" type="number" value={formData.partMissionCID} onChange={handleInputChange} />
                                                {errors.partMissionCID && <div className="text-danger col-md-12">{errors.partMissionCID}</div>}
                                                <FormField label="Date de début" id="dateDebut" type="date" value={formData.dateDebut} onChange={handleInputChange} />
                                                <FormField label="Date de fin" id="dateFin" type="date" value={formData.dateFin} onChange={handleInputChange} />
                                                {errors.dateFin && <div className="text-danger col-md-12">{errors.dateFin}</div>}
                                                <FormField label="Pôle" id="pole" type="select" value={formData.pole} onChange={handleInputChange} options={poles.map(pole => ({ value: pole.id_pole, label: pole.libelle_pole }))} />
                                                <FormField label="Division Principale" id="divisionPrincipale" type="select" value={formData.divisionPrincipale} onChange={handleInputChange} options={filteredDivisions.map(div => ({ value: div.id_division, label: div.nom_division }))} disabled={!formData.pole} />
                                            </div>
                                        </div>
                                        <div className="card-action">
                                            <button type="submit" className="btn btn-primary">Ajouter Mission</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="row mt-4">
                            <div className="col-md-12">
                                {filteredMissions.length > 0 ? (
                                    <>
                                        <h4>Missions existantes</h4>
                                        <div className="row">
                                            {filteredMissions.map((mission) => (
                                                <div key={mission.id_mission} className="col-12 col-sm-6 col-md-6 col-xl-12">
                                                    <div className="card">
                                                        <div className="card-body">
                                                            <div className="d-flex justify-content-between">
                                                                <div>
                                                                    <h5><b>{mission.libelle_mission}</b></h5>
                                                                    <p>Dates : {new Date(mission.dateDebut).toLocaleDateString()} - {new Date(mission.dateFin).toLocaleDateString()}</p>
                                                                </div>
                                                                <div>
                                                                    <h3 className="text-info fw-bold">{mission.prixMissionTotal.toLocaleString()} DH</h3>
                                                                    <p>Part CID : {mission.partMissionCID.toLocaleString()} DH</p>
                                                                    <p>Division : {mission.principalDivision.nom_division}</p>
                                                                </div>
                                                            </div>

                                                            <div className="d-flex justify-content-between mt-2">
                                                                <div>
                                                                    {mission.unite.id_unite !== 10 ? (
                                                                        <p className="text-muted">
                                                                            Quantité : {mission.quantite} {mission.unite.nom_unite} &nbsp;&nbsp;&nbsp;
                                                                            Prix Unitaire : {mission.prixMissionUnitaire.toLocaleString()} DH
                                                                        </p>
                                                                    ) : (
                                                                        <p className="text-muted">Forfait</p>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <button className="btn" onClick={() => handleEdit(mission)}><FontAwesomeIcon icon={faEdit} className="text-primary" /> Modifier</button>
                                                                    <button className="btn" onClick={() => handleDelete(mission)}><FontAwesomeIcon icon={faTrashAlt} className="text-danger" /> Supprimer</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <p>{searchTerm ? "Aucune mission trouvée" : "Aucune mission existante pour cette affaire."}</p>
                                )}
                            </div>
                        </div>

                        <div className="row mt-4">
                            <div className="col-md-12">
                                <button className="btn btn-success" onClick={() => navigate('/afficherAffaireCA')}>Appliquer</button>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>

            {/* Success Modal */}
            <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Succès</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        <FontAwesomeIcon icon={faCheckCircle} className="text-success mr-2" />&nbsp;
                        La mission a été ajoutée avec succès!
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowSuccessModal(false)}>
                        Fermer
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Modifier la mission</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editingMission && (
                        <form>
                            <div className="row">
                                <FormField
                                    label="Libellé de Mission"
                                    id="libelle_mission"
                                    value={editingMission.libelle_mission}
                                    onChange={(e) => setEditingMission({ ...editingMission, libelle_mission: e.target.value })}
                                />
                                <FormField
                                    label="Unité"
                                    id="unite"
                                    type="select"
                                    value={editingMission.unite.id_unite}
                                    onChange={(e) => setEditingMission({ ...editingMission, unite: { id_unite: parseInt(e.target.value) } })}
                                    options={unites.map(unite => ({ value: unite.id_unite, label: unite.nom_unite }))}
                                />
                                {editingMission.unite.id_unite !== 10 && (
                                    <>
                                        <FormField
                                            label="Quantité"
                                            id="quantite"
                                            type="number"
                                            value={editingMission.quantite}
                                            onChange={(e) => setEditingMission({ ...editingMission, quantite: e.target.value })}
                                        />
                                        <FormField
                                            label="Prix Unitaire"
                                            id="prixMissionUnitaire"
                                            type="number"
                                            value={editingMission.prixMissionUnitaire}
                                            onChange={(e) => setEditingMission({ ...editingMission, prixMissionUnitaire: e.target.value })}
                                        />
                                    </>
                                )}
                                <FormField
                                    label="Prix Total"
                                    id="prixMissionTotal"
                                    type="number"
                                    value={editingMission.prixMissionTotal}
                                    onChange={(e) => setEditingMission({ ...editingMission, prixMissionTotal: e.target.value })}
                                    disabled={editingMission.unite.id_unite !== 10}
                                />
                                <FormField
                                    label="Part Mission CID"
                                    id="partMissionCID"
                                    type="number"
                                    value={editingMission.partMissionCID}
                                    onChange={(e) => setEditingMission({ ...editingMission, partMissionCID: e.target.value })}
                                />
                                <FormField
                                    label="Date de début"
                                    id="dateDebut"
                                    type="date"
                                    value={editingMission.dateDebut}
                                    onChange={(e) => setEditingMission({ ...editingMission, dateDebut: e.target.value })}
                                />
                                <FormField
                                    label="Date de fin"
                                    id="dateFin"
                                    type="date"
                                    value={editingMission.dateFin}
                                    onChange={(e) => setEditingMission({ ...editingMission, dateFin: e.target.value })}
                                />
                                <FormField
                                    label="Pôle"
                                    id="pole"
                                    type="select"
                                    value={editingMission.principalDivision.pole.id_pole}
                                    onChange={(e) => {
                                        const newPoleId = parseInt(e.target.value);
                                        setEditingMission({
                                            ...editingMission,
                                            principalDivision: {
                                                ...editingMission.principalDivision,
                                                pole: { id_pole: newPoleId }
                                            }
                                        });
                                        // Reset division when pole changes
                                        setFilteredDivisions(allDivisions.filter(div => div.pole.id_pole === newPoleId));
                                    }}
                                    options={poles.map(pole => ({ value: pole.id_pole, label: pole.libelle_pole }))}
                                />
                                <FormField
                                    label="Division Principale"
                                    id="divisionPrincipale"
                                    type="select"
                                    value={editingMission.principalDivision.id_division}
                                    onChange={(e) => setEditingMission({
                                        ...editingMission,
                                        principalDivision: {
                                            ...editingMission.principalDivision,
                                            id_division: parseInt(e.target.value)
                                        }
                                    })}
                                    options={filteredDivisions.map(div => ({ value: div.id_division, label: div.nom_division }))}
                                    disabled={!editingMission.principalDivision.pole.id_pole}
                                />
                            </div>
                        </form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleUpdateMission}>
                        Enregistrer les modifications
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Supprimer la mission</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        <FontAwesomeIcon icon={faInfoCircle} className="text-warning mr-2" />&nbsp;
                        Êtes-vous sûr de vouloir supprimer cette mission ?
                    </p>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="danger" onClick={handleDeleteMission}>
                        Supprimer
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AddMission;