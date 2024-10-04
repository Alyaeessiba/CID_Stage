--pole
INSERT INTO public.pole (id_pole, libelle_pole) VALUES (1, 'AUTOROUTES ET RAILS');
INSERT INTO public.pole (id_pole, libelle_pole) VALUES (2, 'ROUTES, OUVRAGES D’ART ASSISTANCE TECHNIQUE PLANIFICATION ET MOBILITE');
INSERT INTO public.pole (id_pole, libelle_pole) VALUES (3, 'AMENAGEMENTS HYDRAULIQUES');
INSERT INTO public.pole (id_pole, libelle_pole) VALUES (5, 'EAU POTABLE, ASSAINISSEMENT & ENVIRONNEMENT');
INSERT INTO public.pole (id_pole, libelle_pole) VALUES (6, 'AMENAGEMENTS HYDRO-AGRICOLES &  AMENAGEMENTS MARITIMES');
INSERT INTO public.pole (id_pole, libelle_pole) VALUES (4, 'BATIMENT, VRD');


--division
INSERT INTO public.division (id_division, nom_division, id_pole) VALUES (1, 'AUTOROUTES', 1);
INSERT INTO public.division (id_division, nom_division, id_pole) VALUES (2, 'RAILS', 1);
INSERT INTO public.division (id_division, nom_division, id_pole) VALUES (3, 'ROUTES ', 2);
INSERT INTO public.division (id_division, nom_division, id_pole) VALUES (4, 'OUVRAGES D’ART', 2);
INSERT INTO public.division (id_division, nom_division, id_pole) VALUES (5, 'ASSISTANCE TECHNIQUE ', 2);
INSERT INTO public.division (id_division, nom_division, id_pole) VALUES (6, 'PLANIFICATION ET MOBILITE', 2);
INSERT INTO public.division (id_division, nom_division, id_pole) VALUES (7, 'GRANDS BARRAGES', 3);
INSERT INTO public.division (id_division, nom_division, id_pole) VALUES (8, 'PETITS ET MOYENS BARRAGES', 3);
INSERT INTO public.division (id_division, nom_division, id_pole) VALUES (9, 'RESSOURCES EN EAU', 3);
INSERT INTO public.division (id_division, nom_division, id_pole) VALUES (10, 'VRD', 4);
INSERT INTO public.division (id_division, nom_division, id_pole) VALUES (11, 'BATIMENT ', 4);
INSERT INTO public.division (id_division, nom_division, id_pole) VALUES (12, 'ENERGIES ', 4);
INSERT INTO public.division (id_division, nom_division, id_pole) VALUES (13, 'EAU POTABLE', 5);
INSERT INTO public.division (id_division, nom_division, id_pole) VALUES (14, 'ASSAINISSEMENT ', 5);
INSERT INTO public.division (id_division, nom_division, id_pole) VALUES (15, 'ENVIRONNEMENT ', 5);
INSERT INTO public.division (id_division, nom_division, id_pole) VALUES (16, 'ASSISTANCE TECHNIQUE', 5);
INSERT INTO public.division (id_division, nom_division, id_pole) VALUES (17, 'AMENAGEMENTS MARITIMES', 6);
INSERT INTO public.division (id_division, nom_division, id_pole) VALUES (18, 'AMENAGEMENTS HYDRO-AGRICOLES', 6);

--Unite
INSERT INTO public.unite (id_unite, nom_unite) VALUES (1, 'Mètre');
INSERT INTO public.unite (id_unite, nom_unite) VALUES (2, 'Kilomètre');
INSERT INTO public.unite (id_unite, nom_unite) VALUES (3, 'M²');
INSERT INTO public.unite (id_unite, nom_unite) VALUES (4, 'Tonne');
INSERT INTO public.unite (id_unite, nom_unite) VALUES (5, 'Litre');
INSERT INTO public.unite (id_unite, nom_unite) VALUES (6, 'Pied');
INSERT INTO public.unite (id_unite, nom_unite) VALUES (7, 'Mile');
INSERT INTO public.unite (id_unite, nom_unite) VALUES (8, 'Mois');
INSERT INTO public.unite (id_unite, nom_unite) VALUES (9, 'Kilogramme');
INSERT INTO public.unite (id_unite, nom_unite) VALUES (10, 'Forfait');


