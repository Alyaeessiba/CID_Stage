-- Table: Role
CREATE TABLE Role (
    id_role SERIAL PRIMARY KEY,
    nom_role VARCHAR(255) NOT NULL
);

-- Table: Pays
CREATE TABLE Pays (
    id_pays SERIAL PRIMARY KEY,
    libelle_pays VARCHAR(100) NOT NULL
);

-- Table: Pole
CREATE TABLE Pole (
    id_pole SERIAL PRIMARY KEY,
    nom_pole VARCHAR(255) NOT NULL
);

-- Table: Division
CREATE TABLE Division (
    id_division SERIAL PRIMARY KEY,
    nom_division VARCHAR(255) NOT NULL,
    id_pole INT,
    CONSTRAINT fk_division_pole FOREIGN KEY (id_pole) REFERENCES Pole(id_pole) ON DELETE CASCADE
);

-- Table: Utilisateur
CREATE TABLE Utilisateur (
    id_utilisateur SERIAL PRIMARY KEY,
    prenom VARCHAR(100) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    num_telephone VARCHAR(20),
    username VARCHAR(100) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    date_naissance DATE NOT NULL,
    sexe CHAR(1) NOT NULL,
    adresse VARCHAR(255) NOT NULL,
    isDeleted BOOLEAN DEFAULT FALSE,
    pole INT,
    division INT,
    pays INT,
    CONSTRAINT fk_utilisateur_pole FOREIGN KEY (pole) REFERENCES Pole(id_pole) ON DELETE CASCADE,
    CONSTRAINT fk_utilisateur_division FOREIGN KEY (division) REFERENCES Division(id_division) ON DELETE CASCADE,
    CONSTRAINT fk_utilisateur_pays FOREIGN KEY (pays) REFERENCES Pays(id_pays) ON DELETE SET NULL
);

-- Table: User_Role
CREATE TABLE User_Role (
    id_utilisateur INT,
    id_role INT,
    CONSTRAINT pk_user_role PRIMARY KEY (id_utilisateur, id_role),
    CONSTRAINT fk_user_role_user FOREIGN KEY (id_utilisateur) REFERENCES Utilisateur(id_utilisateur) ON DELETE CASCADE,
    CONSTRAINT fk_user_role_role FOREIGN KEY (id_role) REFERENCES Role(id_role) ON DELETE CASCADE
);

-- Table: Client
CREATE TABLE Client (
    id_client SERIAL PRIMARY KEY,
    nom_client VARCHAR(255) NOT NULL,
    id_pays INT,
    CONSTRAINT fk_client_pays FOREIGN KEY (id_pays) REFERENCES Pays(id_pays) ON DELETE SET NULL
);

-- Table: Marche
CREATE TABLE Marche (
    id_marche SERIAL PRIMARY KEY,
    libelle_marche VARCHAR(255) NOT NULL,
    Budget_total DOUBLE PRECISION CHECK (Budget_total >= 0),
    isPartage BOOLEAN DEFAULT FALSE,
    id_client INT,
    CONSTRAINT fk_marche_client FOREIGN KEY (id_client) REFERENCES Client(id_client) ON DELETE CASCADE
);

-- Table: Affaire
CREATE TABLE Affaire (
    id_affaire SERIAL PRIMARY KEY,
    libelle_affaire VARCHAR(255) NOT NULL,
    prix_global DOUBLE PRECISION CHECK (prix_global >= 0),
    status_affaire VARCHAR(100) NOT NULL,
    num_marche INT,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    date_arret DATE,
    date_recommencement DATE,
    pourcentage_assurance DOUBLE PRECISION CHECK (pourcentage_assurance >= 0 AND pourcentage_assurance <= 100),
    CONSTRAINT fk_affaire_marche FOREIGN KEY (num_marche) REFERENCES Marche(id_marche) ON DELETE SET NULL
);

-- Table: Mission
CREATE TABLE Mission (
    id_mission SERIAL PRIMARY KEY,
    libelle_mission VARCHAR(255) NOT NULL,
    isForfait BOOLEAN DEFAULT FALSE,
    quantite INT DEFAULT 1 CHECK (quantite > 0),
    unite VARCHAR(20),
    prix_mission DOUBLE PRECISION CHECK (prix_mission >= 0),
    prix_mission_CID DOUBLE PRECISION CHECK (prix_mission_CID >= 0),
    isSousTraiter BOOLEAN DEFAULT FALSE,
    isMultiDivision BOOLEAN DEFAULT FALSE,
    compte_client DOUBLE PRECISION CHECK (compte_client >= 0),
    part_division_principale DOUBLE PRECISION CHECK (part_division_principale >= 0),
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    date_arret DATE,
    date_recommencement DATE,
    division_principale INT,
    affaire INT,
    CONSTRAINT fk_mission_division_principale FOREIGN KEY (division_principale) REFERENCES Division(id_division) ON DELETE CASCADE,
    CONSTRAINT fk_mission_affaire FOREIGN KEY (affaire) REFERENCES Affaire(id_affaire) ON DELETE SET NULL
);

-- Table: Facturation
CREATE TABLE Facturation (
    id_facture SERIAL PRIMARY KEY,
    montant_facture DOUBLE PRECISION CHECK (montant_facture >= 0),
    document_facture VARCHAR(255) NOT NULL,
    date_facturation DATE,
    id_mission INT,
    CONSTRAINT fk_facturation_mission FOREIGN KEY (id_mission) REFERENCES Mission(id_mission) ON DELETE CASCADE
);

