import React, { useState } from 'react';
import { Form, Button, Card, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Sidebar from './components/sideBar';
import MainHeader from './components/mainHeader';
import Footer from './components/footer';

const ConsultMission = () => {
    // Mock data for the mission
    const [mission] = useState({
        id: 1,
        libelle: "Gare LGV Casa Voyageurs",
        prix: '342,000.00',
        forfait: 'Oui',
        division: 'ET',
        pourcentage: '70 %'
    });

    // Mock data for avancements
    const [avancements, setAvancements] = useState([
        { date_mise_a_jour: '2023-05-01T10:00:00', pourcentage_avancement: 30, commentaire: 'Début des travaux' },
        { date_mise_a_jour: '2023-05-15T14:30:00', pourcentage_avancement: 50, commentaire: 'Progression satisfaisante' }
    ]);

    const [newAvancement, setNewAvancement] = useState({
        pourcentage: '',
        commentaire: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAvancement({ ...newAvancement, [name]: value });
    };

    const handleSubmitAvancement = (e) => {
        e.preventDefault();
        const newEntry = {
            date_mise_a_jour: new Date().toISOString(),
            pourcentage_avancement: parseInt(newAvancement.pourcentage),
            commentaire: newAvancement.commentaire
        };
        setAvancements([...avancements, newEntry]);
        setNewAvancement({ pourcentage: '', commentaire: '' });
    };

    return (
        <div className="wrapper">
            <Sidebar />
            <div className="main-panel">
                <MainHeader />
                <div className="container">
                    <div className="page-inner">
                        <div className="page-header">
                            <h4 className="page-title">Consultation de Mission</h4>
                            <Button variant="link" onClick={() => window.history.back()}>
                                <FontAwesomeIcon icon={faArrowLeft} /> Retour
                            </Button>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <Card>
                                    <Card.Header>
                                        <Card.Title>Détails de la Mission</Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                        <p><strong>Libellé :</strong> {mission.libelle}</p>
                                        <p><strong>Prix :</strong> {mission.prix}</p>
                                        <p><strong>Forfait :</strong> {mission.forfait}</p>
                                        <p><strong>Division :</strong> {mission.division}</p>
                                        <p><strong>Pourcentage :</strong> {mission.pourcentage}</p>
                                    </Card.Body>
                                </Card>
                            </div>
                            <div className="col-md-6">
                                <Card>
                                    <Card.Header>
                                        <Card.Title>Mise à jour de l'Avancement</Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                        <Form onSubmit={handleSubmitAvancement}>
                                            <Form.Group>
                                                <Form.Label>Pourcentage d'avancement</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="pourcentage"
                                                    value={newAvancement.pourcentage}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>Commentaire</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    name="commentaire"
                                                    value={newAvancement.commentaire}
                                                    onChange={handleInputChange}
                                                />
                                            </Form.Group>
                                            <Button type="submit" variant="primary" className="mt-3">
                                                Ajouter Avancement
                                            </Button>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            </div>
                        </div>
                        <div className="row mt-4">
                            <div className="col-md-12">
                                <Card>
                                    <Card.Header>
                                        <Card.Title>Historique des Avancements</Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                        <ListGroup>
                                            {avancements.map((avancement, index) => (
                                                <ListGroup.Item key={index}>
                                                    <p style={{ marginRight: '0.5rem' }}><strong>Date :</strong> {new Date(avancement.date_mise_a_jour).toLocaleString()}</p>
                                                    <p style={{ marginRight: '0.5rem' }}><strong>Pourcentage :</strong> {avancement.pourcentage_avancement}%</p>
                                                    <p style={{ marginRight: 0 }}><strong>Commentaire :</strong> {avancement.commentaire}</p>
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    </Card.Body>
                                </Card>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default ConsultMission;