--pays
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (1, 'Afghanistan');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (2, 'Afrique du Sud');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (3, 'Albanie');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (4, 'Algérie');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (5, 'Allemagne');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (6, 'Andorre');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (7, 'Angola');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (8, 'Antigua-et-Barbuda');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (9, 'Arabie Saoudite');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (10, 'Argentine');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (11, 'Arménie');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (12, 'Australie');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (13, 'Autriche');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (14, 'Azerbaïdjan');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (15, 'Bahamas');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (16, 'Bahreïn');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (17, 'Bangladesh');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (18, 'Barbade');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (19, 'Belgique');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (20, 'Belize');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (21, 'Bénin');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (22, 'Bhoutan');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (23, 'Biélorussie');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (24, 'Birmanie');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (25, 'Bolivie');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (26, 'Bosnie-Herzégovine');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (27, 'Botswana');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (28, 'Brésil');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (29, 'Brunei');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (30, 'Bulgarie');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (31, 'Burkina Faso');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (32, 'Burundi');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (33, 'Cambodge');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (34, 'Cameroun');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (35, 'Canada');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (36, 'Cap-Vert');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (37, 'Chili');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (38, 'Chine');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (39, 'Chypre');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (40, 'Colombie');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (41, 'Comores');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (42, 'Congo');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (43, 'Corée du Nord');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (44, 'Corée du Sud');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (45, 'Costa Rica');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (46, 'Côte d''Ivoire');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (47, 'Croatie');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (48, 'Cuba');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (49, 'Danemark');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (50, 'Djibouti');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (51, 'Dominique');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (52, 'Égypte');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (53, 'Émirats arabes unis');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (54, 'Équateur');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (55, 'Érythrée');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (56, 'Espagne');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (57, 'Estonie');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (58, 'États-Unis');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (59, 'Éthiopie');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (60, 'Fidji');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (61, 'Finlande');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (62, 'France');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (63, 'Gabon');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (64, 'Gambie');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (65, 'Géorgie');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (66, 'Ghana');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (67, 'Grèce');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (68, 'Grenade');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (69, 'Guatemala');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (70, 'Guinée');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (71, 'Guinée équatoriale');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (72, 'Guinée-Bissau');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (73, 'Guyana');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (74, 'Haïti');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (75, 'Honduras');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (76, 'Hongrie');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (77, 'Îles Marshall');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (78, 'Îles Salomon');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (79, 'Inde');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (80, 'Indonésie');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (81, 'Irak');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (82, 'Iran');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (83, 'Irlande');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (84, 'Islande');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (85, 'Italie');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (86, 'Jamaïque');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (87, 'Japon');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (88, 'Jordanie');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (89, 'Kazakhstan');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (90, 'Kenya');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (91, 'Kirghizistan');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (92, 'Kiribati');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (93, 'Koweït');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (94, 'Laos');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (95, 'Lesotho');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (96, 'Lettonie');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (97, 'Liban');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (98, 'Liberia');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (99, 'Libye');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (100, 'Liechtenstein');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (101, 'Lituanie');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (102, 'Luxembourg');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (103, 'Macédoine du Nord');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (104, 'Madagascar');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (105, 'Malaisie');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (106, 'Malawi');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (107, 'Maldives');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (108, 'Mali');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (109, 'Malte');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (110, 'Maroc');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (111, 'Maurice');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (112, 'Mauritanie');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (113, 'Mexique');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (114, 'Micronésie');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (115, 'Moldavie');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (116, 'Monaco');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (117, 'Mongolie');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (118, 'Monténégro');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (119, 'Mozambique');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (120, 'Namibie');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (121, 'Nauru');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (122, 'Népal');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (123, 'Nicaragua');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (124, 'Niger');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (125, 'Nigeria');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (126, 'Norvège');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (127, 'Nouvelle-Zélande');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (128, 'Oman');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (129, 'Ouganda');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (130, 'Ouzbékistan');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (131, 'Pakistan');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (132, 'Palaos');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (133, 'Palestine');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (134, 'Panama');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (135, 'Papouasie-Nouvelle-Guinée');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (136, 'Paraguay');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (137, 'Pays-Bas');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (138, 'Pérou');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (139, 'Philippines');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (140, 'Pologne');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (141, 'Portugal');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (142, 'Qatar');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (143, 'République centrafricaine');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (144, 'République démocratique du Congo');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (145, 'République dominicaine');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (146, 'République tchèque');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (147, 'Roumanie');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (148, 'Royaume-Uni');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (149, 'Russie');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (150, 'Rwanda');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (151, 'Saint-Kitts-et-Nevis');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (152, 'Saint-Marin');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (153, 'Saint-Vincent-et-les-Grenadines');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (154, 'Sainte-Lucie');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (155, 'Salvador');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (156, 'Samoa');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (157, 'São Tomé-et-Principe');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (158, 'Sénégal');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (159, 'Serbie');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (160, 'Seychelles');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (161, 'Sierra Leone');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (162, 'Singapour');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (163, 'Slovaquie');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (164, 'Slovénie');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (165, 'Somalie');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (166, 'Soudan');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (167, 'Soudan du Sud');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (168, 'Sri Lanka');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (169, 'Suède');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (170, 'Suisse');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (171, 'Suriname');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (172, 'Syrie');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (173, 'Tadjikistan');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (174, 'Tanzanie');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (175, 'Tchad');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (176, 'Thaïlande');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (177, 'Timor oriental');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (178, 'Togo');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (179, 'Tonga');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (180, 'Trinité-et-Tobago');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (181, 'Tunisie');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (182, 'Turkménistan');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (183, 'Turquie');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (184, 'Tuvalu');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (185, 'Ukraine');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (186, 'Uruguay');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (187, 'Vanuatu');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (188, 'Vatican');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (189, 'Venezuela');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (190, 'Viêt Nam');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (191, 'Yémen');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (192, 'Zambie');
INSERT INTO public.pays (id_pays, libelle_pays) VALUES (193, 'Zimbabwe');


