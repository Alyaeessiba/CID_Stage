import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SidebarItem = ({ href, icon, text, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleCollapse = (e) => {
        if (children) {
            e.preventDefault();
            setIsOpen(!isOpen);
        }
    };

    return (
        <li className="nav-item">
            <Link to={href} className={children ? "" : "collapsed"} onClick={toggleCollapse}>
                <i className={icon} />
                <p>{text}</p>
                {children && <span className={`caret ${isOpen ? 'rotate-180' : ''}`} />}
            </Link>
            {children && (
                <div className={`collapse ${isOpen ? 'show' : ''}`}>
                    <ul className="nav nav-collapse">
                        {children}
                    </ul>
                </div>
            )}
        </li>
    );
};

const Sidebar = ({ logo, menuItems = [] }) => (
    <div className="sidebar" data-background-color="dark">
        <div className="sidebar-logo">
            <div className="logo-header" data-background-color="dark">
                <Link to="/HomeCD" className="logo">
                    <img src="/assets/img/logo.png" alt="navbar brand" className="navbar-brand" height={60} />
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
        <div className="sidebar-wrapper scrollbar scrollbar-inner">
            <div className="sidebar-content">
                <ul className="nav nav-secondary">
                    <SidebarItem href="/HomeCD" icon="fas fa-home" text="Accueil" />
                    <li className="nav-section">
                        <span className="sidebar-mini-icon">
                            <i className="fa fa-ellipsis-h" />
                        </span>
                        <h4 className="text-section">Components</h4>
                    </li>
                    <SidebarItem href="/afficherAffaireCD" icon="fas fa-list" text="Liste des affaires"/>
                </ul>
                <ul className="nav">
                    {menuItems.map((item, index) => (
                        <SidebarItem key={index} {...item} />
                    ))}
                </ul>
            </div>
        </div>
    </div>
);

export default Sidebar;
