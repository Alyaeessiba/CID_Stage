/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import Sidebar from './components/sideBar';
import MainHeader from './components/mainHeader';
import Footer from './components/footer';

const FormField = ({ label, id, type = 'text', placeholder, value, onChange, options, disabled, error }) => (
    <div className="mb-3 col-md-6 form-group">
        <label htmlFor={id} className="form-label" style={{ textAlign: 'left', display: 'block' }}>{label}</label>
        {type === 'select' ? (
            <select
                className={`form-select form-control ${error ? 'is-invalid' : ''}`}
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
                className={`form-control ${error ? 'is-invalid' : ''}`}
                id={id}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        )}
        {error && <div className="invalid-feedback">{error}</div>}
    </div>
);

const RepartirMissionCD = () => {
    const { idMission } = useParams();
    const navigate = useNavigate();
    const [mission, setMission] = useState(null);
    const [divisions, setDivisions] = useState([]);
    const [partenaires, setPartenaires] = useState([]);
    const [sousTraitants, setSousTraitants] = useState([]);
    const [repartition, setRepartition] = useState({
        principalDivisionPart: 0,
        secondaryDivisions: [],
        partenaires: [],
        sousTraitants: []
    });
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [totalPart, setTotalPart] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [missionRes, divisionsRes, partenairesRes, sousTraitantsRes] = await Promise.all([
                    axios.get(`http://localhost:8080/api/missions/${idMission}`),
                    axios.get('http://localhost:8080/api/divisions'),
                    axios.get('http://localhost:8080/api/partenaires'),
                    axios.get('http://localhost:8080/api/sous-traitants'),
                ]);
                setMission(missionRes.data);
                setDivisions(divisionsRes.data);
                setPartenaires(partenairesRes.data);
                setSousTraitants(sousTraitantsRes.data);
                
                // Set the repartition data from the mission
                if (missionRes.data) {
                    const newRepartition = {
                        principalDivisionPart: missionRes.data.partDivPrincipale || 0,
                        secondaryDivisions: missionRes.data.secondaryDivisions.map(sd => ({
                            divisionId: sd.division.id_division,
                            partMission: sd.partMission
                        })),
                        partenaires: missionRes.data.partenaires.map(p => ({
                            partenaireId: p.partenaire.id_partenaire,
                            partMission: p.partMission
                        })),
                        sousTraitants: missionRes.data.sousTraitants.map(st => ({
                            sousTraitantId: st.sousTraitant.id_soustrait,
                            partMission: st.partMission
                        }))
                    };
                    setRepartition(newRepartition);
                    calculateTotalPart(newRepartition);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [idMission]);

    const calculateTotalPart = (repartitionData) => {
        const total = repartitionData.principalDivisionPart +
            repartitionData.secondaryDivisions.reduce((sum, div) => sum + (div.partMission || 0), 0) +
            repartitionData.partenaires.reduce((sum, p) => sum + (p.partMission || 0), 0) +
            repartitionData.sousTraitants.reduce((sum, st) => sum + (st.partMission || 0), 0);
        setTotalPart(total);
        validateTotalPart(total);
    };

    const validateTotalPart = (total) => {
        if (mission && total > mission.partMissionCID) {
            setErrorMessage(`Le total des parts (${total.toFixed(2)}) dépasse la part CID de la mission (${mission.partMissionCID}).`);
        } else {
            setErrorMessage('');
        }
    };

    const handlePrincipalDivisionPartChange = (e) => {
        const value = parseFloat(e.target.value) || 0;
        const newRepartition = { ...repartition, principalDivisionPart: value };
        setRepartition(newRepartition);
        calculateTotalPart(newRepartition);
    };

    const addSecondaryDivision = () => {
        const newRepartition = {
            ...repartition,
            secondaryDivisions: [...repartition.secondaryDivisions, { divisionId: '', partMission: 0 }]
        };
        setRepartition(newRepartition);
        calculateTotalPart(newRepartition);
    };

    const handleSecondaryDivisionChange = (index, field, value) => {
        const updatedDivisions = [...repartition.secondaryDivisions];
        updatedDivisions[index][field] = field === 'partMission' ? parseFloat(value) || 0 : value;
        const newRepartition = { ...repartition, secondaryDivisions: updatedDivisions };
        setRepartition(newRepartition);
        calculateTotalPart(newRepartition);
    };

    const removeSecondaryDivision = (index) => {
        const updatedDivisions = repartition.secondaryDivisions.filter((_, i) => i !== index);
        const newRepartition = { ...repartition, secondaryDivisions: updatedDivisions };
        setRepartition(newRepartition);
        calculateTotalPart(newRepartition);
    };

    const addPartenaire = () => {
        const newRepartition = {
            ...repartition,
            partenaires: [...repartition.partenaires, { partenaireId: '', partMission: 0 }]
        };
        setRepartition(newRepartition);
        calculateTotalPart(newRepartition);
    };

    const handlePartenaireChange = (index, field, value) => {
        const updatedPartenaires = [...repartition.partenaires];
        updatedPartenaires[index][field] = field === 'partMission' ? parseFloat(value) || 0 : value;
        const newRepartition = { ...repartition, partenaires: updatedPartenaires };
        setRepartition(newRepartition);
        calculateTotalPart(newRepartition);
    };

    const removePartenaire = (index) => {
        const updatedPartenaires = repartition.partenaires.filter((_, i) => i !== index);
        const newRepartition = { ...repartition, partenaires: updatedPartenaires };
        setRepartition(newRepartition);
        calculateTotalPart(newRepartition);
    };

    const addSousTraitant = () => {
        const newRepartition = {
            ...repartition,
            sousTraitants: [...repartition.sousTraitants, { sousTraitantId: '', partMission: 0 }]
        };
        setRepartition(newRepartition);
        calculateTotalPart(newRepartition);
    };

    const handleSousTraitantChange = (index, field, value) => {
        const updatedSousTraitants = [...repartition.sousTraitants];
        updatedSousTraitants[index][field] = field === 'partMission' ? parseFloat(value) || 0 : value;
        const newRepartition = { ...repartition, sousTraitants: updatedSousTraitants };
        setRepartition(newRepartition);
        calculateTotalPart(newRepartition);
    };

    const removeSousTraitant = (index) => {
        const updatedSousTraitants = repartition.sousTraitants.filter((_, i) => i !== index);
        const newRepartition = { ...repartition, sousTraitants: updatedSousTraitants };
        setRepartition(newRepartition);
        calculateTotalPart(newRepartition);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (errorMessage) {
            console.error("Impossible de soumettre en raison d'erreurs de validation.");
            return;
        }

        try {
            await axios.post(`http://localhost:8080/api/missions/${idMission}/repartition`, repartition);
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Error submitting repartition:', error);
            setErrorMessage('Erreur lors de la soumission de la répartition. Veuillez réessayer.');
        }
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        navigate(`/afficherMissionCD/${mission.affaire.idAffaire}`);
    };

    if (!mission) return <div>Loading...</div>;

    return (
        <div className="wrapper">
            <Sidebar />
            <div className="main-panel">
                <MainHeader />
                <div className="content">
                    <div className="container-fluid">
                        <div className="page-inner">
                            <div className="page-header">
                                <h4 className="page-title">Répartition de la Mission</h4>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="card">
                                        <div className="card-header">
                                            <div className="card-title">Répartition de la Mission: {mission.libelle_mission}</div>
                                        </div>
                                        <div className="card-body">
                                            <Form onSubmit={handleSubmit}>
                                                <div className="row">
                                                    <FormField
                                                        label="Division Principale"
                                                        id="principalDivision"
                                                        type="select"
                                                        value={mission.principalDivision.id_division}
                                                        onChange={() => {}}
                                                        options={divisions.map(div => ({ value: div.id_division, label: div.nom_division }))}
                                                        disabled={true}
                                                    />
                                                    <FormField
                                                        label="Part de la division principale"
                                                        id="principalDivisionPart"
                                                        type="number"
                                                        placeholder="Part de la division"
                                                        value={repartition.principalDivisionPart}
                                                        onChange={handlePrincipalDivisionPartChange}
                                                    />
                                                </div>

                                                <h5 className="mt-4 mb-3">Divisions Secondaires</h5>
                                                {repartition.secondaryDivisions.map((div, index) => (
                                                    <div className="row mb-3" key={index}>
                                                        <FormField
                                                            label="Division"
                                                            id={`secondaryDivision-${index}`}
                                                            type="select"
                                                            value={div.divisionId}
                                                            onChange={(e) => handleSecondaryDivisionChange(index, 'divisionId', e.target.value)}
                                                            options={divisions.map(d => ({ value: d.id_division, label: d.nom_division }))}
                                                        />
                                                        <FormField
                                                            label="Part de cette division"
                                                            id={`secondaryDivisionPart-${index}`}
                                                            type="number"
                                                            placeholder="Part de la division"
                                                            value={div.partMission}
                                                            onChange={(e) => handleSecondaryDivisionChange(index, 'partMission', e.target.value)}
                                                        />
                                                        <div className="col-md-2 d-flex align-items-end">
                                                            <Button variant="danger" onClick={() => removeSecondaryDivision(index)}>
                                                                <FontAwesomeIcon icon={faTrash} />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                                <Button variant="secondary" onClick={addSecondaryDivision} className="mb-4">
                                                    <FontAwesomeIcon icon={faPlus} /> Ajouter une division secondaire
                                                </Button>

                                                <h5 className="mt-4 mb-3">Partenaires</h5>
                                                {repartition.partenaires.map((p, index) => (
                                                    <div className="row mb-3" key={index}>
                                                        <FormField
                                                            label="Partenaire"
                                                            id={`partenaire-${index}`}
                                                            type="select"
                                                            value={p.partenaireId}
                                                            onChange={(e) => handlePartenaireChange(index, 'partenaireId', e.target.value)}
                                                            options={partenaires.map(part => ({ value: part.id_partenaire, label: part.nom_partenaire }))}
                                                        />
                                                        <FormField
                                                            label="Part du partenaire"
                                                            id={`partenairePart-${index}`}
                                                            type="number"
                                                            placeholder="Part du partenaire"
                                                            value={p.partMission}
                                                            onChange={(e) => handlePartenaireChange(index, 'partMission', e.target.value)}
                                                        />
                                                        <div className="col-md-2 d-flex align-items-end">
                                                            <Button variant="danger" onClick={() => removePartenaire(index)}>
                                                                <FontAwesomeIcon icon={faTrash} />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                                <Button variant="secondary" onClick={addPartenaire} className="mb-4">
                                                    <FontAwesomeIcon icon={faPlus} /> Ajouter un partenaire
                                                </Button>

                                                <h5 className="mt-4 mb-3">Sous-traitants</h5>
                                                {repartition.sousTraitants.map((st, index) => (
                                                    <div className="row mb-3" key={index}>
                                                        <FormField
                                                            label="Sous-traitant"
                                                            id={`sousTraitant-${index}`}
                                                            type="select"
                                                            value={st.sousTraitantId}
                                                            onChange={(e) => handleSousTraitantChange(index, 'sousTraitantId', e.target.value)}
                                                            options={sousTraitants.map(s => ({ value: s.id_soustrait, label: s.nom_soustrait }))}
                                                        />
                                                        <FormField
                                                            label="Part du sous-traitant"
                                                            id={`sousTraitantPart-${index}`}
                                                            type="number"
                                                            placeholder="Part du sous-traitant"
                                                            value={st.partMission}
                                                            onChange={(e) => handleSousTraitantChange(index, 'partMission', e.target.value)}
                                                        />
                                                        <div className="col-md-2 d-flex align-items-end">
                                                            <Button variant="danger" onClick={() => removeSousTraitant(index)}>
                                                                <FontAwesomeIcon icon={faTrash} />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                                <Button variant="secondary" onClick={addSousTraitant} className="mb-4">
                                                    <FontAwesomeIcon icon={faPlus} /> Ajouter un sous-traitant
                                                </Button>

                                                <div className="mt-4">
                                                    <strong>Total des parts: {totalPart.toFixed(2)}</strong>
                                                    {mission && <span> / {mission.partMissionCID} (Part CID de la mission)</span>}
                                                </div>

                                                {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}

                                                <div className="card-action mt-4">
                                                    <Button variant="primary" type="submit" disabled={!!errorMessage}>
                                                        Soumettre la répartition
                                                    </Button>
                                                </div>
                                            </Form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>

            <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'green', marginRight: '8px' }} />
                        Succès
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>La répartition a été enregistrée avec succès.</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseSuccessModal}>
                        Fermer
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default RepartirMissionCD;

