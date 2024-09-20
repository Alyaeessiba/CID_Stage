package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "Mission")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Mission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_mission;

    @Column(nullable = false)
    private String libelle_mission;

    @Column(name = "is_forfait", nullable = false)
    private boolean isForfait;

    @Column(nullable = false)
    private int quantite;

    @Column
    private String unite;

    @Column(name = "prix_mission", nullable = false)
    private Double prixMission;

    @Column(name = "prix_mission_CID", nullable = false)
    private Double prixMissionCID;

    @Column(name = "is_sous_traiter", nullable = false)
    private boolean isSousTraiter;

    @Column(name = "is_multi_division", nullable = false)
    private boolean isMultiDivision;

    @Column(name = "compte_client", nullable = false)
    private Double compteClient;

    @Column(name = "part_division_principale", nullable = false)
    private Double partDivisionPrincipale;

    @Column(name = "date_debut", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date dateDebut;

    @Column(name = "date_fin", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date dateFin;

    @Column(name = "date_arret")
    @Temporal(TemporalType.DATE)
    private Date dateArret;

    @Column(name = "date_recommencement")
    @Temporal(TemporalType.DATE)
    private Date dateRecommencement;

    @ManyToOne
    @JoinColumn(name = "division_principale")
    private Division divisionPrincipale;

    @ManyToOne
    @JoinColumn(name = "affaire")
    private Affaire affaire;
}
