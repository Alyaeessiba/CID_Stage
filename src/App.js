import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageMeta from './PageMeta';

// Import views
import Login from './views/login';
import HomeCA from './CadreAdmin/homeCA';
import AddAffaireCA from './CadreAdmin/addAffaireCA';
import AfficherAffaireCA from './CadreAdmin/afficherAffaireCA';
import AddMissionCA from './CadreAdmin/addMissionCA';
import AfficherMissionCA from './CadreAdmin/afficherMissionCA';
import HomeCP from './ChefPole/homeCP';
import AfficherAffaireCP from './ChefPole/afficherAffaireCP';
import afficherMissionCP from './ChefPole/afficherMissionCP'
import HomeCD from './ChefDiv/homeCD';
import AfficherAffaireCD from './ChefDiv/afficherAffaireCD';
import AddDivisionsCD from './ChefDiv/addDivisionsCD';
import AfficherMissionCD from './ChefDiv/afficherMissionCD';
import DesignationChefProjetCD from './ChefDiv/designationChefProjetCD';
import HomeCDP from './ChefProjet/homeCDP';
import AfficherAffaireCDP from './ChefProjet/afficherAffaireCDP';
import AfficherMissionCDP from './ChefProjet/afficherMissionCDP'
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
// Update the routes array with French titles
const routes = [
  { path: '/', element: Login, title: 'Login' },
  { path: '/HomeCA', element: HomeCA, title: 'Accueil - CID' },
  { path: '/addAffaireCA', element: AddAffaireCA, title: 'Ajouter Affaire - CID' },
  { path: '/afficherAffaireCA', element: AfficherAffaireCA, title: 'Afficher Affaire - CID' },
  { path: '/AddMissionCA', element: AddMissionCA, title: 'Ajouter Mission - CID' },
  { path: '/AfficherMissionCA', element: AfficherMissionCA, title: 'Afficher Mission - CID' },
  { path: '/HomeCP', element: HomeCP, title: 'Accueil - CID' },
  { path: '/afficherAffaireCP', element: AfficherAffaireCP, title: 'Afficher Affaire - CID' },
  { path: '/afficherMissionCP', element: afficherMissionCP, title: 'Afficher Mission - CID' },
  { path: '/HomeCD', element: HomeCD, title: 'Accueil - CID' },
  { path: '/afficherAffaireCD', element: AfficherAffaireCD, title: 'Afficher Affaire - CID' },
  { path: '/AddDivisionsCD', element: AddDivisionsCD, title: 'Ajouter Divisions - CID' },
  { path: '/afficherMissionCD', element: AfficherMissionCD, title: 'Afficher Mission - CID' },
  { path: '/designationChefProjetCD', element: DesignationChefProjetCD, title: 'Designation de Chef de Projet - CID' },
  { path: '/HomeCDP', element: HomeCDP, title: 'Accueil - CID' },
  { path: '/afficherAffaireCDP', element: AfficherAffaireCDP, title: 'Afficher Affaire - CID' },
  { path: '/afficherMissionCDP', element: AfficherMissionCDP, title: 'Afficher Mission - CID' },
  { path: '/consultMissionCDP', element: ConsultMissionCDP, title: 'Consulter Mission - CID' },
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
];

function App() {
  return (
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
      </Routes>
    </Router>
  );
}

export default App;
