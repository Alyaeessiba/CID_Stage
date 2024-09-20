/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBriefcase, 
  faCalendarAlt,
  faBell,
  faHome,
  faArrowRight,
  faHeart,
  faListAlt,
  faChartBar
} from '@fortawesome/free-solid-svg-icons';
import Sidebar from './components/sideBar';
import MainHeader from './components/mainHeader';
import Chart from 'react-apexcharts';

const HomeCD = () => {
    const [affaireStats] = useState({
        total: 12,
        enCours: 6,
        terminees: 6,
    });

    const [recentNotifications] = useState([
        { id: 1, message: "Nouvelle affaire assignée: Étude structurelle pour le projet Y" },
        { id: 2, message: "Rapport hebdomadaire en attente de révision" },
        { id: 3, message: "Réunion de division prévue demain à 14h" },
    ]);

    const chartOptions = {
        chart: {
            id: "basic-bar",
            toolbar: {
                show: true
            }
        },
        xaxis: {
            categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']
        },
        colors: ['#36A2EB']
    };

    const chartSeries = [
        {
            name: "Affaires terminées",
            data: [25, 35, 40, 45, 55, 50, 65, 80, 75, 85, 90, 95]
        }
    ];

    return (
        <div className="wrapper">
            <Sidebar />
            <div className="main-panel">
                <MainHeader />
                <div className="container">
                    <div className="page-inner">
                        <div className="page-header">
                            <h4 className="page-title">Accueil Chef de Division</h4>
                            <ul className="breadcrumbs">
                                <li className="nav-home">
                                    <Button variant="link" className="nav-link">
                                        <FontAwesomeIcon icon={faHome} />
                                    </Button>
                                </li>
                                <li className="separator">
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </li>
                                <li className="nav-item">
                                    <Button variant="link" className="nav-link">Accueil</Button>
                                </li>
                            </ul>
                        </div>
                        <h4>Aperçu des Affaires de la Division</h4>
                        <Row className="mb-4">
                            <Col md={4}>
                                <Card className="card-stats card-round">
                                    <Card.Body>
                                        <Row>
                                            <Col xs={4}>
                                                <div className="icon-big text-center">
                                                    <FontAwesomeIcon icon={faBriefcase} className="text-warning" />
                                                </div>
                                            </Col>
                                            <Col xs={8} className="col-stats">
                                                <div className="numbers">
                                                    <p className="card-category">Affaires Totales</p>
                                                    <Card.Title as="h4">{affaireStats.total}</Card.Title>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                    <Card.Footer>
                                        <hr />
                                        <div className="stats">
                                            <FontAwesomeIcon icon={faCalendarAlt} className="me-1" /> Dernière mise à jour il y a 1 jour
                                        </div>
                                    </Card.Footer>
                                </Card>
                            </Col>
                            <Col md={4}>
                                <Card className="card-stats card-round">
                                    <Card.Body>
                                        <Row>
                                            <Col xs={4}>
                                                <div className="icon-big text-center">
                                                    <FontAwesomeIcon icon={faListAlt} className="text-success" />
                                                </div>
                                            </Col>
                                            <Col xs={8} className="col-stats">
                                                <div className="numbers">
                                                    <p className="card-category">Affaires en Cours</p>
                                                    <Card.Title as="h4">{affaireStats.enCours}</Card.Title>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                    <Card.Footer>
                                        <hr />
                                        <div className="stats">
                                            <FontAwesomeIcon icon={faCalendarAlt} className="me-1" /> Dernière mise à jour il y a 1 jour
                                        </div>
                                    </Card.Footer>
                                </Card>
                            </Col>
                            <Col md={4}>
                                <Card className="card-stats card-round">
                                    <Card.Body>
                                        <Row>
                                            <Col xs={4}>
                                                <div className="icon-big text-center">
                                                    <FontAwesomeIcon icon={faChartBar} className="text-danger" />
                                                </div>
                                            </Col>
                                            <Col xs={8} className="col-stats">
                                                <div className="numbers">
                                                    <p className="card-category">Affaires Terminées</p>
                                                    <Card.Title as="h4">{affaireStats.terminees}</Card.Title>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                    <Card.Footer>
                                        <hr />
                                        <div className="stats">
                                            <FontAwesomeIcon icon={faCalendarAlt} className="me-1" /> Dernière mise à jour il y a 1 jour
                                        </div>
                                    </Card.Footer>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={8}>
                                <Card>
                                    <Card.Header>
                                        <Card.Title as="h4">Performance des Affaires de la Division</Card.Title>
                                        <p className="card-category">Affaires terminées par mois</p>
                                    </Card.Header>
                                    <Card.Body>
                                        <Chart options={chartOptions} series={chartSeries} type="bar" height={350} />
                                    </Card.Body>
                                    <Card.Footer>
                                        <hr />
                                        <div className="stats">
                                            <FontAwesomeIcon icon={faCalendarAlt} className="me-1" /> Mis à jour il y a 3 minutes
                                        </div>
                                    </Card.Footer>
                                </Card>
                            </Col>
                            <Col lg={4}>
                                <Card>
                                    <Card.Header>
                                        <Card.Title as="h4">Notifications Récentes</Card.Title>
                                        <p className="card-category">Dernières mises à jour</p>
                                    </Card.Header>
                                    <Card.Body>
                                        {recentNotifications.map(notification => (
                                            <div key={notification.id} className="notification-item">
                                                <FontAwesomeIcon icon={faBell} className="me-2 text-warning" />
                                                {notification.message}
                                                <hr />
                                            </div>
                                        ))}
                                    </Card.Body>
                                    <Card.Footer>
                                        <Button variant="primary" size="sm">Voir toutes les notifications</Button>
                                    </Card.Footer>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                    <footer className="footer">
                        <div className="container-fluid d-flex justify-content-between">
                            <nav className="pull-left">
                                <ul className="nav">
                                    <li className="nav-item">
                                        <a className="nav-link" href="https://github.com/Alyaeessiba">
                                            Alyae Essiba
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="https://github.com/0ZEUS01"> Yahya Zini </a>
                                    </li>
                                </ul>
                            </nav>
                            <div className="copyright">
                                2024, made with <FontAwesomeIcon icon={faHeart} className="heart text-info" /> by
                                <a href="http://cid.co.ma/"> CID</a>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default HomeCD;