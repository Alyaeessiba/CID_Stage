/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import axios from 'axios';

const SearchBar = ({ className, onSearch }) => {
    const handleSearch = (e) => {
        onSearch(e.target.value);
    };

    return (
        <div className={`input-group ${className}`}>
            <span className="input-group-text">
                <i className="fa fa-search search-icon" />
            </span>
            <input 
                type="text" 
                placeholder="Rechercher..." 
                className="form-control" 
                onChange={handleSearch}
            />
        </div>
    );
};

const UserDropdown = ({ firstName, lastName, email }) => (
    <li className="nav-item topbar-user dropdown hidden-caret">
        <a className="dropdown-toggle profile-pic" data-bs-toggle="dropdown" href="#" aria-expanded="false">
            <span className="profile-username">
                <span className="op-7">Hi,</span>&nbsp;
                <span className="fw-bold">{firstName} {lastName}</span>
            </span>
        </a>
        <ul className="dropdown-menu dropdown-user animated fadeIn">
            <div className="dropdown-user-scroll scrollbar-outer">
                <li>
                    <div className="user-box">
                        <div className="u-text">
                            <h4>{firstName} {lastName}</h4>
                            <p className="text-muted">{email}</p>
                        </div>
                    </div>
                </li>
                <li>
                    <div className="dropdown-divider" />
                    <Link className="dropdown-item" to="/profileCA">My Profile</Link>
                    <Link className="dropdown-item" to="/logout">Logout</Link>
                </li>
            </div>
        </ul>
    </li>
);

const MainHeader = ({ onSearch }) => {
    const {setUser } = useUser();
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            const userId = localStorage.getItem('userId');
            console.log('Fetching user details for ID:', userId);
            if (userId) {
                try {
                    const response = await axios.get(`http://localhost:8080/api/utilisateurs/${userId}`);
                    console.log('User details response:', response.data);
                    setUserDetails(response.data);
                    setUser({
                        id_utilisateur: userId,
                        username: response.data.username,
                        email: response.data.email
                    });
                } catch (error) {
                    console.error('Error fetching user details:', error);
                    console.error('Error response:', error.response);
                    // Don't remove userId from localStorage here, as it might be a temporary error
                    // Instead, you might want to implement a retry mechanism or show an error message
                }
            } else {
                console.log('No userId found in localStorage');
                // Redirect to login page or show a message that user needs to log in
            }
        };

        fetchUserDetails();
    }, [setUser]);

    return (
        <div className="main-header">
            <div className="main-header-logo">
                <div className="logo-header" data-background-color="dark">
                    <Link to="/" className="logo">
                        <img src="/assets/img/logo.png" alt="navbar brand" className="navbar-brand" height={70} />
                    </Link>
                    <div className="nav-toggle">
                        <button className="btn btn-toggle toggle-sidebar">
                            <i className="gg-menu-right" />
                        </button>
                        <button className="btn btn-toggle sidenav-toggler">
                            <i className="gg-menu-left" />
                        </button>
                    </div>
                    <button className="topbar-toggler more">
                        <i className="gg-more-vertical-alt" />
                    </button>
                </div>
            </div>
            <nav className="navbar navbar-header navbar-header-transparent navbar-expand-lg border-bottom">
                <div className="container-fluid">
                    <nav className="navbar navbar-header-left navbar-expand-lg navbar-form nav-search p-0 d-none d-lg-flex">
                        <SearchBar onSearch={onSearch} />
                    </nav>
                    <ul className="navbar-nav topbar-nav ms-md-auto align-items-center">
                        <li className="nav-item topbar-icon dropdown hidden-caret d-flex d-lg-none">
                            <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false" aria-haspopup="true">
                                <i className="fa fa-search" />
                            </a>
                            <ul className="dropdown-menu dropdown-search animated fadeIn">
                                <form className="navbar-left navbar-form nav-search">
                                    <SearchBar />
                                </form>
                            </ul>
                        </li>
                        {userDetails && (
                            <UserDropdown 
                                firstName={userDetails.prenom}
                                lastName={userDetails.nom}
                                email={userDetails.email}
                            />
                        )}
                    </ul>
                </div>
            </nav>
        </div>
    );
};

export default MainHeader;
