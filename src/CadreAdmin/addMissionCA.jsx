/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './components/sideBar';
import MainHeader from './components/mainHeader';
import Footer from './components/footer';  // Add this import


const FormField = ({ label, id, type = 'text', placeholder, value, onChange, options, disabled }) => (
    <div className="mb-3 col-md-6 form-group">
        <label htmlFor={id} className="form-label" style={{ textAlign: 'left', display: 'block' }}>{label}</label>
        {type === 'select' ? (
            <select
                className="form-select form-control"
                id={id}
                value={value}
                onChange={onChange}
                disabled={disabled}
            >
                {options.map((option, index) => (
                    <option key={index} value={option.value}>{option.label}</option>
                ))}
            </select>
        ) : (
            <input
                type={type}
                className="form-control"
                id={id}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
            />
        )}
    </div>
);

const Breadcrumb = ({ items }) => (
    <ul className="breadcrumbs mb-3">
        {items.map((item, index) => (
            <React.Fragment key={index}>
                <li className={item.icon ? "nav-home" : "nav-item"}>
                    <Link to={item.link}>
                        {item.icon ? <i className={item.icon} /> : item.text}
                    </Link>
                </li>
                {index < items.length - 1 && (
                    <li className="separator">
                        <i className="icon-arrow-right" />
                    </li>
                )}
            </React.Fragment>
        ))}
    </ul>
);

const AddMission = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        libelleMission: '',
        prixGlobal: '',
        unite: '1',
        quantite: '',
        prixUnitaire: '',
        prixTotal: ''
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => {
            const newState = { ...prevState, [id]: value };
            
            if (id === 'unite') {
                newState.quantite = '';
                newState.prixUnitaire = '';
                newState.prixTotal = '';
            } else if (id === 'quantite' || id === 'prixUnitaire') {
                newState.prixTotal = (newState.quantite * newState.prixUnitaire).toString();
            }
            
            return newState;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your form submission logic here
        console.log('Form submitted:', formData);
        // Navigate to the next page or show a success message
        navigate('/nextPage');
    };

    const handleReset = () => {
        setFormData({
            libelleMission: '',
            prixGlobal: '',
            unite: '1',
            quantite: '',
            prixUnitaire: '',
            prixTotal: ''
        });
    };

    const breadcrumbItems = [
        { icon: "icon-home", link: "/HomeCA" },
        { text: "Gestion des Affaires", link: "/gestion-affaires" },
        { text: "Ajouter une Mission", link: "#" }
    ];

    return (
        <div className="wrapper">
            <Sidebar />
            <div className="main-panel">
                <MainHeader />
                <div className="container">
                    <div className="page-inner">
                        <div className="page-header">
                            <h3 className="fw-bold mb-3">Gestion des Affaires</h3>
                            <Breadcrumb items={breadcrumbItems} />
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        <div className="card-title">Ajouter les Missions</div>
                                    </div>
                                    <form onSubmit={handleSubmit}>
                                        <div className="card-body">
                                            <div className="row">
                                                <FormField label="Libelle de Mission" id="libelleMission" placeholder="Entrer le libelle de Mission" value={formData.libelleMission} onChange={handleInputChange} />
                                                <FormField label="Prix global (TTC)" id="prixGlobal" placeholder="Entrer le prix global" value={formData.prixGlobal} onChange={handleInputChange} />
                                                <FormField label="Unite" id="unite" type="select" value={formData.unite} onChange={handleInputChange} options={[
                                                    { value: '1', label: 'Forfait' },
                                                    { value: '2', label: 'Kilomètre' },
                                                    { value: '3', label: 'Mètre' },
                                                    { value: '4', label: 'Mètre cube' },
                                                    { value: '5', label: 'Mètre carré' }
                                                ]} />
                                                {formData.unite !== '1' && (
                                                    <>
                                                        <FormField label="Quantite" id="quantite" placeholder="Entrer la quantite" value={formData.quantite} onChange={handleInputChange} />
                                                        <FormField label="Prix unitaire" id="prixUnitaire" placeholder="Entrer le prix unitaire" value={formData.prixUnitaire} onChange={handleInputChange} />
                                                    </>
                                                )}
                                                <FormField label="Prix total" id="prixTotal" placeholder="Entrer le prix total" value={formData.prixTotal} onChange={handleInputChange} disabled={formData.unite !== '1'} />
                                            </div>
                                        </div>
                                        <div className="card-action" style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px' }}>
                                            <button type="submit" className="btn btn-primary">Ajouter</button>
                                            <button type="button" className="btn btn-black btn-border" onClick={handleReset}>Vider</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />  {/* Add the Footer component here */}
                </div>
            </div>
        </div>
    );
};

export default AddMission;
