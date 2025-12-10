package com.langleague.service;

import com.langleague.domain.AppUser;
import com.langleague.domain.Chapter;
import com.langleague.domain.UserChapter;
import com.langleague.domain.enumeration.LearningStatus;
import com.langleague.repository.AppUserRepository;
import com.langleague.repository.ChapterProgressRepository;
import com.langleague.repository.ChapterRepository;
import com.langleague.repository.UserChapterRepository;
import com.langleague.service.dto.UserChapterDTO;
import com.langleague.service.mapper.UserChapterMapper;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.langleague.domain.UserChapter}.
 */
@Service
@Transactional
public class UserChapterService {

    private static final Logger LOG = LoggerFactory.getLogger(UserChapterService.class);

    private final UserChapterRepository userChapterRepository;

    private final UserChapterMapper userChapterMapper;

    private final ChapterProgressRepository chapterProgressRepository;

    private final AppUserRepository appUserRepository;

    private final ChapterRepository chapterRepository;

    public UserChapterService(
        UserChapterRepository userChapterRepository,
        UserChapterMapper userChapterMapper,
        ChapterProgressRepository chapterProgressRepository,
        AppUserRepository appUserRepository,
        ChapterRepository chapterRepository
    ) {
        this.userChapterRepository = userChapterRepository;
        this.userChapterMapper = userChapterMapper;
        this.chapterProgressRepository = chapterProgressRepository;
        this.appUserRepository = appUserRepository;
        this.chapterRepository = chapterRepository;
    }

    /**
     * Save a userChapter.
     *
     * @param userChapterDTO the entity to save.
     * @return the persisted entity.
     */
    public UserChapterDTO save(UserChapterDTO userChapterDTO) {
        LOG.debug("Request to save UserChapter : {}", userChapterDTO);
        UserChapter userChapter = userChapterMapper.toEntity(userChapterDTO);
        userChapter = userChapterRepository.save(userChapter);
        return userChapterMapper.toDto(userChapter);
    }

    /**
     * Update a userChapter.
     *
     * @param userChapterDTO the entity to save.
     * @return the persisted entity.
     */
    public UserChapterDTO update(UserChapterDTO userChapterDTO) {
        LOG.debug("Request to update UserChapter : {}", userChapterDTO);
        UserChapter userChapter = userChapterMapper.toEntity(userChapterDTO);
        userChapter = userChapterRepository.save(userChapter);
        return userChapterMapper.toDto(userChapter);
    }

    /**
     * Partially update a userChapter.
     *
     * @param userChapterDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<UserChapterDTO> partialUpdate(UserChapterDTO userChapterDTO) {
        LOG.debug("Request to partially update UserChapter : {}", userChapterDTO);

        return userChapterRepository
            .findById(userChapterDTO.getId())
            .map(existingUserChapter -> {
                userChapterMapper.partialUpdate(existingUserChapter, userChapterDTO);
                return existingUserChapter;
            })
            .map(userChapterRepository::save)
            .map(userChapterMapper::toDto);
    }

    /**
     * Get all the userChapters.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<UserChapterDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all UserChapters");
        return userChapterRepository.findAll(pageable).map(userChapterMapper::toDto);
    }

    /**
     * Get one userChapter by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<UserChapterDTO> findOne(Long id) {
        LOG.debug("Request to get UserChapter : {}", id);
        return userChapterRepository.findById(id).map(userChapterMapper::toDto);
    }

    /**
     * Delete the userChapter by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete UserChapter : {}", id);
        userChapterRepository.deleteById(id);
    }

    /**
     * Get all user's saved chapters with progress info.
     *
     * @param userLogin the user login
     * @return list of user chapters with progress
     */
    @Transactional(readOnly = true)
    public List<UserChapterDTO> getMySavedChapters(String userLogin) {
        LOG.debug("Request to get saved chapters for user {}", userLogin);
        return userChapterRepository
            .findByAppUser_InternalUser_LoginOrderByLastAccessedAtDesc(userLogin)
            .stream()
            .map(this::enrichWithProgress)
            .collect(Collectors.toList());
    }

    /**
     * Get favorite chapters.
     *
     * @param userLogin the user login
     * @return list of favorite chapters
     */
    @Transactional(readOnly = true)
    public List<UserChapterDTO> getFavoriteChapters(String userLogin) {
        LOG.debug("Request to get favorite chapters for user {}", userLogin);
        return userChapterRepository
            .findByAppUser_InternalUser_LoginAndIsFavoriteTrueOrderByLastAccessedAtDesc(userLogin)
            .stream()
            .map(this::enrichWithProgress)
            .collect(Collectors.toList());
    }

    /**
     * Get chapters by status.
     *
     * @param userLogin the user login
     * @param status the learning status
     * @return list of chapters
     */
    @Transactional(readOnly = true)
    public List<UserChapterDTO> getChaptersByStatus(String userLogin, LearningStatus status) {
        LOG.debug("Request to get chapters with status {} for user {}", status, userLogin);
        return userChapterRepository
            .findByAppUser_InternalUser_LoginAndLearningStatusOrderByLastAccessedAtDesc(userLogin, status)
            .stream()
            .map(this::enrichWithProgress)
            .collect(Collectors.toList());
    }

