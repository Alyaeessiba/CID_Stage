import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faHome, 
    faSitemap, 
    faBuilding, 
    faUserTag, 
    faUsers, 
    faTags, 
    faGlobeAmericas, 
    faHandshake,
    faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Sidebar from './components/sideBar';
import MainHeader from './components/mainHeader';
import Footer from './components/footer';

const HomeAdmin = () => {
    const [stats, setStats] = useState({
        poles: 0,
        divisions: 0,
        roles: 0,
        users: 0,
        unites: 0,
        pays: 0,
        sousTraitants: 0,
        partenaires: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [poles, divisions, roles, users, unites, pays, sousTraitants, partenaires] = await Promise.all([
                    axios.get('http://localhost:8080/api/poles'),
                    axios.get('http://localhost:8080/api/divisions'),
                    axios.get('http://localhost:8080/api/roles'),
                    axios.get('http://localhost:8080/api/utilisateurs'),
                    axios.get('http://localhost:8080/api/unites'),
                    axios.get('http://localhost:8080/api/pays'),
                    axios.get('http://localhost:8080/api/sous-traitants'),
                    axios.get('http://localhost:8080/api/partenaires')
                ]);

                setStats({
                    poles: poles.data.length,
                    divisions: divisions.data.length,
                    roles: roles.data.length,
                    users: users.data.length,
                    unites: unites.data.length,
                    pays: pays.data.length,
                    sousTraitants: sousTraitants.data.length,
                    partenaires: partenaires.data.length
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchStats();
    }, []);

    const StatCard = ({ title, count, icon, link }) => (
        <Col md={3} sm={6} className="mb-4">
            <Card>
                <Card.Body>
                    <div className="d-flex align-items-center">
                        <div className="icon-big text-center icon-warning">
                            <FontAwesomeIcon icon={icon} className="text-warning" />
                        </div>
                        <div className="numbers ms-3">
                            <p className="card-category">{title}</p>
                            <Card.Title as="h4">{count}</Card.Title>
                        </div>
                    </div>
                </Card.Body>
                <Card.Footer>
                    <hr />
                    <div className="stats">
                        <Link to={link}>View Details</Link>
                    </div>
                </Card.Footer>
            </Card>
        </Col>
    );

    return (
        <div className="wrapper">
            <Sidebar />
            <div className="main-panel">
                <MainHeader />
                <div className="container">
                    <div className="page-inner">
                        <div className="page-header">
                            <h3 className="fw-bold mb-3">Admin Dashboard</h3>
                            <ul className="breadcrumbs mb-3">
                                <li className="nav-home">
                                    <FontAwesomeIcon icon={faHome} />
                                </li>
                                <li className="separator">
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </li>
                                <li className="nav-item">
                                    <span>Dashboard</span>
                                </li>
                            </ul>
                        </div>
                        <div className="row">
                            <StatCard title="Pôles" count={stats.poles} icon={faSitemap} link="/afficherPole" />
                            <StatCard title="Divisions" count={stats.divisions} icon={faBuilding} link="/afficherDivision" />
                            <StatCard title="Rôles" count={stats.roles} icon={faUserTag} link="/afficherRole" />
                            <StatCard title="Utilisateurs" count={stats.users} icon={faUsers} link="/afficherUser" />
                        </div>
                        <div className="row">
                            <StatCard title="Unités" count={stats.unites} icon={faTags} link="/afficherUnite" />
                            <StatCard title="Pays" count={stats.pays} icon={faGlobeAmericas} link="/afficherPays" />
                            <StatCard title="Sous Traitants" count={stats.sousTraitants} icon={faUsers} link="/afficherSousTraitant" />
                            <StatCard title="Partenaires" count={stats.partenaires} icon={faHandshake} link="/afficherPartenaire" />
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-12">
                                <Card>
                                    <Card.Header>
                                        <Card.Title as="h4">Quick Actions</Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col md={3}>
                                                <Link to="/AddUser" className="btn btn-primary btn-block">
                                                    <FontAwesomeIcon icon={faUsers} className="me-2" />
                                                    Add New User
                                                </Link>
                                            </Col>
                                            {/* Add more quick action buttons as needed */}
                                        </Row>
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

export default HomeAdmin;
