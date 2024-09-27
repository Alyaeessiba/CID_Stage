import React, { useState, useEffect } from 'react';
import { Form, Button, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './components/sideBar';
import MainHeader from './components/mainHeader';
import Footer from './components/footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faArrowRight, faEdit, faSave } from '@fortawesome/free-solid-svg-icons';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [error, setError] = useState('');
    const [countries, setCountries] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserData();
        fetchCountries();
    }, []);

    const fetchUserData = async () => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            try {
                const response = await axios.get(`http://localhost:8080/api/utilisateurs/${userId}`);
                setUser(response.data);
                setFormData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Failed to load user data. Please try again later.');
            }
        }
    };

    const fetchCountries = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/pays');
            setCountries(response.data);
        } catch (error) {
            console.error('Error fetching countries:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "pays") {
            // For country, we need to set the whole country object
            const selectedCountry = countries.find(country => country.id_pays.toString() === value);
            setFormData(prevData => ({
                ...prevData,
                pays: selectedCountry
            }));
        } else {
            setFormData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleSaveEdit = async () => {
        try {
            // Create a copy of formData to modify
            const updatedFormData = { ...formData };
            
            // If pays is an object, ensure we're just sending the id
            if (updatedFormData.pays && typeof updatedFormData.pays === 'object') {
                updatedFormData.pays = { id_pays: updatedFormData.pays.id_pays };
            }

            const response = await axios.put(`http://localhost:8080/api/utilisateurs/${user.id_utilisateur}`, updatedFormData);
            setUser(response.data);
            setIsEditing(false);
            setError('');
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Failed to update profile. Please try again.');
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/utilisateurs/${user.id_utilisateur}`);
            localStorage.removeItem('userId');
            navigate('/login');
        } catch (error) {
            console.error('Error deleting account:', error);
            setError('Failed to delete account. Please try again.');
        }
    };

    if (!user) return <div className="wrapper"><div className="main-panel"><div className="content">Loading...</div></div></div>;

    return (
        <div className="wrapper">
            <Sidebar />
            <div className="main-panel">
                <MainHeader />
                <div className="container">
                    <div className="page-inner">
                        <div className="page-header">
                            <h3 className="fw-bold mb-3">Profile</h3>
                            <ul className="breadcrumbs mb-3">
                                <li className="nav-home">
                                    <FontAwesomeIcon icon={faHome} />
                                </li>
                                <li className="separator">
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </li>
                                <li className="nav-item">
                                    <span>Profile</span>
                                </li>
                            </ul>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                        <h4 className="card-title">User Information</h4>
                                        <Button 
                                            variant="primary" 
                                            onClick={() => {
                                                if (isEditing) {
                                                    handleSaveEdit();
                                                } else {
                                                    setIsEditing(true);
                                                }
                                            }}
                                        >
                                            <FontAwesomeIcon icon={isEditing ? faSave : faEdit} /> &nbsp;
                                            {isEditing ? 'Save' : 'Edit'}
                                        </Button>
                                    </div>
                                    <div className="card-body">
                                        {error && <Alert variant="danger">{error}</Alert>}
                                        <Form>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>First Name</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="prenom"
                                                            value={formData.prenom || ''}
                                                            onChange={handleInputChange}
                                                            disabled={!isEditing}
                                                        />
                                                    </Form.Group>
                                                </div>
                                                <div className="col-md-6">
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Last Name</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="nom"
                                                            value={formData.nom || ''}
                                                            onChange={handleInputChange}
                                                            disabled={!isEditing}
                                                        />
                                                    </Form.Group>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Email</Form.Label>
                                                        <Form.Control
                                                            type="email"
                                                            name="email"
                                                            value={formData.email || ''}
                                                            onChange={handleInputChange}
                                                            disabled={!isEditing}
                                                        />
                                                    </Form.Group>
                                                </div>
                                                <div className="col-md-6">
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Username</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="username"
                                                            value={formData.username || ''}
                                                            onChange={handleInputChange}
                                                            disabled={!isEditing}
                                                        />
                                                    </Form.Group>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Phone Number</Form.Label>
                                                        <Form.Control
                                                            type="tel"
                                                            name="num_telephone"
                                                            value={formData.num_telephone || ''}
                                                            onChange={handleInputChange}
                                                            disabled={!isEditing}
                                                        />
                                                    </Form.Group>
                                                </div>
                                                <div className="col-md-6">
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Date of Birth</Form.Label>
                                                        <Form.Control
                                                            type="date"
                                                            name="date_naissance"
                                                            value={formData.date_naissance || ''}
                                                            onChange={handleInputChange}
                                                            disabled={!isEditing}
                                                        />
                                                    </Form.Group>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Gender</Form.Label>
                                                        <Form.Control
                                                            as="select"
                                                            name="sexe"
                                                            value={formData.sexe || ''}
                                                            onChange={handleInputChange}
                                                            disabled={!isEditing}
                                                        >
                                                            <option value="">Select Gender</option>
                                                            <option value="M">Male</option>
                                                            <option value="F">Female</option>
                                                        </Form.Control>
                                                    </Form.Group>
                                                </div>
                                                <div className="col-md-6">
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Country</Form.Label>
                                                        <Form.Control
                                                            as="select"
                                                            name="pays"
                                                            value={formData.pays?.id_pays || ''}
                                                            onChange={handleInputChange}
                                                            disabled={!isEditing}
                                                        >
                                                            <option value="">Select Country</option>
                                                            {countries.map(country => (
                                                                <option key={country.id_pays} value={country.id_pays}>
                                                                    {country.libelle_pays}
                                                                </option>
                                                            ))}
                                                        </Form.Control>
                                                    </Form.Group>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Address</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="adresse"
                                                            value={formData.adresse || ''}
                                                            onChange={handleInputChange}
                                                            disabled={!isEditing}
                                                        />
                                                    </Form.Group>
                                                </div>
                                            </div>
                                        </Form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-12">
                                <Button variant="danger" className="btn-fill" onClick={() => setShowDeleteModal(true)}>
                                    Delete Account
                                </Button>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Account Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete your account? This action cannot be undone.</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteAccount}>
                        Delete Account
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ProfilePage;