    /**
     * Toggle favorite status.
     * Auto-creates UserChapter if it doesn't exist.
     *
     * @param chapterId the chapter ID
     * @param userLogin the user login
     * @return updated DTO
     */
    public UserChapterDTO toggleFavorite(Long chapterId, String userLogin) {
        LOG.debug("Request to toggle favorite for chapter {} and user {}", chapterId, userLogin);

        Optional<UserChapter> existingUserChapter = userChapterRepository.findByAppUser_InternalUser_LoginAndChapter_Id(
            userLogin,
            chapterId
        );

        if (existingUserChapter.isPresent()) {
            // Update existing
            UserChapter userChapter = existingUserChapter.get();
            userChapter.setIsFavorite(!Boolean.TRUE.equals(userChapter.getIsFavorite()));
            UserChapter saved = userChapterRepository.save(userChapter);
            return userChapterMapper.toDto(saved);
        } else {
            // Create new UserChapter with favorite = true
            LOG.info("UserChapter not found, creating new one for chapter {} and user {}", chapterId, userLogin);

            AppUser appUser = appUserRepository
                .findByInternalUser_Login(userLogin)
                .orElseThrow(() -> new RuntimeException("AppUser not found for login: " + userLogin));

            Chapter chapter = chapterRepository
                .findById(chapterId)
                .orElseThrow(() -> new RuntimeException("Chapter not found: " + chapterId));

            UserChapter newUserChapter = new UserChapter();
            newUserChapter.setAppUser(appUser);
            newUserChapter.setChapter(chapter);
            newUserChapter.setIsFavorite(true);
            newUserChapter.setLearningStatus(LearningStatus.NOT_STARTED);
            newUserChapter.setSavedAt(Instant.now());

            UserChapter saved = userChapterRepository.save(newUserChapter);
            return userChapterMapper.toDto(saved);
        }
    }

    /**
     * Update notes for a chapter.
     *
     * @param chapterId the chapter ID
     * @param userLogin the user login
     * @param notes the notes
     * @return updated DTO
     */
    public UserChapterDTO updateNotes(Long chapterId, String userLogin, String notes) {
        LOG.debug("Request to update notes for chapter {} and user {}", chapterId, userLogin);
        return userChapterRepository
            .findByAppUser_InternalUser_LoginAndChapter_Id(userLogin, chapterId)
            .map(userChapter -> {
                userChapter.setNotes(notes);
                return userChapterRepository.save(userChapter);
            })
            .map(userChapterMapper::toDto)
            .orElseThrow(() -> new RuntimeException("UserChapter not found"));
    }

    /**
     * Update tags for a chapter.
     *
     * @param chapterId the chapter ID
     * @param userLogin the user login
     * @param tags the tags
     * @return updated DTO
     */
    public UserChapterDTO updateTags(Long chapterId, String userLogin, String tags) {
        LOG.debug("Request to update tags for chapter {} and user {}", chapterId, userLogin);
        return userChapterRepository
            .findByAppUser_InternalUser_LoginAndChapter_Id(userLogin, chapterId)
            .map(userChapter -> {
                userChapter.setTags(tags);
                return userChapterRepository.save(userChapter);
            })
            .map(userChapterMapper::toDto)
            .orElseThrow(() -> new RuntimeException("UserChapter not found"));
    }

    /**
     * Remove chapter from library.
     *
     * @param chapterId the chapter ID
     * @param userLogin the user login
     */
    @Transactional
    public void removeChapter(Long chapterId, String userLogin) {
        LOG.debug("Request to remove chapter {} for user {}", chapterId, userLogin);
        userChapterRepository.deleteByAppUser_InternalUser_LoginAndChapter_Id(userLogin, chapterId);
    }

    /**
     * Check if chapter is saved.
     *
     * @param chapterId the chapter ID
     * @param userLogin the user login
     * @return true if saved
     */
    @Transactional(readOnly = true)
    public boolean isChapterSaved(Long chapterId, String userLogin) {
        return userChapterRepository.existsByAppUser_InternalUser_LoginAndChapter_Id(userLogin, chapterId);
    }

    /**
     * Enrich UserChapter with progress info from ChapterProgress.
     *
     * @param userChapter the user chapter
     * @return enriched DTO
     */
    private UserChapterDTO enrichWithProgress(UserChapter userChapter) {
        UserChapterDTO dto = userChapterMapper.toDto(userChapter);

        // Add chapter details
        if (userChapter.getChapter() != null) {
            dto.setChapterId(userChapter.getChapter().getId());
            dto.setChapterTitle(userChapter.getChapter().getTitle());
            dto.setChapterOrderIndex(userChapter.getChapter().getOrderIndex());

            // Add book details
            if (userChapter.getChapter().getBook() != null) {
                dto.setBookId(userChapter.getChapter().getBook().getId());
                dto.setBookTitle(userChapter.getChapter().getBook().getTitle());
                dto.setBookThumbnail(userChapter.getChapter().getBook().getThumbnail());
                dto.setBookLevel(
                    userChapter.getChapter().getBook().getLevel() != null ? userChapter.getChapter().getBook().getLevel().name() : null
                );
            }
        }

        // Get progress from ChapterProgress
        if (userChapter.getAppUser() != null && userChapter.getChapter() != null) {
            chapterProgressRepository
                .findByChapterIdAndAppUser_InternalUser_Login(
                    userChapter.getChapter().getId(),
                    userChapter.getAppUser().getInternalUser().getLogin()
                )
                .ifPresent(progress -> {
                    dto.setProgressPercent(progress.getPercent() != null ? progress.getPercent() : 0);
                    dto.setCompleted(progress.getCompleted() != null ? progress.getCompleted() : false);
                });
        }

        return dto;
    }
}