--partenaire
INSERT INTO public.partenaire (id_partenaire, nom_partenaire) VALUES (1, 'Novec (Groupe CDG)');
INSERT INTO public.partenaire (id_partenaire, nom_partenaire) VALUES (2, 'Ingema');
INSERT INTO public.partenaire (id_partenaire, nom_partenaire) VALUES (3, 'Tekciv');
INSERT INTO public.partenaire (id_partenaire, nom_partenaire) VALUES (4, 'GeoEtude');
INSERT INTO public.partenaire (id_partenaire, nom_partenaire) VALUES (5, 'SOMAGEC');
INSERT INTO public.partenaire (id_partenaire, nom_partenaire) VALUES (6, 'GeoLab Maroc');

--sous Traitant
INSERT INTO public.sous_traitant (id_soustrait, nom_soustrait) VALUES (1, 'Youssef El Mansouri');
INSERT INTO public.sous_traitant (id_soustrait, nom_soustrait) VALUES (2, 'Omar Benjelloun');
INSERT INTO public.sous_traitant (id_soustrait, nom_soustrait) VALUES (3, 'Khadija Bensalah');
INSERT INTO public.sous_traitant (id_soustrait, nom_soustrait) VALUES (4, 'Mohammed Amrani');
INSERT INTO public.sous_traitant (id_soustrait, nom_soustrait) VALUES (5, 'Amine El Fassi');
INSERT INTO public.sous_traitant (id_soustrait, nom_soustrait) VALUES (6, 'Fatima Zahra Alaoui');
INSERT INTO public.sous_traitant (id_soustrait, nom_soustrait) VALUES (7, 'Nabil Kabbaj');
INSERT INTO public.sous_traitant (id_soustrait, nom_soustrait) VALUES (8, 'Samira El Moudni');
INSERT INTO public.sous_traitant (id_soustrait, nom_soustrait) VALUES (9, 'Hicham Raji');

