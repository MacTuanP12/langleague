package com.langleague.service;

import com.langleague.domain.Chapter;
import com.langleague.repository.ChapterRepository;
import com.langleague.service.dto.ChapterDTO;
import com.langleague.service.dto.ChapterDetailDTO;
import com.langleague.service.dto.WordDTO;
import com.langleague.service.mapper.ChapterDetailMapper;
import com.langleague.service.mapper.ChapterMapper;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.langleague.domain.Chapter}.
 */
@Service
@Transactional
public class ChapterService {

    private static final Logger LOG = LoggerFactory.getLogger(ChapterService.class);

    private final ChapterRepository chapterRepository;

    private final ChapterMapper chapterMapper;

    private final ChapterDetailMapper chapterDetailMapper;

    private final WordService wordService;

    public ChapterService(
        ChapterRepository chapterRepository,
        ChapterMapper chapterMapper,
        ChapterDetailMapper chapterDetailMapper,
        WordService wordService
    ) {
        this.chapterRepository = chapterRepository;
        this.chapterMapper = chapterMapper;
        this.chapterDetailMapper = chapterDetailMapper;
        this.wordService = wordService;
    }

    /**
     * Save a chapter.
     *
     * @param chapterDTO the entity to save.
     * @return the persisted entity.
     */
    public ChapterDTO save(ChapterDTO chapterDTO) {
        LOG.debug("Request to save Chapter : {}", chapterDTO);
        Chapter chapter = chapterMapper.toEntity(chapterDTO);
        chapter = chapterRepository.save(chapter);
        return chapterMapper.toDto(chapter);
    }

    /**
     * Update a chapter.
     *
     * @param chapterDTO the entity to save.
     * @return the persisted entity.
     */
    public ChapterDTO update(ChapterDTO chapterDTO) {
        LOG.debug("Request to update Chapter : {}", chapterDTO);
        Chapter chapter = chapterMapper.toEntity(chapterDTO);
        chapter = chapterRepository.save(chapter);
        return chapterMapper.toDto(chapter);
    }

    /**
     * Partially update a chapter.
     *
     * @param chapterDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ChapterDTO> partialUpdate(ChapterDTO chapterDTO) {
        LOG.debug("Request to partially update Chapter : {}", chapterDTO);

        return chapterRepository
            .findById(chapterDTO.getId())
            .map(existingChapter -> {
                chapterMapper.partialUpdate(existingChapter, chapterDTO);

                return existingChapter;
            })
            .map(chapterRepository::save)
            .map(chapterMapper::toDto);
    }

    /**
     * Get all the chapters.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ChapterDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Chapters");
        return chapterRepository.findAll(pageable).map(chapterMapper::toDto);
    }

    /**
     * Get one chapter by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ChapterDTO> findOne(Long id) {
        LOG.debug("Request to get Chapter : {}", id);
        return chapterRepository.findById(id).map(chapterMapper::toDto);
    }

    /**
     * Delete the chapter by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Chapter : {}", id);
        chapterRepository.deleteById(id);
    }

    /**
     * Get all chapters by book ID, ordered by order index.
     * Use case 16: View assigned lessons
     *
     * @param bookId the ID of the book
     * @return list of chapters
     */
    @Transactional(readOnly = true)
    public List<ChapterDTO> findByBookId(Long bookId) {
        LOG.debug("Request to get all Chapters by book id : {}", bookId);
        return chapterRepository.findByBookIdOrderByOrderIndexAsc(bookId).stream().map(chapterMapper::toDto).toList();
    }

    /**
     * Get chapter with all eager relationships (exercises, words, grammar).
     * Use case 17: View lesson details
     * OPTIMIZED: Uses multiple queries to avoid Cartesian product
     *
     * @param id the ID of the chapter
     * @return the chapter with all related content
     */
    @Transactional(readOnly = true)
    public Optional<ChapterDetailDTO> findOneWithDetails(Long id) {
        LOG.debug("Request to get Chapter with details : {}", id);

        // OPTIMIZED: Fetch chapter with each collection separately to avoid Cartesian product
        // This executes 6 separate queries but avoids exponential result multiplication
        Optional<Chapter> chapterOpt = chapterRepository.findById(id);

        if (chapterOpt.isPresent()) {
            Chapter chapter = chapterOpt.orElseThrow();

            // Load each collection separately
            chapterRepository.findOneWithWords(id).ifPresent(c -> chapter.setWords(c.getWords()));
            chapterRepository.findOneWithGrammars(id).ifPresent(c -> chapter.setGrammars(c.getGrammars()));
            chapterRepository.findOneWithListeningExercises(id).ifPresent(c -> chapter.setListeningExercises(c.getListeningExercises()));
            chapterRepository.findOneWithReadingExercises(id).ifPresent(c -> chapter.setReadingExercises(c.getReadingExercises()));
            chapterRepository.findOneWithWritingExercises(id).ifPresent(c -> chapter.setWritingExercises(c.getWritingExercises()));
            chapterRepository.findOneWithSpeakingExercises(id).ifPresent(c -> chapter.setSpeakingExercises(c.getSpeakingExercises()));

            return Optional.of(chapterDetailMapper.toDto(chapter));
        }

        return Optional.empty();
    }

