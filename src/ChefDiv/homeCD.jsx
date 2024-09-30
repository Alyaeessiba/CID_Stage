/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBriefcase,
    faCalendarAlt,
    faHome,
    faArrowRight,
    faListAlt,
    faChartBar,
    faClock,
    faBan,
    faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import Sidebar from './components/sideBar';
import MainHeader from './components/mainHeader';
import Chart from 'react-apexcharts';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import Footer from './components/footer';

const HomeCD = () => {
    const { user } = useUser();
    const [affaireStats, setAffaireStats] = useState({
        total: 0,
        enCreation: 0,
        cdpDecide: 0,
        enProduction: 0,
        interrompu: 0,
        termine: 0,
        annule: 0
    });
    const [chartData, setChartData] = useState({
        options: {
            chart: {
                id: "basic-bar",
                toolbar: {
                    show: true
                }
            },
            xaxis: {
                categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']
            },
            colors: ['#FF9F40', '#36A2EB', '#4BC0C0', '#FF6384', '#9966FF', '#FF6666']
        },
        series: [
            { name: "En création", data: [] },
            { name: "CDP décidé", data: [] },
            { name: "En production", data: [] },
            { name: "Interrompu", data: [] },
            { name: "Terminé", data: [] },
            { name: "Annulé", data: [] }
        ]
    });

    useEffect(() => {
        if (user && user.id_utilisateur) {
            console.log('Fetching stats for user:', user.id_utilisateur);
            fetchAffaireStats();
            fetchChartData();
        } else {
            console.log('User or user.id_utilisateur is not available');
        }
    }, [user]);

    const fetchAffaireStats = async () => {
        try {
            const response = await axios.get(`/api/affaires/stats/division/${user.id_utilisateur}`);
            console.log('Fetched affaire stats:', response.data);
            setAffaireStats(response.data);
        } catch (error) {
            console.error('Error fetching affaire stats:', error);
        }
    };

    const fetchChartData = async () => {
        try {
            const response = await axios.get(`/api/affaires/chart-data/division/${user.id_utilisateur}`);
            setChartData(prevState => ({
                ...prevState,
                series: response.data
            }));
        } catch (error) {
            console.error('Error fetching chart data:', error);
        }
    };

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
                        <h4>Aperçu des Affaires</h4>
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
                                </Card>
                            </Col>
                            <Col md={4}>
                                <Card className="card-stats card-round">
                                    <Card.Body>
                                        <Row>
                                            <Col xs={4}>
                                                <div className="icon-big text-center">
                                                    <FontAwesomeIcon icon={faListAlt} className="text-warning" />
                                                </div>
                                            </Col>
                                            <Col xs={8} className="col-stats">
                                                <div className="numbers">
                                                    <p className="card-category">En Création</p>
                                                    <Card.Title as="h4">{affaireStats.enCreation}</Card.Title>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={4}>
                                <Card className="card-stats card-round">
                                    <Card.Body>
                                        <Row>
                                            <Col xs={4}>
                                                <div className="icon-big text-center">
                                                    <FontAwesomeIcon icon={faChartBar} className="text-info" />
                                                </div>
                                            </Col>
                                            <Col xs={8} className="col-stats">
                                                <div className="numbers">
                                                    <p className="card-category">CDP Décidé</p>
                                                    <Card.Title as="h4">{affaireStats.cdpDecide}</Card.Title>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <Row className="mb-4">
                            <Col md={4}>
                                <Card className="card-stats card-round">
                                    <Card.Body>
                                        <Row>
                                            <Col xs={4}>
                                                <div className="icon-big text-center">
                                                    <FontAwesomeIcon icon={faClock} className="text-success" />
                                                </div>
                                            </Col>
                                            <Col xs={8} className="col-stats">
                                                <div className="numbers">
                                                    <p className="card-category">En Production</p>
                                                    <Card.Title as="h4">{affaireStats.enProduction}</Card.Title>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={4}>
                                <Card className="card-stats card-round">
                                    <Card.Body>
                                        <Row>
                                            <Col xs={4}>
                                                <div className="icon-big text-center">
                                                    <FontAwesomeIcon icon={faBan} className="text-danger" />
                                                </div>
                                            </Col>
                                            <Col xs={8} className="col-stats">
                                                <div className="numbers">
                                                    <p className="card-category">Interrompu</p>
                                                    <Card.Title as="h4">{affaireStats.interrompu}</Card.Title>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={4}>
                                <Card className="card-stats card-round">
                                    <Card.Body>
                                        <Row>
                                            <Col xs={4}>
                                                <div className="icon-big text-center">
                                                    <FontAwesomeIcon icon={faCheckCircle} className="text-primary" />
                                                </div>
                                            </Col>
                                            <Col xs={8} className="col-stats">
                                                <div className="numbers">
                                                    <p className="card-category">Terminé</p>
                                                    <Card.Title as="h4">{affaireStats.termine}</Card.Title>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12}>
                                <Card>
                                    <Card.Header>
                                        <Card.Title as="h4">Performance des Affaires</Card.Title>
                                        <p className="card-category">Affaires par statut et par mois</p>
                                    </Card.Header>
                                    <Card.Body>
                                        <Chart options={chartData.options} series={chartData.series} type="bar" height={350} />
                                    </Card.Body>
                                    <Card.Footer>
                                        <hr />
                                        <div className="stats">
                                            <FontAwesomeIcon icon={faCalendarAlt} className="me-1" /> Mis à jour il y a 3 minutes
                                        </div>
                                    </Card.Footer>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default HomeCD;