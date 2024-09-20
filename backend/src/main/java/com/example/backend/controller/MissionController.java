package com.example.backend.controller;

import com.example.backend.model.Mission;
import com.example.backend.repository.MissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/missions")
public class MissionController {

    @Autowired
    private MissionRepository missionRepository;

    @GetMapping
    public List<Mission> getAllMissions() {
        return missionRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Mission> getMissionById(@PathVariable Long id) {
        return missionRepository.findById(id)
                .map(mission -> ResponseEntity.ok().body(mission))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Mission createMission(@RequestBody Mission mission) {
        return missionRepository.save(mission);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Mission> updateMission(@PathVariable Long id, @RequestBody Mission mission) {
        return missionRepository.findById(id)
                .map(existingMission -> {
                    existingMission.setLibelle_mission(mission.getLibelle_mission());
                    existingMission.setForfait(mission.isForfait());
                    existingMission.setQuantite(mission.getQuantite());
                    existingMission.setUnite(mission.getUnite());
                    existingMission.setPrixMission(mission.getPrixMission());
                    existingMission.setPrixMissionCID(mission.getPrixMissionCID());
                    existingMission.setSousTraiter(mission.isSousTraiter());
                    existingMission.setMultiDivision(mission.isMultiDivision());
                    existingMission.setCompteClient(mission.getCompteClient());
                    existingMission.setPartDivisionPrincipale(mission.getPartDivisionPrincipale());
                    existingMission.setDateDebut(mission.getDateDebut());
                    existingMission.setDateFin(mission.getDateFin());
                    existingMission.setDateArret(mission.getDateArret());
                    existingMission.setDateRecommencement(mission.getDateRecommencement());
                    existingMission.setDivisionPrincipale(mission.getDivisionPrincipale());
                    existingMission.setAffaire(mission.getAffaire());
                    return ResponseEntity.ok().body(missionRepository.save(existingMission));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteMission(@PathVariable Long id) {
        return missionRepository.findById(id)
                .map(mission -> {
                    missionRepository.delete(mission);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