--role
INSERT INTO public.role (id_role, nom_role, redirection_link, requires_division, requires_pole) VALUES (1, 'admin', '/HomeAdmin', false, false);
INSERT INTO public.role (id_role, nom_role, redirection_link, requires_division, requires_pole) VALUES (2, 'Chef de Division', '/HomeCD', true, true);
INSERT INTO public.role (id_role, nom_role, redirection_link, requires_division, requires_pole) VALUES (3, 'Chef de Projet', '/HomeCDP', true, true);
INSERT INTO public.role (id_role, nom_role, redirection_link, requires_division, requires_pole) VALUES (4, 'Chef de Pole', '/HomeCP', false, true);
INSERT INTO public.role (id_role, nom_role, redirection_link, requires_division, requires_pole) VALUES (5, 'Cadre Administrative', '/HomeCA', false, true);


--client
INSERT INTO public.client (id_client, nom_client, id_pays) VALUES (1, 'Ministère de l''Équipement, du Transport, de la Logistique et de l''Eau', 110);
INSERT INTO public.client (id_client, nom_client, id_pays) VALUES (2, 'ONCF ', 110);
INSERT INTO public.client (id_client, nom_client, id_pays) VALUES (3, 'ONEE ', 110);
INSERT INTO public.client (id_client, nom_client, id_pays) VALUES (4, 'CGI ', 110);
INSERT INTO public.client (id_client, nom_client, id_pays) VALUES (5, 'Eskom ', 2);
INSERT INTO public.client (id_client, nom_client, id_pays) VALUES (6, 'Kenya Roads Board', 90);
INSERT INTO public.client (id_client, nom_client, id_pays) VALUES (7, 'TANESCO', 174);
INSERT INTO public.client (id_client, nom_client, id_pays) VALUES (8, 'Ethiopian Roads Authority', 59);


--Utilisateur
INSERT INTO public.utilisateur (id_utilisateur, adresse, date_naissance, email, is_deleted, mot_de_passe, nom, num_telephone, prenom, sexe, username, division, pays, pole) VALUES (1, 'Rabat', '1990-07-20', 'Mansouri@gmail.com', false, 'y1!Ici9Z0VSx', 'Mansouri', '0636733908', 'Mohamed', 'M', 'MohamedMansouri', null, 110, null);
INSERT INTO public.utilisateur (id_utilisateur, adresse, date_naissance, email, is_deleted, mot_de_passe, nom, num_telephone, prenom, sexe, username, division, pays, pole) VALUES (2, 'Sale', '1988-07-01', 'Benbrahim@gmail.com', false, '@5#tM2+LTyjm', 'Benbrahim', '0661667908', 'Fatima', 'F', 'FatimaBenbrahim', null, 4, 2);
INSERT INTO public.utilisateur (id_utilisateur, adresse, date_naissance, email, is_deleted, mot_de_passe, nom, num_telephone, prenom, sexe, username, division, pays, pole) VALUES (3, 'Marrakech', '1999-12-02', 'Amrani@gmail.com', false, 'r595XK!AahAN', 'Amrani', '0636345908', 'Youssef ', 'M', 'YoussefAmrani', 3, 110, 2);
INSERT INTO public.utilisateur (id_utilisateur, adresse, date_naissance, email, is_deleted, mot_de_passe, nom, num_telephone, prenom, sexe, username, division, pays, pole) VALUES (4, 'Errachidia', '1994-10-10', 'Lahmidi@gmail.com', false, 'OS@@sI3xU*Md', 'Lahmidi', '0616667908', 'Amina', 'F', 'AminaLahmidi', 3, 99, 2);
INSERT INTO public.utilisateur (id_utilisateur, adresse, date_naissance, email, is_deleted, mot_de_passe, nom, num_telephone, prenom, sexe, username, division, pays, pole) VALUES (5, 'Rabat', '1980-12-17', 'Bouziane@gmail.com', false, 'M^V)#Y6Qqp6v', 'Bouziane', '0636345908', 'Hassan', 'M', 'HassanBouziane', null, 181, 2);
INSERT INTO public.utilisateur (id_utilisateur, adresse, date_naissance, email, is_deleted, mot_de_passe, nom, num_telephone, prenom, sexe, username, division, pays, pole) VALUES (6, 'Sale', '1998-07-16', 'Houssaini@gmail.com', false, 'hmR+zzcs0vt4', 'Houssaini', '0616667908', 'Khadija', 'F', 'KhadijaHoussaini', 3, 110, 2);

