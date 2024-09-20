/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchBar = ({ className, onSearch }) => (
    <div className={`input-group ${className}`}>
        <div className="input-group-prepend">
            <button type="submit" className="btn btn-search pe-1">
                <i className="fa fa-search search-icon" />
            </button>
        </div>
        <input
            type="text"
            placeholder="Search ..."
            className="form-control"
            onChange={(e) => onSearch(e.target.value)}
        />
    </div>
);

const QuickAction = ({ icon, text, bgColor }) => (
    <a className="col-6 col-md-4 p-0" href="#">
        <div className="quick-actions-item">
            <div className={`avatar-item bg-${bgColor} rounded-circle`}>
                <i className={icon} />
            </div>
            <span className="text">{text}</span>
        </div>
    </a>
);

const UserDropdown = ({ username, email, avatarSrc }) => (
    <li className="nav-item topbar-user dropdown hidden-caret">
        <a className="dropdown-toggle profile-pic" data-bs-toggle="dropdown" href="#" aria-expanded="false">
            <div className="avatar-sm">
                <img src={avatarSrc} alt="..." className="avatar-img rounded-circle" />
            </div>
            <span className="profile-username">
                <span className="op-7">Hi,</span>
                <span className="fw-bold">{username}</span>
            </span>
        </a>
        <ul className="dropdown-menu dropdown-user animated fadeIn">
            <div className="dropdown-user-scroll scrollbar-outer">
                <li>
                    <div className="user-box">
                        <div className="avatar-lg">
                            <img src={avatarSrc} alt="image profile" className="avatar-img rounded" />
                        </div>
                        <div className="u-text">
                            <h4>{username}</h4>
                            <p className="text-muted">{email}</p>
                            <Link to="/profile" className="btn btn-xs btn-secondary btn-sm">View Profile</Link>
                        </div>
                    </div>
                </li>
                <li>
                    <div className="dropdown-divider" />
                    <Link className="dropdown-item" to="/profile">My Profile</Link>
                    <Link className="dropdown-item" to="/balance">My Balance</Link>
                    <Link className="dropdown-item" to="/inbox">Inbox</Link>
                    <div className="dropdown-divider" />
                    <Link className="dropdown-item" to="/settings">Account Setting</Link>
                    <div className="dropdown-divider" />
                    <Link className="dropdown-item" to="/logout">Logout</Link>
                </li>
            </div>
        </ul>
    </li>
);

const MainHeader = ({ onSearch }) => (
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
                    <li className="nav-item topbar-icon dropdown hidden-caret">
                        <a className="nav-link" data-bs-toggle="dropdown" href="#" aria-expanded="false">
                            <i className="fas fa-layer-group" />
                        </a>
                        <div className="dropdown-menu quick-actions animated fadeIn">
                            <div className="quick-actions-header">
                                <span className="title mb-1">Quick Actions</span>
                                <span className="subtitle op-7">Shortcuts</span>
                            </div>
                            <div className="quick-actions-scroll scrollbar-outer">
                                <div className="quick-actions-items">
                                    <div className="row m-0">
                                        <QuickAction icon="far fa-calendar-alt" text="Calendar" bgColor="danger" />
                                        <QuickAction icon="fas fa-map" text="Maps" bgColor="warning" />
                                        <QuickAction icon="fas fa-file-excel" text="Reports" bgColor="info" />
                                        <QuickAction icon="fas fa-envelope" text="Emails" bgColor="success" />
                                        <QuickAction icon="fas fa-file-invoice-dollar" text="Invoice" bgColor="primary" />
                                        <QuickAction icon="fas fa-credit-card" text="Payments" bgColor="secondary" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                    <UserDropdown 
                        username="Alyae" 
                        email="Alyae@gmail.com" 
                        avatarSrc="../assets/img/alyae.jpg" 
                    />
                </ul>
            </div>
        </nav>
    </div>
);

export default MainHeader;
