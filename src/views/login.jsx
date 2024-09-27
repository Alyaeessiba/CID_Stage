import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function Login() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setUser } = useUser();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const trimmedLowercaseIdentifier = identifier.trim().toLowerCase();
            const response = await axios.post('http://localhost:8080/api/utilisateurs/login', {
                identifier: trimmedLowercaseIdentifier,
                password
            });
            console.log('Login response:', response.data);
            if (response.data.redirectionLink) {
                // Save user information
                const userId = response.data.id_utilisateur; // Make sure this matches the field name in your API response
                setUser({
                    id_utilisateur: userId,
                    username: response.data.username || trimmedLowercaseIdentifier,
                    email: response.data.email || trimmedLowercaseIdentifier
                });
                // Save user ID in local storage
                localStorage.setItem('userId', userId);
                console.log('Saved userId to localStorage:', userId);
                navigate(response.data.redirectionLink);
            } else {
                setError('Connexion réussie mais aucun lien de redirection fourni.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Identifiants invalides. Veuillez réessayer.');
        }
    };

    return (
        <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
            <Card className="login-card" style={{ width: '100%', maxWidth: '500px' }}> 
                <Card.Body className="p-5">
                    <div className="text-center mb-5">
                        <Image src="/assets/img/logo.png" alt="Logo" style={{ maxWidth: '200px', width: '100%' }} />
                    </div>
                    <h2 className="text-center mb-4">Connexion</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-4">
                            <Form.Label>Email ou Nom d'utilisateur</Form.Label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <FontAwesomeIcon icon={identifier.includes('@') ? faEnvelope : faUser} />
                                </span>
                                <Form.Control
                                    type="text"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    required
                                    placeholder="Entrez votre email ou nom d'utilisateur"
                                    className="py-3"
                                />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Mot de passe</Form.Label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <FontAwesomeIcon icon={faLock} />
                                </span>
                                <Form.Control
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Entrez votre mot de passe"
                                    className="py-3"
                                />
                            </div>
                        </Form.Group>

                        <Button type="submit" className="w-100 btn btn-lg btn-primary py-3">
                            Se connecter
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default Login;