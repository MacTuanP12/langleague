package com.langleague.web.rest;

import com.langleague.domain.StreakIcon;
import com.langleague.repository.StreakIconRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for managing {@link StreakIcon}.
 * Simple CRUD for reference data (icons based on streak days).
 */
@RestController
@RequestMapping("/api/streak-icons")
public class StreakIconResource {

    private static final Logger LOG = LoggerFactory.getLogger(StreakIconResource.class);

    private final StreakIconRepository streakIconRepository;

    public StreakIconResource(StreakIconRepository streakIconRepository) {
        this.streakIconRepository = streakIconRepository;
    }

    /**
     * {@code GET /streak-icons} : Get all streak icons ordered by requirement.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and list of icons in body.
     */
    @GetMapping("")
    public ResponseEntity<List<StreakIcon>> getAllIcons() {
        LOG.debug("REST request to get all streak icons");
        List<StreakIcon> icons = streakIconRepository.findAllByOrderByMinDaysAsc();
        return ResponseEntity.ok().body(icons);
    }

    /**
     * {@code GET /streak-icons/:id} : Get one icon by id.
     *
     * @param id the icon ID
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and icon in body.
     */
    @GetMapping("/{id}")
    public ResponseEntity<StreakIcon> getIcon(@PathVariable Long id) {
        LOG.debug("REST request to get streak icon: {}", id);
        Optional<StreakIcon> icon = streakIconRepository.findById(id);
        return ResponseEntity.of(icon);
    }

    /**
     * {@code GET /streak-icons/current} : Get current icon for a streak.
     * Use case 39: Track learning streak - display current icon
     *
     * @param currentStreak the user's current streak days
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and icon in body.
     */
    @GetMapping("/current")
    public ResponseEntity<StreakIcon> getCurrentIcon(@RequestParam Integer currentStreak) {
        LOG.debug("REST request to get current icon for streak: {}", currentStreak);
        Optional<StreakIcon> icon = streakIconRepository.findCurrentIconForStreak(currentStreak);
        return ResponseEntity.of(icon);
    }

    /**
     * {@code GET /streak-icons/next} : Get next icon to unlock.
     *
     * @param currentStreak the user's current streak days
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and icon in body.
     */
    @GetMapping("/next")
    public ResponseEntity<StreakIcon> getNextIcon(@RequestParam Integer currentStreak) {
        LOG.debug("REST request to get next icon for streak: {}", currentStreak);
        Optional<StreakIcon> icon = streakIconRepository.findNextIcon(currentStreak);
        return ResponseEntity.of(icon);
    }

    /**
     * {@code GET /streak-icons/unlocked} : Get all unlocked icons for a streak.
     *
     * @param currentStreak the user's current streak days
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and list of icons in body.
     */
    @GetMapping("/unlocked")
    public ResponseEntity<List<StreakIcon>> getUnlockedIcons(@RequestParam Integer currentStreak) {
        LOG.debug("REST request to get unlocked icons for streak: {}", currentStreak);
        List<StreakIcon> icons = streakIconRepository.findUnlockedIcons(currentStreak);
        return ResponseEntity.ok().body(icons);
    }

    /**
     * {@code GET /streak-icons/locked} : Get all locked icons for a streak.
     *
     * @param currentStreak the user's current streak days
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and list of icons in body.
     */
    @GetMapping("/locked")
    public ResponseEntity<List<StreakIcon>> getLockedIcons(@RequestParam Integer currentStreak) {
        LOG.debug("REST request to get locked icons for streak: {}", currentStreak);
        List<StreakIcon> icons = streakIconRepository.findLockedIcons(currentStreak);
        return ResponseEntity.ok().body(icons);
    }
}
