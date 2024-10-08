package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "Pole")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pole {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_pole;

    @Column(nullable = false)
    private String libelle_pole;
}

