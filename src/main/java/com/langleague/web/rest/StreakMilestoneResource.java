package com.langleague.web.rest;

import com.langleague.domain.StreakMilestone;
import com.langleague.repository.StreakMilestoneRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for managing {@link StreakMilestone}.
 * Simple CRUD for reference data (milestones/progress markers).
 */
@RestController
@RequestMapping("/api/streak-milestones")
public class StreakMilestoneResource {

    private static final Logger LOG = LoggerFactory.getLogger(StreakMilestoneResource.class);

    private final StreakMilestoneRepository streakMilestoneRepository;

    public StreakMilestoneResource(StreakMilestoneRepository streakMilestoneRepository) {
        this.streakMilestoneRepository = streakMilestoneRepository;
    }

    /**
     * {@code GET /streak-milestones} : Get all milestones ordered by days.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and list of milestones in body.
     */
    @GetMapping("")
    public ResponseEntity<List<StreakMilestone>> getAllMilestones() {
        LOG.debug("REST request to get all streak milestones");
        List<StreakMilestone> milestones = streakMilestoneRepository.findAllByOrderByMilestoneDaysAsc();
        return ResponseEntity.ok().body(milestones);
    }

    /**
     * {@code GET /streak-milestones/:id} : Get one milestone by id.
     *
     * @param id the milestone ID
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and milestone in body.
     */
    @GetMapping("/{id}")
    public ResponseEntity<StreakMilestone> getMilestone(@PathVariable Long id) {
        LOG.debug("REST request to get streak milestone: {}", id);
        Optional<StreakMilestone> milestone = streakMilestoneRepository.findById(id);
        return ResponseEntity.of(milestone);
    }

    /**
     * {@code GET /streak-milestones/achieved} : Get achieved milestones for a streak.
     * Use case 39: Track learning streak - show progress
     *
     * @param currentStreak the user's current streak days
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and list of milestones in body.
     */
    @GetMapping("/achieved")
    public ResponseEntity<List<StreakMilestone>> getAchievedMilestones(@RequestParam Integer currentStreak) {
        LOG.debug("REST request to get achieved milestones for streak: {}", currentStreak);
        List<StreakMilestone> milestones = streakMilestoneRepository.findAchievedMilestones(currentStreak);
        return ResponseEntity.ok().body(milestones);
    }

    /**
     * {@code GET /streak-milestones/next} : Get upcoming milestones.
     *
     * @param currentStreak the user's current streak days
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and list of milestones in body.
     */
    @GetMapping("/next")
    public ResponseEntity<List<StreakMilestone>> getNextMilestones(@RequestParam Integer currentStreak) {
        LOG.debug("REST request to get next milestones for streak: {}", currentStreak);
        List<StreakMilestone> milestones = streakMilestoneRepository.findNextMilestones(currentStreak);
        return ResponseEntity.ok().body(milestones);
    }
}