    /**
     * Search chapters by title or content.
     * Use case 18: Search lessons
     *
     * @param keyword the search keyword
     * @param pageable the pagination information
     * @return page of matching chapters
     */
    @Transactional(readOnly = true)
    public Page<ChapterDTO> searchChapters(String keyword, Pageable pageable) {
        LOG.debug("Request to search Chapters with keyword : {}", keyword);
        if (keyword == null || keyword.trim().isEmpty()) {
            return findAll(pageable);
        }
        return chapterRepository.searchByKeyword(keyword.trim(), pageable).map(chapterMapper::toDto);
    }

    /**
     * Count chapters by book ID.
     *
     * @param bookId the ID of the book
     * @return the count of chapters
     */
    @Transactional(readOnly = true)
    public long countByBookId(Long bookId) {
        LOG.debug("Request to count Chapters by book id : {}", bookId);
        return chapterRepository.countByBookId(bookId);
    }

    /**
     * Check if a chapter exists by book ID and order index.
     * Useful for validation before creating/updating chapters.
     *
     * @param bookId the ID of the book
     * @param orderIndex the order index to check
     * @return true if exists, false otherwise
     */
    @Transactional(readOnly = true)
    public boolean existsByBookIdAndOrderIndex(Long bookId, Integer orderIndex) {
        LOG.debug("Request to check if Chapter exists by book id : {} and order index : {}", bookId, orderIndex);
        return chapterRepository.existsByBookIdAndOrderIndex(bookId, orderIndex);
    }

    /**
     * Reorder chapters for a book.
     * Updates the order index of multiple chapters in a single transaction.
     *
     * @param chapterDTOs the list of chapters with updated order indices
     * @return list of updated chapters
     */
    public List<ChapterDTO> reorderChapters(List<ChapterDTO> chapterDTOs) {
        LOG.debug("Request to reorder {} Chapters", chapterDTOs.size());

        List<Chapter> updatedChapters = chapterDTOs
            .stream()
            .map(dto -> {
                Optional<Chapter> chapterOpt = chapterRepository.findById(dto.getId());
                if (chapterOpt.isPresent()) {
                    Chapter chapter = chapterOpt.orElseThrow();
                    chapter.setOrderIndex(dto.getOrderIndex());
                    return chapterRepository.save(chapter);
                }
                return null;
            })
            .filter(Objects::nonNull)
            .toList();

        return updatedChapters.stream().map(chapterMapper::toDto).toList();
    }

    /**
     * Get the next chapter in sequence.
     * Useful for navigation between chapters.
     *
     * @param chapterId the ID of the current chapter
     * @return the next chapter if exists
     */
    @Transactional(readOnly = true)
    public Optional<ChapterDTO> findNextChapter(Long chapterId) {
        LOG.debug("Request to get next Chapter after chapter id : {}", chapterId);
        Optional<Chapter> currentChapter = chapterRepository.findById(chapterId);
        if (currentChapter.isPresent() && currentChapter.orElseThrow().getBook() != null) {
            Long bookId = currentChapter.orElseThrow().getBook().getId();
            Integer currentIndex = currentChapter.orElseThrow().getOrderIndex();
            return chapterRepository.findNextChapter(bookId, currentIndex).map(chapterMapper::toDto);
        }
        return Optional.empty();
    }

    /**
     * Get the previous chapter in sequence.
     * Useful for navigation between chapters.
     *
     * @param chapterId the ID of the current chapter
     * @return the previous chapter if exists
     */
    @Transactional(readOnly = true)
    public Optional<ChapterDTO> findPreviousChapter(Long chapterId) {
        LOG.debug("Request to get previous Chapter before chapter id : {}", chapterId);
        Optional<Chapter> currentChapter = chapterRepository.findById(chapterId);
        if (currentChapter.isPresent() && currentChapter.orElseThrow().getBook() != null) {
            Long bookId = currentChapter.orElseThrow().getBook().getId();
            Integer currentIndex = currentChapter.orElseThrow().getOrderIndex();
            return chapterRepository.findPreviousChapter(bookId, currentIndex).map(chapterMapper::toDto);
        }
        return Optional.empty();
    }

    /**
     * Get all words for a specific chapter.
     *
     * @param chapterId the ID of the chapter
     * @return list of words
     */
    @Transactional(readOnly = true)
    public List<WordDTO> findWordsByChapterId(Long chapterId) {
        LOG.debug("Request to get Words by chapter id : {}", chapterId);
        return wordService.findByChapterId(chapterId);
    }
}
