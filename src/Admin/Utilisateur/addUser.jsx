import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Row, Col, InputGroup, Modal } from 'react-bootstrap';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faArrowRight, faUserPlus, faKey, faEye, faEyeSlash, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../components/sideBar';
import MainHeader from '../components/mainHeader';
import Footer from '../components/footer';

const AddUser = () => {
    const initialUserState = {
        prenom: '',
        nom: '',
        email: '',
        num_telephone: '',
        username: '',
        mot_de_passe: '',
        date_naissance: '',
        sexe: 'M',
        adresse: '',
        pole: '',
        division: '',
        pays: '',
        roles: []
    };

    const [newUser, setNewUser] = useState(initialUserState);
    const [showPassword, setShowPassword] = useState(false);
    const [poles, setPoles] = useState([]);
    const [allDivisions, setAllDivisions] = useState([]);
    const [filteredDivisions, setFilteredDivisions] = useState([]);
    const [pays, setPays] = useState([]);
    const [roles, setRoles] = useState([]);
    const [emailValid, setEmailValid] = useState(null);
    const [usernameValid, setUsernameValid] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showPoleInput, setShowPoleInput] = useState(false);
    const [showDivisionInput, setShowDivisionInput] = useState(false);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/roles');
                console.log('Fetched roles:', response.data);
                setRoles(response.data);
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        };
        fetchRoles();
    }, []);

    useEffect(() => {
        fetchPoles();
        fetchDivisions();
        fetchPays();
    }, []);

    const fetchPoles = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/poles');
            setPoles(response.data);
        } catch (error) {
            console.error('Error fetching poles:', error);
        }
    };

    const fetchDivisions = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/divisions');
            setAllDivisions(response.data);
        } catch (error) {
            console.error('Error fetching divisions:', error);
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });

        if (name === 'pole') {
            const selectedPoleId = value;
            const relatedDivisions = allDivisions.filter(division => division.pole.id_pole.toString() === selectedPoleId);
            setFilteredDivisions(relatedDivisions);
            setNewUser(prevState => ({ ...prevState, pole: selectedPoleId, division: '' }));
        }

        if (name === 'email') {
            validateEmail(value);
        }

        if (name === 'username') {
            validateUsername(value);
        }
    };

    const handleRoleChange = (selectedOptions) => {
        const selectedRoles = selectedOptions.map(option => ({
            id_role: option.value,
            nom_role: option.label,
            requiresPole: roles.find(r => r.id_role === option.value).requiresPole,
            requiresDivision: roles.find(r => r.id_role === option.value).requiresDivision
        }));
        console.log('Selected roles:', selectedRoles);
        setNewUser({ ...newUser, roles: selectedRoles });
        updateInputVisibility(selectedRoles);
    };

    const updateInputVisibility = (selectedRoles) => {
        const requiresPole = selectedRoles.some(role => role.requiresPole);
        const requiresDivision = selectedRoles.some(role => role.requiresDivision);
        
        console.log('Visibility update:', { requiresPole, requiresDivision });
        
        setShowPoleInput(requiresPole);
        setShowDivisionInput(requiresDivision);
        
        if (!requiresPole) {
            setNewUser(prevState => ({ ...prevState, pole: '', division: '' }));
        } else if (!requiresDivision) {
            setNewUser(prevState => ({ ...prevState, division: '' }));
        }
    };

    const validateEmail = async (email) => {
        if (email.length > 0) {
            try {
                const response = await axios.get(`http://localhost:8080/api/utilisateurs/check-email?email=${email}`);
                setEmailValid(response.data);
            } catch (error) {
                console.error('Error validating email:', error);
                setEmailValid(false);
            }
        } else {
            setEmailValid(null);
        }
    };

    const validateUsername = async (username) => {
        if (username.length > 0) {
            try {
                const response = await axios.get(`http://localhost:8080/api/utilisateurs/check-username?username=${username}`);
                setUsernameValid(response.data);
            } catch (error) {
                console.error('Error validating username:', error);
                setUsernameValid(false);
            }
        } else {
            setUsernameValid(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userToSend = {
                ...newUser,
                pole: newUser.pole ? { id_pole: parseInt(newUser.pole) } : null,
                division: newUser.division ? { id_division: parseInt(newUser.division) } : null,
                pays: newUser.pays ? { id_pays: parseInt(newUser.pays) } : null,
                date_naissance: newUser.date_naissance || null,
                roles: newUser.roles
            };
            console.log('Sending user data:', userToSend);
            const response = await axios.post('http://localhost:8080/api/utilisateurs', userToSend);
            console.log('New user created:', response.data);
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Error creating user:', error.response?.data || error.message);
            // Show error message
        }
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        window.location.reload(); // Reload the page
    };

    const generatePassword = () => {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
        let password = "";
        for (let i = 0; i < 12; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        setNewUser({ ...newUser, mot_de_passe: password });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        console.log('State updated:', { showPoleInput, showDivisionInput });
    }, [showPoleInput, showDivisionInput]);

    return (
        <div className="wrapper">
            <Sidebar />
            <div className="main-panel">
                <MainHeader />
                <div className="container">
                    <div className="page-inner">
                        <div className="page-header">
                            <h3 className="fw-bold mb-3">Ajouter un Utilisateur</h3>
                            <ul className="breadcrumbs mb-3">
                                <li className="nav-home">
                                    <span><FontAwesomeIcon icon={faHome} /></span>
                                </li>
                                <li className="separator">
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </li>
                                <li className="nav-item">
                                    <span>Ajouter un Utilisateur</span>
                                </li>
                            </ul>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h4 className="card-title">Formulaire d'ajout d'utilisateur</h4>
                                    </div>
                                    <div className="card-body">
                                        <Form onSubmit={handleSubmit}>
                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Prénom</Form.Label>
                                                        <Form.Control 
                                                            type="text" 
                                                            name="prenom"
                                                            value={newUser.prenom}
                                                            onChange={handleInputChange}
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Nom</Form.Label>
                                                        <Form.Control 
                                                            type="text" 
                                                            name="nom"
                                                            value={newUser.nom}
                                                            onChange={handleInputChange}
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Email</Form.Label>
                                                        <Form.Control 
                                                            type="email" 
                                                            name="email"
                                                            value={newUser.email}
                                                            onChange={handleInputChange}
                                                            required
                                                            isValid={emailValid === true}
                                                            isInvalid={emailValid === false}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            Cet email est déjà utilisé.
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Nom d'utilisateur</Form.Label>
                                                        <Form.Control 
                                                            type="text" 
                                                            name="username"
                                                            value={newUser.username}
                                                            onChange={handleInputChange}
                                                            required
                                                            isValid={usernameValid === true}
                                                            isInvalid={usernameValid === false}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            Ce nom d'utilisateur est déjà pris.
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Numéro de téléphone</Form.Label>
                                                        <Form.Control 
                                                            type="tel" 
                                                            name="num_telephone"
                                                            value={newUser.num_telephone}
                                                            onChange={handleInputChange}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Mot de passe</Form.Label>
                                                        <InputGroup className="password-input-group">
                                                            <Form.Control 
                                                                type={showPassword ? "text" : "password"}
                                                                name="mot_de_passe"
                                                                value={newUser.mot_de_passe}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                            <Button variant="outline-secondary" onClick={togglePasswordVisibility}>
                                                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                                            </Button>
                                                            <Button variant="outline-secondary" onClick={generatePassword}>
                                                                <FontAwesomeIcon icon={faKey} /> Générer
                                                            </Button>
                                                        </InputGroup>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Date de naissance</Form.Label>
                                                        <Form.Control 
                                                            type="date" 
                                                            name="date_naissance"
                                                            value={newUser.date_naissance}
                                                            onChange={handleInputChange}
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Sexe</Form.Label>
                                                        <Form.Control 
                                                            as="select"
                                                            name="sexe"
                                                            value={newUser.sexe}
                                                            onChange={handleInputChange}
                                                            required
                                                        >
                                                            <option value="M">Homme</option>
                                                            <option value="F">Femme</option>
                                                        </Form.Control>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Adresse</Form.Label>
                                                <Form.Control 
                                                    type="text" 
                                                    name="adresse"
                                                    value={newUser.adresse}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Rôles</Form.Label>
                                                <Select
                                                    isMulti
                                                    name="roles"
                                                    options={roles.map(role => ({ 
                                                        value: role.id_role, 
                                                        label: role.nom_role,
                                                        requiresPole: role.requiresPole,
                                                        requiresDivision: role.requiresDivision
                                                    }))}
                                                    className="basic-multi-select"
                                                    classNamePrefix="select"
                                                    onChange={handleRoleChange}
                                                    value={newUser.roles.map(role => ({ 
                                                        value: role.id_role, 
                                                        label: role.nom_role
                                                    }))}
                                                />
                                            </Form.Group>
                                            {showPoleInput && (
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Pôle</Form.Label>
                                                    <Form.Control 
                                                        as="select"
                                                        name="pole"
                                                        value={newUser.pole}
                                                        onChange={handleInputChange}
                                                        required={showPoleInput}
                                                    >
                                                        <option value="">Sélectionnez un pôle</option>
                                                        {poles.map((pole) => (
                                                            <option key={pole.id_pole} value={pole.id_pole}>{pole.libelle_pole}</option>
                                                        ))}
                                                    </Form.Control>
                                                </Form.Group>
                                            )}
                                            {showDivisionInput && (
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Division</Form.Label>
                                                    <Form.Control 
                                                        as="select"
                                                        name="division"
                                                        value={newUser.division}
                                                        onChange={handleInputChange}
                                                        required={showDivisionInput}
                                                        disabled={!newUser.pole}
                                                    >
                                                        <option value="">Sélectionnez une division</option>
                                                        {filteredDivisions.map((division) => (
                                                            <option key={division.id_division} value={division.id_division}>{division.nom_division}</option>
                                                        ))}
                                                    </Form.Control>
                                                </Form.Group>
                                            )}
                                            <Form.Group className="mb-3">
                                                <Form.Label>Pays</Form.Label>
                                                <Form.Control 
                                                    as="select"
                                                    name="pays"
                                                    value={newUser.pays}
                                                    onChange={handleInputChange}
                                                    required
                                                >
                                                    <option value="">Sélectionnez un pays</option>
                                                    {pays.map((pays, index) => (
                                                        <option key={index} value={pays.id_pays}>{pays.libelle_pays}</option>
                                                    ))}
                                                </Form.Control>
                                            </Form.Group>
                                            <Button type="submit" variant="primary" className="mt-3">
                                                <FontAwesomeIcon icon={faUserPlus} className="mr-2" /> Ajouter l'Utilisateur
                                            </Button>
                                        </Form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>

            {/* Success Modal */}
            <Modal show={showSuccessModal} onHide={handleCloseSuccessModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Succès</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        <FontAwesomeIcon icon={faCheckCircle} className="text-success mr-2" />&nbsp;
                        L'utilisateur a été créé avec succès!
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseSuccessModal}>
                        Fermer
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AddUser;
