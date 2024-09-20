/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import Sidebar from './components/sideBar';
import MainHeader from './components/mainHeader';
import Footer from './components/footer';

const AddDivisions = () => {
    const globalMontant = 378000.00;
    const divisionsList = [
        { id: '1', name: 'AUTOROUTES' },
        { id: '2', name: 'RAILS' },
        { id: '3', name: 'ROUTES' },
        { id: '4', name: 'OUVRAGES D\'ART' },
        { id: '5', name: 'ASSISTANCE TECHNIQUE' },
        { id: '6', name: 'PLANIFICATION ET MOBILITE' },
        { id: '7', name: 'GRANDS BARRAGES' },
        { id: '8', name: 'PETITS ET MOYENS BARRAGES' },
        { id: '9', name: 'RESSOURCES EN EAU' },
        { id: '10', name: 'VRD' }
    ];

    const [divisions, setDivisions] = useState([{ divisionId: '', montant: '' }]);
    const [sousTraitants, setSousTraitants] = useState([{ name: '', montant: '' }]);
    const [totalMontant, setTotalMontant] = useState(0);
    const [error, setError] = useState('');

    const calculateTotalMontant = (divisions, sousTraitants) => {
        const totalDivisions = divisions.reduce((acc, curr) => acc + (parseFloat(curr.montant) || 0), 0);
        const totalSousTraitants = sousTraitants.reduce((acc, curr) => acc + (parseFloat(curr.montant) || 0), 0);
        const total = totalDivisions + totalSousTraitants;
        setTotalMontant(total);

        setError(total > globalMontant ? 'Le montant total ne doit pas dépasser le montant global.' : '');

        if (total < globalMontant) {
            if (newDivisionsAreValid(divisions)) {
                addDivisionField();
            }
            if (newSousTraitantsAreValid(sousTraitants)) {
                addSousTraitantField();
            }
        } else if (total === globalMontant) {
            // Remove empty fields when total equals global montant, but keep fields with valid montant
            setDivisions(divisions.filter(d => d.montant !== ''));
            setSousTraitants(sousTraitants.filter(st => st.montant !== ''));
        }
    };

    const newDivisionsAreValid = (divisions) => {
        return divisions.every(division => division.divisionId !== '' && division.montant !== '');
    };

    const handleDivisionChange = (index, field, value) => {
        const newDivisions = [...divisions];
        newDivisions[index][field] = value;

        if (field === 'montant') {
            newDivisions[index].montant = parseFloat(value) || '';
        }

        setDivisions(newDivisions);
        calculateTotalMontant(newDivisions, sousTraitants);
    };

    const handleSousTraitantChange = (index, field, value) => {
        const newSousTraitants = [...sousTraitants];
        newSousTraitants[index][field] = field === 'montant' ? parseFloat(value) || '' : value;
        setSousTraitants(newSousTraitants);
        calculateTotalMontant(divisions, newSousTraitants);
    };

    const addDivisionField = () => {
        setDivisions([...divisions, { divisionId: '', montant: '' }]);
    };

    const addSousTraitantField = () => {
        setSousTraitants([...sousTraitants, { name: '', montant: '' }]);
    };

    const newSousTraitantsAreValid = (sousTraitants) => {
        return sousTraitants.every(st => st.name !== '' && st.montant !== '');
    };

    const handleApply = () => {
        if (totalMontant === globalMontant) {
            console.log('Divisions, sous-traitants, and amounts:', { divisions, sousTraitants });
        } else {
            setError(`Le montant total doit être égal à ${globalMontant.toFixed(2)}.`);
        }
    };

    const handleSuggestion = (index, forSousTraitant = false) => {
        const remainingMontant = globalMontant - totalMontant;
        if (forSousTraitant) {
            handleSousTraitantChange(index, 'montant', remainingMontant.toFixed(2));
        } else {
            handleDivisionChange(index, 'montant', remainingMontant.toFixed(2));
        }
    };

    const getAvailableDivisions = (usedDivisions, currentIndex) => {
        const selectedDivisions = divisions.slice(0, currentIndex).map(d => d.divisionId);
        return divisionsList.filter(division => !selectedDivisions.includes(division.id));
    };

    const hasDivisions = divisions.some(d => d.divisionId !== '' && d.montant !== '');
    const hasSousTraitants = sousTraitants.some(st => st.name !== '' && st.montant !== '');

    const visibleDivisions = totalMontant === globalMontant
        ? divisions.filter(d => d.montant !== '')
        : divisions;

    const visibleSousTraitants = totalMontant === globalMontant
        ? sousTraitants.filter(st => st.montant !== '')
        : sousTraitants;

    return (
        <div className="wrapper">
            <Sidebar />
            <div className="main-panel">
                <MainHeader />
                <div className="container">
                    <div className="page-inner">
                        <div className="page-header">
                            <h3 className="fw-bold mb-3">Gestion des Affaire</h3>
                            <ul className="breadcrumbs mb-3">
                                <li className="nav-home">
                                    <a href="#">
                                        <i className="icon-home" />
                                    </a>
                                </li>
                                <li className="separator">
                                    <i className="icon-arrow-right" />
                                </li>
                                <li className="nav-item">
                                    <a href="#">Gestion des Affaire</a>
                                </li>
                                <li className="separator">
                                    <i className="icon-arrow-right" />
                                </li>
                                <li className="nav-item">
                                    <a href="#">List des Mission</a>
                                </li>
                            </ul>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                {/* Divisions card */}
                                {(!hasSousTraitants || divisions.length > 1) && (
                                    <div className="card mb-4">
                                        <div className="card-header">
                                            <div className="card-title" style={{ textAlign: 'left' }}>
                                                Définir les divisions montant à la mission "Gare LGV Tanger" dont le montant : {globalMontant.toFixed(2)}
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            {visibleDivisions.map((division, index) => (
                                                <DivisionRow
                                                    key={index}
                                                    division={division}
                                                    index={index}
                                                    handleDivisionChange={handleDivisionChange}
                                                    handleSuggestion={handleSuggestion}
                                                    availableDivisions={getAvailableDivisions(divisions.map(d => d.divisionId), index)}
                                                    totalMontant={totalMontant}
                                                    globalMontant={globalMontant}
                                                    isLast={index === visibleDivisions.length - 1}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Sous-traitant card */}
                                {(!hasDivisions || sousTraitants.length > 1) && (
                                    <div className={`card mb-4 ${totalMontant > globalMontant ? 'border-danger' : ''}`}>
                                        <div className="card-header">
                                            <div className="card-title" style={{ textAlign: 'left' }}>
                                                Définir les sous traitants montant à la mission "Gare LGV Tanger"
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            {visibleSousTraitants.map((sousTraitant, index) => (
                                                <SousTraitantRow
                                                    key={index}
                                                    sousTraitant={sousTraitant}
                                                    index={index}
                                                    handleSousTraitantChange={handleSousTraitantChange}
                                                    handleSuggestion={handleSuggestion}
                                                    totalMontant={totalMontant}
                                                    globalMontant={globalMontant}
                                                    isLast={index === visibleSousTraitants.length - 1}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="card">
                                    <div className="card-body">
                                        <div className="card-action" style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px' }}>
                                            <button className="btn btn-primary" onClick={handleApply}>Appliquer</button>
                                        </div>
                                        {error && <div className="alert-danger text-danger mt-3">{error}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

const DivisionRow = ({ division, index, handleDivisionChange, handleSuggestion, availableDivisions, totalMontant, globalMontant, isLast }) => (
    <div className="row">
        <div className="mb-3 col-md-6 form-group">
            <label htmlFor={`Division-${index}`} className="form-label" style={{ textAlign: 'left', display: 'block' }}>Division</label>
            <select
                className="form-select form-control"
                id={`Division-${index}`}
                value={division.divisionId}
                onChange={(e) => handleDivisionChange(index, 'divisionId', e.target.value)}
            >
                <option value="">Sélectionner une division</option>
                {availableDivisions.map((divisionOption) => (
                    <option key={divisionOption.id} value={divisionOption.id}>
                        {divisionOption.name}
                    </option>
                ))}
            </select>
        </div>
        <div className="mb-3 col-md-6 form-group">
            <label htmlFor={`partDiv-${index}`} className="form-label" style={{ textAlign: 'left', display: 'block' }}>Part de Division (TTC)</label>
            <input
                type="text"
                className="form-control"
                id={`partDiv-${index}`}
                value={division.montant}
                onChange={(e) => handleDivisionChange(index, 'montant', e.target.value)}
                placeholder="Entrer la part de cette division"
            />
            {isLast && totalMontant < globalMontant && (
                <small
                    className="form-text text-muted"
                    onClick={() => handleSuggestion(index)}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                    Suggestion: {globalMontant - totalMontant > 0 ? (globalMontant - totalMontant).toFixed(2) : '0.00'}
                </small>
            )}
        </div>
    </div>
);

const SousTraitantRow = ({ sousTraitant, index, handleSousTraitantChange, handleSuggestion, totalMontant, globalMontant, isLast }) => (
    <div className="row">
        <div className="mb-3 col-md-6 form-group">
            <label htmlFor={`NomST-${index}`} className="form-label" style={{ textAlign: 'left', display: 'block' }}>Nom de sous traitant</label>
            <input
                type="text"
                className="form-control"
                id={`NomST-${index}`}
                value={sousTraitant.name}
                onChange={(e) => handleSousTraitantChange(index, 'name', e.target.value)}
                placeholder="Entrer le nom de sous traitant"
            />
        </div>
        <div className="mb-3 col-md-6 form-group">
            <label htmlFor={`partST-${index}`} className="form-label" style={{ textAlign: 'left', display: 'block' }}>Part de sous traitant</label>
            <input
                type="text"
                className="form-control"
                id={`partST-${index}`}
                value={sousTraitant.montant}
                onChange={(e) => handleSousTraitantChange(index, 'montant', e.target.value)}
                placeholder="Entrer la part de sous traitant"
            />
            {isLast && totalMontant < globalMontant && (
                <small
                    className="form-text text-muted"
                    onClick={() => handleSuggestion(index, true)}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                    Suggestion: {globalMontant - totalMontant > 0 ? (globalMontant - totalMontant).toFixed(2) : '0.00'}
                </small>
            )}
        </div>
    </div>
);

export default AddDivisions;