-- Table: Encaissement
CREATE TABLE Encaissement (
    id_encaissement SERIAL PRIMARY KEY,
    montant_encaissement DOUBLE PRECISION CHECK (montant_encaissement >= 0),
    document_encaissement VARCHAR(255) NOT NULL,
    date_encaissement DATE,
    id_mission INT,
    CONSTRAINT fk_encaissement_mission FOREIGN KEY (id_mission) REFERENCES Mission(id_mission) ON DELETE CASCADE
);

-- Table: Mission_Division
CREATE TABLE Mission_Division (
    id_mission INT,
    id_division INT,
    part_division DOUBLE PRECISION CHECK (part_division >= 0),
    attribue_le DATE,
    CONSTRAINT pk_mission_division PRIMARY KEY (id_mission, id_division),
    CONSTRAINT fk_mission_division_mission FOREIGN KEY (id_mission) REFERENCES Mission(id_mission) ON DELETE CASCADE,
    CONSTRAINT fk_mission_division_division FOREIGN KEY (id_division) REFERENCES Division(id_division) ON DELETE CASCADE
);

-- Table: Avancement_Division
CREATE TABLE Avancement_Division (
    id_mission INT,
    id_division INT,
    rapport TEXT,
    montant_obtenu DOUBLE PRECISION CHECK (montant_obtenu >= 0),
    cree_le DATE,
    maj_le DATE,
    CONSTRAINT pk_avancement_division PRIMARY KEY (id_mission, id_division),
    CONSTRAINT fk_avancement_division FOREIGN KEY (id_mission, id_division) REFERENCES Mission_Division(id_mission, id_division) ON DELETE CASCADE
);

-- Table: Partenaire
CREATE TABLE Partenaire (
    id_partenaire SERIAL PRIMARY KEY,
    nom_partenaire VARCHAR(255) NOT NULL
);

-- Table: Mission_Partenaire
CREATE TABLE Mission_Partenaire (
    id_mission INT,
    id_partenaire INT,
    part_partenaire DOUBLE PRECISION CHECK (part_partenaire >= 0 AND part_partenaire <= 100),
    attribue_le DATE,
    CONSTRAINT pk_mission_partenaire PRIMARY KEY (id_mission, id_partenaire),
    CONSTRAINT fk_mission_part_mission FOREIGN KEY (id_mission) REFERENCES Mission(id_mission) ON DELETE CASCADE,
    CONSTRAINT fk_mission_part_part FOREIGN KEY (id_partenaire) REFERENCES Partenaire(id_partenaire) ON DELETE CASCADE
);

-- Table: Avancement_Partenaire
CREATE TABLE Avancement_Partenaire (
    id_mission INT,
    id_partenaire INT,
    rapport TEXT,
    montant_obtenu DOUBLE PRECISION CHECK (montant_obtenu >= 0),
    cree_le DATE,
    maj_le DATE,
    CONSTRAINT pk_avancement_partenaire PRIMARY KEY (id_mission, id_partenaire),
    CONSTRAINT fk_avancement_partenaire FOREIGN KEY (id_mission, id_partenaire) REFERENCES Mission_Partenaire(id_mission, id_partenaire) ON DELETE CASCADE
);

-- Table: Sous_Traitant
CREATE TABLE Sous_Traitant (
    id_soustrait SERIAL PRIMARY KEY,
    nom_soustrait VARCHAR(255) NOT NULL
);

-- Table: Mission_ST
CREATE TABLE Mission_ST (
    id_mission INT,
    id_soustrait INT,
    prix_mission_st DOUBLE PRECISION CHECK (prix_mission_st >= 0),
    attribue_le DATE,
    CONSTRAINT pk_mission_st PRIMARY KEY (id_mission, id_soustrait),
    CONSTRAINT fk_mission_st_mission FOREIGN KEY (id_mission) REFERENCES Mission(id_mission) ON DELETE CASCADE,
    CONSTRAINT fk_mission_st_soustrait FOREIGN KEY (id_soustrait) REFERENCES Sous_Traitant(id_soustrait) ON DELETE CASCADE
);

-- Table: Avancement_ST
CREATE TABLE Avancement_ST (
    id_mission INT,
    id_soustrait INT,
    rapport TEXT,
    montant_obtenu DOUBLE PRECISION CHECK (montant_obtenu >= 0),
    cree_le DATE,
    maj_le DATE,
    CONSTRAINT pk_avancement_st PRIMARY KEY (id_mission, id_soustrait),
    CONSTRAINT fk_avancement_st FOREIGN KEY (id_mission, id_soustrait) REFERENCES Mission_ST(id_mission, id_soustrait) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_affaire_num_marche ON Affaire(num_marche);
CREATE INDEX idx_client_id_pays ON Client(id_pays);
CREATE INDEX idx_utilisateur_pole ON Utilisateur(pole);
CREATE INDEX idx_utilisateur_division ON Utilisateur(division);
CREATE INDEX idx_marche_id_client ON Marche(id_client);
CREATE INDEX idx_mission_division_principale ON Mission(division_principale);
CREATE INDEX idx_mission_affaire ON Mission(affaire);
CREATE INDEX idx_facturation_id_mission ON Facturation(id_mission);
CREATE INDEX idx_encaissement_id_mission ON Encaissement(id_mission);
CREATE INDEX idx_mission_division ON Mission_Division(id_mission, id_division);
CREATE INDEX idx_mission_partenaire ON Mission_Partenaire(id_mission, id_partenaire);
CREATE INDEX idx_mission_st ON Mission_ST(id_mission, id_soustrait);
