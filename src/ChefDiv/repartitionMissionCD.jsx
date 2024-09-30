import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Row, Col, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faHome, faArrowRight, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import Sidebar from './components/sideBar';
import MainHeader from './components/mainHeader';
import Footer from './components/footer';
import Select from 'react-select';

const FormField = ({ label, id, type = 'text', name, value, onChange, options, disabled, required }) => (
    <Form.Group className="mb-3">
        <Form.Label>{label}</Form.Label>
        {type === 'select' ? (
            <Form.Control
                as="select"
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
            >
                <option value="">Sélectionnez une option</option>
                {options && options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </Form.Control>
        ) : (
            <Form.Control
                type={type}
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
            />
        )}
    </Form.Group>
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
    const [errorMessage, setErrorMessage] = useState('');
    const [totalPart, setTotalPart] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const calculateTotalPart = useCallback((repartitionData) => {
        const total = repartitionData.principalDivisionPart +
            repartitionData.secondaryDivisions.reduce((sum, div) => sum + (div.partMission || 0), 0) +
            repartitionData.partenaires.reduce((sum, p) => sum + (p.partMission || 0), 0) +
            repartitionData.sousTraitants.reduce((sum, st) => sum + (st.partMission || 0), 0);
        setTotalPart(total);
        validateTotalPart(total);
    }, []);

    const validateTotalPart = useCallback((total) => {
        if (mission && total > mission.partMissionCID) {
            setErrorMessage(`Le total des parts (${total.toFixed(2)}) dépasse la part CID de la mission (${mission.partMissionCID}).`);
        } else {
            setErrorMessage('');
        }
    }, [mission]);

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

                if (missionRes.data) {
                    const newRepartition = {
                        principalDivisionPart: missionRes.data.partDivPrincipale || 0,
                        secondaryDivisions: missionRes.data.missionDivisions?.map(sd => ({
                            divisionId: sd.division?.id_division,
                            partMission: sd.partMission,
                            divisionName: sd.division?.nom_division
                        })) || [],
                        partenaires: missionRes.data.missionPartenaires?.map(p => ({
                            partenaireId: p.partenaire?.id_partenaire,
                            partMission: p.partMission,
                            partenaireName: p.partenaire?.nom_partenaire
                        })) || [],
                        sousTraitants: missionRes.data.missionSousTraitants?.map(st => ({
                            sousTraitantId: st.sousTraitant?.id_soustrait,
                            partMission: st.partMission,
                            sousTraitantName: st.sousTraitant?.nom_soustrait
                        })) || []
                    };
                    setRepartition(newRepartition);
                    calculateTotalPart(newRepartition);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setErrorMessage(`Error fetching data: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [idMission, calculateTotalPart]);

    const handlePrincipalDivisionPartChange = (e) => {
        const value = parseFloat(e.target.value) || 0;
        setRepartition(prev => {
            const newRepartition = { ...prev, principalDivisionPart: value };
            calculateTotalPart(newRepartition);
            return newRepartition;
        });
    };

    const handleSecondaryDivisionChange = (index, field, value) => {
        setRepartition(prev => {
            const updatedDivisions = [...prev.secondaryDivisions];
            if (field === 'divisionId') {
                const selectedDivision = divisions.find(d => d.id_division === value);
                updatedDivisions[index] = {
                    ...updatedDivisions[index],
                    divisionId: value,
                    divisionName: selectedDivision ? selectedDivision.nom_division : ''
                };
            } else {
                updatedDivisions[index][field] = field === 'partMission' ? parseFloat(value) || 0 : value;
            }
            const newRepartition = { ...prev, secondaryDivisions: updatedDivisions };
            calculateTotalPart(newRepartition);
            return newRepartition;
        });
    };

    const addSecondaryDivision = () => {
        setRepartition(prev => {
            const newRepartition = {
                ...prev,
                secondaryDivisions: [...prev.secondaryDivisions, { divisionId: '', partMission: 0 }]
            };
            calculateTotalPart(newRepartition);
            return newRepartition;
        });
    };

    const removeSecondaryDivision = (index) => {
        setRepartition(prev => {
            const newRepartition = {
                ...prev,
                secondaryDivisions: prev.secondaryDivisions.filter((_, i) => i !== index)
            };
            calculateTotalPart(newRepartition);
            return newRepartition;
        });
    };

    const handlePartenaireChange = (index, field, value) => {
        setRepartition(prev => {
            const updatedPartenaires = [...prev.partenaires];
            if (field === 'partenaireId') {
                const selectedPartenaire = partenaires.find(p => p.id_partenaire === value);
                updatedPartenaires[index] = {
                    ...updatedPartenaires[index],
                    partenaireId: value,
                    partenaireName: selectedPartenaire ? selectedPartenaire.nom_partenaire : ''
                };
            } else {
                updatedPartenaires[index][field] = field === 'partMission' ? parseFloat(value) || 0 : value;
            }
            const newRepartition = { ...prev, partenaires: updatedPartenaires };
            calculateTotalPart(newRepartition);
            return newRepartition;
        });
    };

    const addPartenaire = () => {
        setRepartition(prev => {
            const newRepartition = {
                ...prev,
                partenaires: [...prev.partenaires, { partenaireId: '', partMission: 0 }]
            };
            calculateTotalPart(newRepartition);
            return newRepartition;
        });
    };

    const removePartenaire = (index) => {
        setRepartition(prev => {
            const newRepartition = {
                ...prev,
                partenaires: prev.partenaires.filter((_, i) => i !== index)
            };
            calculateTotalPart(newRepartition);
            return newRepartition;
        });
    };

    const handleSousTraitantChange = (index, field, value) => {
        setRepartition(prev => {
            const updatedSousTraitants = [...prev.sousTraitants];
            if (field === 'sousTraitantId') {
                const selectedSousTraitant = sousTraitants.find(st => st.id_soustrait === value);
                updatedSousTraitants[index] = {
                    ...updatedSousTraitants[index],
                    sousTraitantId: value,
                    sousTraitantName: selectedSousTraitant ? selectedSousTraitant.nom_soustrait : ''
                };
            } else {
                updatedSousTraitants[index][field] = field === 'partMission' ? parseFloat(value) || 0 : value;
            }
            const newRepartition = { ...prev, sousTraitants: updatedSousTraitants };
            calculateTotalPart(newRepartition);
            return newRepartition;
        });
    };

    const addSousTraitant = () => {
        setRepartition(prev => {
            const newRepartition = {
                ...prev,
                sousTraitants: [...prev.sousTraitants, { sousTraitantId: '', partMission: 0 }]
            };
            calculateTotalPart(newRepartition);
            return newRepartition;
        });
    };

    const removeSousTraitant = (index) => {
        setRepartition(prev => {
            const newRepartition = {
                ...prev,
                sousTraitants: prev.sousTraitants.filter((_, i) => i !== index)
            };
            calculateTotalPart(newRepartition);
            return newRepartition;
        });
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
        window.location.reload();
    };

    if (loading) {
        return <div>Chargement...</div>;
    }

    return (
        <div className="wrapper">
            <Sidebar />
            <div className="main-panel">
                <MainHeader /><br />
                <div className="content">
                    <div className="container-fluid">
                        <div className="page-header">
                            <h3 className="fw-bold mb-3">Répartition de la Mission</h3>
                            <ul className="breadcrumbs mb-3">
                                <li className="nav-home">
                                    <span><FontAwesomeIcon icon={faHome} /></span>
                                </li>
                                <li className="separator">
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </li>
                                <li className="nav-item">
                                    <span>Répartition de la Mission</span>
                                </li>
                            </ul>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h4 className="card-title">Formulaire de répartition de la mission: {mission.libelle_mission}</h4>
                                    </div>
                                    <div className="card-body">
                                        <Form onSubmit={handleSubmit}>
                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Division Principale</Form.Label>
                                                        <Select
                                                            id="principalDivision"
                                                            name="principalDivision"
                                                            value={{ 
                                                                value: mission.principalDivision?.id_division, 
                                                                label: mission.principalDivision?.nom_division 
                                                            }}
                                                            options={[{ 
                                                                value: mission.principalDivision?.id_division, 
                                                                label: mission.principalDivision?.nom_division 
                                                            }]}
                                                            isDisabled={true}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Part de la division principale</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            id="principalDivisionPart"
                                                            name="principalDivisionPart"
                                                            value={repartition.principalDivisionPart}
                                                            onChange={handlePrincipalDivisionPartChange}
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>

                                            <h5 className="mt-4">Divisions Secondaires</h5>
                                            {repartition.secondaryDivisions.map((div, index) => (
                                                <Row key={index}>
                                                    <Col md={5}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Division</Form.Label>
                                                            <Select
                                                                id={`secondaryDivision-${index}`}
                                                                name={`secondaryDivision-${index}`}
                                                                value={{ value: div.divisionId, label: div.divisionName }}
                                                                onChange={(selectedOption) => handleSecondaryDivisionChange(index, 'divisionId', selectedOption.value)}
                                                                options={divisions.map(d => ({ 
                                                                    value: d.id_division, 
                                                                    label: d.nom_division 
                                                                }))}
                                                                required
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={5}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Part de cette division</Form.Label>
                                                            <Form.Control
                                                                type="number"
                                                                id={`secondaryDivisionPart-${index}`}
                                                                name={`secondaryDivisionPart-${index}`}
                                                                value={div.partMission}
                                                                onChange={(e) => handleSecondaryDivisionChange(index, 'partMission', e.target.value)}
                                                                required
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={2} className="d-flex align-items-end mb-3">
                                                        <Button variant="danger" onClick={() => removeSecondaryDivision(index)}>
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            ))}
                                            <Button variant="secondary" onClick={addSecondaryDivision} className="mb-4">
                                                <FontAwesomeIcon icon={faPlus} /> Ajouter une division secondaire
                                            </Button>

                                            <h5 className="mt-4">Partenaires</h5>
                                            {repartition.partenaires.map((p, index) => (
                                                <Row key={index}>
                                                    <Col md={5}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Partenaire</Form.Label>
                                                            <Select
                                                                id={`partenaire-${index}`}
                                                                name={`partenaire-${index}`}
                                                                value={{ value: p.partenaireId, label: p.partenaireName }}
                                                                onChange={(selectedOption) => handlePartenaireChange(index, 'partenaireId', selectedOption.value)}
                                                                options={partenaires.map(part => ({ 
                                                                    value: part.id_partenaire, 
                                                                    label: part.nom_partenaire 
                                                                }))}
                                                                required
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={5}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Part du partenaire</Form.Label>
                                                            <Form.Control
                                                                type="number"
                                                                id={`partenairePart-${index}`}
                                                                name={`partenairePart-${index}`}
                                                                value={p.partMission}
                                                                onChange={(e) => handlePartenaireChange(index, 'partMission', e.target.value)}
                                                                required
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={2} className="d-flex align-items-end mb-3">
                                                        <Button variant="danger" onClick={() => removePartenaire(index)}>
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            ))}
                                            <Button variant="secondary" onClick={addPartenaire} className="mb-4">
                                                <FontAwesomeIcon icon={faPlus} /> Ajouter un partenaire
                                            </Button>

                                            <h5 className="mt-4">Sous-traitants</h5>
                                            {repartition.sousTraitants.map((st, index) => (
                                                <Row key={index}>
                                                    <Col md={5}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Sous-traitant</Form.Label>
                                                            <Select
                                                                id={`sousTraitant-${index}`}
                                                                name={`sousTraitant-${index}`}
                                                                value={{ value: st.sousTraitantId, label: st.sousTraitantName }}
                                                                onChange={(selectedOption) => handleSousTraitantChange(index, 'sousTraitantId', selectedOption.value)}
                                                                options={sousTraitants.map(s => ({ 
                                                                    value: s.id_soustrait, 
                                                                    label: s.nom_soustrait 
                                                                }))}
                                                                required
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={5}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Part du sous-traitant</Form.Label>
                                                            <Form.Control
                                                                type="number"
                                                                id={`sousTraitantPart-${index}`}
                                                                name={`sousTraitantPart-${index}`}
                                                                value={st.partMission}
                                                                onChange={(e) => handleSousTraitantChange(index, 'partMission', e.target.value)}
                                                                required
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={2} className="d-flex align-items-end mb-3">
                                                        <Button variant="danger" onClick={() => removeSousTraitant(index)}>
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            ))}
                                            <Button variant="secondary" onClick={addSousTraitant} className="mb-4">
                                                <FontAwesomeIcon icon={faPlus} /> Ajouter un sous-traitant
                                            </Button>

                                            <div className="mt-4">
                                                <strong>Total des parts: {totalPart.toFixed(2)} / {mission.partMissionCID} (Part CID de la mission)</strong>
                                            </div>

                                            {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}

                                            <Button variant="primary" type="submit" className="mt-4" disabled={!!errorMessage}>
                                                Soumettre la répartition
                                            </Button>
                                        </Form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
            <Modal show={showSuccessModal} onHide={handleCloseSuccessModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Succès</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <FontAwesomeIcon icon={faCheckCircle} size="4x" color="green" className="mb-3" />
                    <p>La répartition a été soumise avec succès.</p>
                </Modal.Body>
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