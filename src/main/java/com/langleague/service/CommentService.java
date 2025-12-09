package com.langleague.service;

import com.langleague.domain.Comment;
import com.langleague.repository.CommentRepository;
import com.langleague.service.dto.CommentDTO;
import com.langleague.service.mapper.CommentMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.langleague.domain.Comment}.
 */
@Service
@Transactional
public class CommentService {

    private static final Logger LOG = LoggerFactory.getLogger(CommentService.class);

    private final CommentRepository commentRepository;
    private final CommentMapper commentMapper;
    private final com.langleague.repository.AppUserRepository appUserRepository;
    private final com.langleague.repository.ChapterRepository chapterRepository;

    public CommentService(
        CommentRepository commentRepository,
        CommentMapper commentMapper,
        com.langleague.repository.AppUserRepository appUserRepository,
        com.langleague.repository.ChapterRepository chapterRepository
    ) {
        this.commentRepository = commentRepository;
        this.commentMapper = commentMapper;
        this.appUserRepository = appUserRepository;
        this.chapterRepository = chapterRepository;
    }

    /**
     * Save a comment.
     *
     * @param commentDTO the entity to save.
     * @return the persisted entity.
     */
    public CommentDTO save(CommentDTO commentDTO) {
        LOG.debug("Request to save Comment : {}", commentDTO);
        Comment comment = commentMapper.toEntity(commentDTO);
        comment = commentRepository.save(comment);
        return commentMapper.toDto(comment);
    }

    /**
     * Update a comment.
     *
     * @param commentDTO the entity to save.
     * @return the persisted entity.
     */
    public CommentDTO update(CommentDTO commentDTO) {
        LOG.debug("Request to update Comment : {}", commentDTO);
        Comment comment = commentMapper.toEntity(commentDTO);
        comment = commentRepository.save(comment);
        return commentMapper.toDto(comment);
    }

    /**
     * Partially update a comment.
     *
     * @param commentDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<CommentDTO> partialUpdate(CommentDTO commentDTO) {
        LOG.debug("Request to partially update Comment : {}", commentDTO);

        return commentRepository
            .findById(commentDTO.getId())
            .map(existingComment -> {
                commentMapper.partialUpdate(existingComment, commentDTO);

                return existingComment;
            })
            .map(commentRepository::save)
            .map(commentMapper::toDto);
    }

    /**
     * Get all the comments.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<CommentDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Comments");
        return commentRepository.findAll(pageable).map(commentMapper::toDto);
    }

    /**
     * Get one comment by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<CommentDTO> findOne(Long id) {
        LOG.debug("Request to get Comment : {}", id);
        return commentRepository.findById(id).map(commentMapper::toDto);
    }

    /**
     * Delete the comment by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Comment : {}", id);
        commentRepository.deleteById(id);
    }

    /**
     * Post a comment on a chapter.
     * Use case 34: Post question/comment
     *
     * @param chapterId chapter ID
     * @param userId    internal user ID
     * @param content   comment content
     * @return the saved comment
     */
    public CommentDTO postComment(Long chapterId, Long userId, String content) {
        LOG.debug("Request to post comment on chapter {} by user {}", chapterId, userId);

        com.langleague.domain.Comment comment = new com.langleague.domain.Comment();
        comment.setContent(content);
        comment.setCreatedAt(java.time.Instant.now());

        // Set AppUser
        com.langleague.domain.AppUser appUser = appUserRepository
            .findByInternalUserId(userId)
            .orElseThrow(() -> new RuntimeException("AppUser not found for user: " + userId));
        comment.setAppUser(appUser);

        // Note: Comment entity doesn't have chapter field in the current model
        // If you need to associate with chapter, you'll need to add that field to
        // Comment entity

        comment = commentRepository.save(comment);
        return commentMapper.toDto(comment);
    }

    /**
     * Get all comments for a chapter.
     *
     * @param chapterId chapter ID
     * @param pageable  pagination info
     * @return page of comments
     */
    @Transactional(readOnly = true)
    public Page<CommentDTO> findByChapterId(Long chapterId, Pageable pageable) {
        LOG.debug("Request to get comments for chapter {}", chapterId);
        return commentRepository.findByChapterId(chapterId, pageable).map(commentMapper::toDto);
    }

    /**
     * Delete comment by admin.
     *
     * @param id comment ID
     */
    public void moderateDelete(Long id) {
        LOG.debug("Request to moderate delete comment {}", id);
        commentRepository.deleteById(id);
    }

    /**
     * Edit comment content by admin.
     *
     * @param id         comment ID
     * @param newContent new content
     * @return updated comment
     */
    public Optional<CommentDTO> moderateEdit(Long id, String newContent) {
        LOG.debug("Request to moderate edit comment {}", id);
        return commentRepository
            .findById(id)
            .map(comment -> {
                comment.setContent(newContent);
                commentRepository.save(comment);
                return commentMapper.toDto(comment);
            });
    }
}
