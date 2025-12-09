package com.langleague.web.rest;

import com.langleague.service.FavoriteService;
import com.langleague.service.dto.ChapterDTO;
import com.langleague.web.rest.errors.BadRequestAlertException;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for managing favorite lessons.
 * Use case 38: Save favorite lessons
 */
@RestController
@RequestMapping("/api/favorites")
public class FavoriteResource {

    private static final Logger LOG = LoggerFactory.getLogger(FavoriteResource.class);

    private static final String ENTITY_NAME = "favorite";

    private final FavoriteService favoriteService;

    public FavoriteResource(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    /**
     * {@code POST  /favorites/chapter/:chapterId} : Add a chapter to favorites.
     * Use case 38: Save favorite lessons
     *
     * @param chapterId the id of the chapter to add to favorites.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)}.
     */
    @PostMapping("/chapter/{chapterId}")
    public ResponseEntity<Void> addFavorite(@PathVariable("chapterId") Long chapterId) {
        LOG.debug("REST request to add chapter to favorites : {}", chapterId);
        String userLogin = com.langleague.security.SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", ENTITY_NAME, "notauthenticated")
        );

        favoriteService.addFavorite(chapterId, userLogin);
        return ResponseEntity.ok().build();
    }

    /**
     * {@code DELETE  /favorites/chapter/:chapterId} : Remove a chapter from favorites.
     * Use case 38: Save favorite lessons
     *
     * @param chapterId the id of the chapter to remove from favorites.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/chapter/{chapterId}")
    public ResponseEntity<Void> removeFavorite(@PathVariable("chapterId") Long chapterId) {
        LOG.debug("REST request to remove chapter from favorites : {}", chapterId);
        String userLogin = com.langleague.security.SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", ENTITY_NAME, "notauthenticated")
        );

        favoriteService.removeFavorite(chapterId, userLogin);
        return ResponseEntity.noContent().build();
    }

    /**
     * {@code GET  /favorites} : Get all favorite chapters for the logged-in user.
     * Use case 38: Save favorite lessons
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of favorite chapters in body.
     */
    @GetMapping("")
    public ResponseEntity<List<ChapterDTO>> getFavorites() {
        LOG.debug("REST request to get favorites");
        String userLogin = com.langleague.security.SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", ENTITY_NAME, "notauthenticated")
        );

        List<ChapterDTO> favorites = favoriteService.getFavorites(userLogin);
        return ResponseEntity.ok().body(favorites);
    }

    /**
     * {@code GET  /favorites/chapter/:chapterId/check} : Check if a chapter is in favorites.
     * Use case 38: Save favorite lessons
     *
     * @param chapterId the id of the chapter to check.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and boolean in body.
     */
    @GetMapping("/chapter/{chapterId}/check")
    public ResponseEntity<Boolean> isFavorite(@PathVariable("chapterId") Long chapterId) {
        LOG.debug("REST request to check if chapter is favorite : {}", chapterId);
        String userLogin = com.langleague.security.SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", ENTITY_NAME, "notauthenticated")
        );

        boolean isFav = favoriteService.isFavorite(chapterId, userLogin);
        return ResponseEntity.ok().body(isFav);
    }

    /**
     * {@code PUT  /favorites/chapter/:chapterId/toggle} : Toggle favorite status for a chapter.
     * Use case 38: Save favorite lessons
     *
     * @param chapterId the id of the chapter to toggle.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and boolean indicating new state.
     */
    @PutMapping("/chapter/{chapterId}/toggle")
    public ResponseEntity<Boolean> toggleFavorite(@PathVariable("chapterId") Long chapterId) {
        LOG.debug("REST request to toggle favorite for chapter : {}", chapterId);
        String userLogin = com.langleague.security.SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", ENTITY_NAME, "notauthenticated")
        );

        boolean isFav = favoriteService.isFavorite(chapterId, userLogin);
        if (isFav) {
            favoriteService.removeFavorite(chapterId, userLogin);
            return ResponseEntity.ok().body(false);
        } else {
            favoriteService.addFavorite(chapterId, userLogin);
            return ResponseEntity.ok().body(true);
        }
    }
}
