package com.langleague.service;

import com.langleague.domain.Chapter;
import com.langleague.repository.ChapterRepository;
import com.langleague.service.dto.ChapterDTO;
import com.langleague.service.mapper.ChapterMapper;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for managing favorite lessons.
 * Use case 38: Save favorite lessons
 */
@Service
@Transactional
public class FavoriteService {

    private static final Logger LOG = LoggerFactory.getLogger(FavoriteService.class);

    // In-memory storage for favorites (should be replaced with database table)
    private final Map<String, List<Long>> userFavorites = new HashMap<>();

    private final ChapterRepository chapterRepository;
    private final ChapterMapper chapterMapper;

    public FavoriteService(ChapterRepository chapterRepository, ChapterMapper chapterMapper) {
        this.chapterRepository = chapterRepository;
        this.chapterMapper = chapterMapper;
    }

    /**
     * Add chapter to user's favorites.
     * Use case 38: Save favorite lessons
     *
     * @param chapterId the chapter ID
     * @param userLogin the user login
     */
    public void addFavorite(Long chapterId, String userLogin) {
        LOG.debug("Request to add chapter {} to favorites for user {}", chapterId, userLogin);

        List<Long> favorites = userFavorites.computeIfAbsent(userLogin, k -> new ArrayList<>());
        if (!favorites.contains(chapterId)) {
            favorites.add(chapterId);
            LOG.info("Chapter {} added to favorites for user {}", chapterId, userLogin);
        } else {
            LOG.debug("Chapter {} already in favorites for user {}", chapterId, userLogin);
        }
    }

    /**
     * Remove chapter from user's favorites.
     * Use case 38: Save favorite lessons
     *
     * @param chapterId the chapter ID
     * @param userLogin the user login
     */
    public void removeFavorite(Long chapterId, String userLogin) {
        LOG.debug("Request to remove chapter {} from favorites for user {}", chapterId, userLogin);

        List<Long> favorites = userFavorites.get(userLogin);
        if (favorites != null) {
            favorites.remove(chapterId);
            LOG.info("Chapter {} removed from favorites for user {}", chapterId, userLogin);
        }
    }

    /**
     * Get all favorite chapters for a user.
     * Use case 38: Save favorite lessons
     *
     * @param userLogin the user login
     * @return list of favorite chapters
     */
    @Transactional(readOnly = true)
    public List<ChapterDTO> getFavorites(String userLogin) {
        LOG.debug("Request to get favorites for user {}", userLogin);

        List<Long> favoriteIds = userFavorites.getOrDefault(userLogin, new ArrayList<>());
        if (favoriteIds.isEmpty()) {
            return new ArrayList<>();
        }

        return chapterRepository.findAllById(favoriteIds).stream().map(chapterMapper::toDto).collect(Collectors.toList());
    }

    /**
     * Check if a chapter is in user's favorites.
     * Use case 38: Save favorite lessons
     *
     * @param chapterId the chapter ID
     * @param userLogin the user login
     * @return true if favorite, false otherwise
     */
    @Transactional(readOnly = true)
    public boolean isFavorite(Long chapterId, String userLogin) {
        LOG.debug("Request to check if chapter {} is favorite for user {}", chapterId, userLogin);

        List<Long> favorites = userFavorites.get(userLogin);
        return favorites != null && favorites.contains(chapterId);
    }
}
