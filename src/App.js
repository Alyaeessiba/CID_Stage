import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AffaireProvider } from './context/AffaireContext';
import PageMeta from './PageMeta';
import { UserProvider, useUser } from './context/UserContext';

// Import views
import Login from './views/login';
import HomeCA from './CadreAdmin/homeCA';
import AddAffaireCA from './CadreAdmin/addAffaireCA';
import AfficherAffaireCA from './CadreAdmin/afficherAffaireCA';
import AddMissionCA from './CadreAdmin/addMissionCA';
import AfficherMissionCA from './CadreAdmin/afficherMissionCA';
import HomeCP from './ChefPole/homeCP';
import AfficherAffaireCP from './ChefPole/afficherAffaireCP';
import AfficherMissionCP from './ChefPole/afficherMissionCP'
import HomeCD from './ChefDiv/homeCD';
import AfficherAffaireCD from './ChefDiv/afficherAffaireCD';
import RepartirMissionCD from './ChefDiv/repartitionMissionCD';
import AfficherMissionCD from './ChefDiv/afficherMissionCD';
import DesignationChefProjetCD from './ChefDiv/designationChefProjetCD';
import HomeCDP from './ChefProjet/homeCDP';
import AfficherAffaireCDP from './ChefProjet/afficherAffaireCDP';
import AfficherMissionCDP from './ChefProjet/afficherMissionCDP';
import ConsultMissionCDP from './ChefProjet/consultMissionCDP';
import AfficherUnite from './Admin/Unite/afficherUnite'
import AfficherRole from './Admin/Role/afficherRole';
import AfficherUser from './Admin/Utilisateur/afficherUser';
import AddUser from './Admin/Utilisateur/addUser';
import AfficherPole from './Admin/Pole/afficherPole';
import AfficherDivision from './Admin/Division/afficherDivision'
import AfficherClient from './CadreAdmin/Client/afficherClient'
import AfficherPays from './Admin/Pays/afficherPays'
import AfficherSousTraitant from './Admin/SousTraitant/afficherST'
import AfficherPartenaire from './Admin/Partenaire/afficherPartenaire'
import HomeAdmin from './Admin/HomeAdmin';
import ProfilePageCA from './CadreAdmin/profileCA';
import ProfilePageAdmin from './Admin/profileAdmin';
import ProfilePageCP from './ChefPole/profileCP';
import ProfilePageCD from './ChefDiv/profileCD';
import ProfilePageCDP from './ChefProjet/profileCDP';

function LogoutComponent() {
  const { setUser } = useUser();

  React.useEffect(() => {
    setUser(null);
    localStorage.removeItem('userId');
  }, [setUser]);

  return <Navigate to="/login" />;
}

// Root redirect component
function RootRedirect() {
  return <Navigate to="/login" replace />;
}

// Update the routes array with French titles
const routes = [
  { path: '/login', element: Login, title: 'Login' },
  { path: '/HomeCA', element: HomeCA, title: 'Accueil - CID' },
  { path: '/addAffaireCA', element: AddAffaireCA, title: 'Ajouter Affaire - CID' },
  { path: '/afficherAffaireCA', element: AfficherAffaireCA, title: 'Afficher Affaire - CID' },
  { path: '/AddMissionCA', element: AddMissionCA, title: 'Ajouter Mission - CID' },
  { path: '/AfficherMissionCA', element: AfficherMissionCA, title: 'Afficher Mission - CID' },
  { path: '/HomeCP', element: HomeCP, title: 'Accueil - CID' },
  { path: '/afficherAffaireCP', element: AfficherAffaireCP, title: 'Afficher Affaire - CID' },
  { path: '/afficherMissionCP/:affaireId', element: AfficherMissionCP, title: 'Afficher Mission - CID' }, 
  { path: '/HomeCD', element: HomeCD, title: 'Accueil - CID' },
  { path: '/afficherAffaireCD', element: AfficherAffaireCD, title: 'Afficher Affaire - CID' },
  { path: '/repartirMissionCD/:idMission', element: RepartirMissionCD, title: 'Répartir les Missions - CID' },
  { path: '/afficherMissionCD/:idAffaire', element: AfficherMissionCD, title: 'Afficher Mission - CID' },
  { path: '/designationChefProjetCD/:idAffaire', element: DesignationChefProjetCD, title: 'Designation de Chef de Projet - CID' },
  { path: '/HomeCDP', element: HomeCDP, title: 'Accueil - CID' },
  { path: '/afficherAffaireCDP', element: AfficherAffaireCDP, title: 'Afficher Affaire - CID' },
  { path: '/afficherMissionCDP/:idAffaire', element: AfficherMissionCDP, title: 'Afficher Mission - CID' },
  { path: '/consultMissionCDP/:idMission', element: ConsultMissionCDP, title: 'Consulter Mission - CID' },
  { path: '/afficherUnite', element: AfficherUnite, title: 'Gestion des Unités - CID' },
  { path: '/afficherRole', element: AfficherRole, title: 'Gestion des Roles - CID' },
  { path: '/afficherUser', element: AfficherUser, title: 'Gestion des Utilisateurs - CID' },
  { path: '/addUser', element: AddUser, title: 'Gestion des Utilisateurs - CID' },
  { path: '/afficherPole', element: AfficherPole, title: 'Gestion des Poles - CID' },
  { path: '/afficherDivision', element: AfficherDivision, title: 'Gestion des Divisions - CID' },
  { path: '/afficherClient', element: AfficherClient, title: 'Gestion des Clients - CID' },
  { path: '/afficherPays', element: AfficherPays, title: 'Gestion des Pays - CID' },
  { path: '/afficherSousTraitant', element: AfficherSousTraitant, title: 'Gestion des Sous-traitants - CID' },
  { path: '/afficherPartenaire', element: AfficherPartenaire, title: 'Gestion des Partenaires - CID' },
  { path: '/HomeAdmin', element: HomeAdmin, title: 'Accueil - CID' },
  { path: '/profileCA', element: ProfilePageCA, title: 'Profile - CID' },
  { path: '/logout', element: LogoutComponent, title: 'Logout - CID' },
  { path: '/profileAdmin', element: ProfilePageAdmin, title: 'Profile - CID' },
  { path: '/profileCP', element: ProfilePageCP, title: 'Profile - CID' },
  { path: '/profileCD', element: ProfilePageCD, title: 'Profile - CID' },
  { path: '/profileCDP', element: ProfilePageCDP, title: 'Profile - CID' },
];

function App() {
  return (
    <UserProvider>
      <AffaireProvider>
        <Router>
          <Routes>
            {routes.map(({ path, element: Element, title }) => (
              <Route 
                key={path} 
                path={path} 
                element={
                  <>
                    <PageMeta title={title} />
                    <Element />
                  </>
                } 
              />
            ))}
            <Route path="/" element={<RootRedirect />} />
          </Routes>
        </Router>
      </AffaireProvider>
    </UserProvider>
  );
}

export default App;