--utilisateur_roles
INSERT INTO public.utilisateur_roles (utilisateur_id, role_id) VALUES (1, 1);
INSERT INTO public.utilisateur_roles (utilisateur_id, role_id) VALUES (2, 5);
INSERT INTO public.utilisateur_roles (utilisateur_id, role_id) VALUES (3, 2);
INSERT INTO public.utilisateur_roles (utilisateur_id, role_id) VALUES (4, 3);
INSERT INTO public.utilisateur_roles (utilisateur_id, role_id) VALUES (5, 4);
INSERT INTO public.utilisateur_roles (utilisateur_id, role_id) VALUES (6, 3);


--affaire
INSERT INTO public.affaire (id_affaire, date_arret, date_debut, date_fin, date_recommencement, libelle_affaire, num_marche, part_cid, prix_global, status_affaire, chef_projet_id, client_id, division_principale_id, pole_principale_id) VALUES (202400002, null, '2021-05-29', '2024-10-29', null, 'Aménagement de la Route Nationale N°42', '5212316', 45000000, 45000000, 'EN_CREATION', null, 6, 3, 2);
INSERT INTO public.affaire (id_affaire, date_arret, date_debut, date_fin, date_recommencement, libelle_affaire, num_marche, part_cid, prix_global, status_affaire, chef_projet_id, client_id, division_principale_id, pole_principale_id) VALUES (202400001, null, '2021-11-11', '2024-10-22', null, 'Construction de l''Autoroute Nord-Sud', '5212315', 456000, 456000, 'EN_CREATION', 4, 1, 3, 2);
INSERT INTO public.affaire (id_affaire, date_arret, date_debut, date_fin, date_recommencement, libelle_affaire, num_marche, part_cid, prix_global, status_affaire, chef_projet_id, client_id, division_principale_id, pole_principale_id) VALUES (202400003, null, '2022-08-18', '2024-08-22', null, 'Réhabilitation de la Route Urbaine de Marrakech', '5212317', 60000000, 80000000, 'EN_PRODUCTION', 6, 1, 3, 2);
INSERT INTO public.affaire (id_affaire, date_arret, date_debut, date_fin, date_recommencement, libelle_affaire, num_marche, part_cid, prix_global, status_affaire, chef_projet_id, client_id, division_principale_id, pole_principale_id) VALUES (202400004, null, '2024-02-24', '2024-09-25', null, 'Réhabilitation de la Route Urbaine de Tanger', '5212318', 25000000, 25000000, 'TERMINE', 6, 1, 3, 2);


--mission
INSERT INTO public.mission (id_mission, compte_client, date_arret, date_debut, date_fin, date_recommencement, libelle_mission, part_div_principale, part_mission_cid, prix_mission_total, prix_mission_unitaire, quantite, affaire_id, principal_division_id, unite_id) VALUES (1, 0, null, '2021-02-18', '2021-12-23', null, 'Étude de sol', 120000, 200000, 250000, 50, 5000, 202400001, 3, 3);
INSERT INTO public.mission (id_mission, compte_client, date_arret, date_debut, date_fin, date_recommencement, libelle_mission, part_div_principale, part_mission_cid, prix_mission_total, prix_mission_unitaire, quantite, affaire_id, principal_division_id, unite_id) VALUES (2, 0, null, '2022-01-06', '2023-02-09', null, 'Conception des plans', 1500000, 1500000, 1500000, null, 0, 202400001, 3, 10);
INSERT INTO public.mission (id_mission, compte_client, date_arret, date_debut, date_fin, date_recommencement, libelle_mission, part_div_principale, part_mission_cid, prix_mission_total, prix_mission_unitaire, quantite, affaire_id, principal_division_id, unite_id) VALUES (3, 0, null, '2023-03-01', '2024-03-02', null, 'Supervision des travaux', 360000, 360000, 1200000, 100000, 12, 202400001, 3, 8);


--mission_division
INSERT INTO public.mission_division (id, part_mission, division_id, mission_id) VALUES (1, 20000, 2, 1);

--mission_sousTraitant
INSERT INTO public.mission_sous_traitant (id, part_mission, mission_id, sous_traitant_id) VALUES (1, 60000, 1, 4);
