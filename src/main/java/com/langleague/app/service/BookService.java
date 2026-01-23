package com.langleague.app.service;

import com.langleague.app.domain.Book;
import com.langleague.app.domain.UserProfile;
import com.langleague.app.repository.BookRepository;
import com.langleague.app.repository.UserProfileRepository;
import com.langleague.app.security.SecurityUtils;
import com.langleague.app.service.dto.BookDTO;
import com.langleague.app.service.mapper.BookMapper;
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
 * Service Implementation for managing {@link com.langleague.app.domain.Book}.
 */
@Service
@Transactional
public class BookService {

    private static final Logger LOG = LoggerFactory.getLogger(BookService.class);

    private final BookRepository bookRepository;

    private final BookMapper bookMapper;

    private final UserProfileRepository userProfileRepository;

    public BookService(BookRepository bookRepository, BookMapper bookMapper, UserProfileRepository userProfileRepository) {
        this.bookRepository = bookRepository;
        this.bookMapper = bookMapper;
        this.userProfileRepository = userProfileRepository;
    }

    /**
     * Save a book.
     *
     * @param bookDTO the entity to save.
     * @return the persisted entity.
     */
    public BookDTO save(BookDTO bookDTO) {
        LOG.debug("Request to save Book : {}", bookDTO);

        Book book = bookMapper.toEntity(bookDTO);

        // Auto-assign current user as teacher if not provided
        if (book.getTeacherProfile() == null) {
            userProfileRepository.findOneByUserIsCurrentUser().ifPresent(book::setTeacherProfile);
        }

        if (book.getCreatedAt() == null) {
            book.setCreatedAt(Instant.now());
        }

        book = bookRepository.save(book);
        return bookMapper.toDto(book);
    }

    /**
     * Update a book.
     * Only the owner (teacher who created the book) can update it.
     *
     * @param bookDTO the entity to save.
     * @return the persisted entity.
     */
    public BookDTO update(BookDTO bookDTO) {
        LOG.debug("Request to update Book : {}", bookDTO);

        // Verify ownership before update
        Book existingBook = bookRepository.findById(bookDTO.getId()).orElseThrow(() -> new RuntimeException("Book not found"));

        UserProfile currentUserProfile = userProfileRepository
            .findOneByUserIsCurrentUser()
            .orElseThrow(() -> new RuntimeException("Current user profile not found"));

        // Check if current user is the owner (with null safety)
        if (existingBook.getTeacherProfile() == null || !existingBook.getTeacherProfile().getId().equals(currentUserProfile.getId())) {
            throw new SecurityException("You can only update your own books");
        }

        Book book = bookMapper.toEntity(bookDTO);
        // Preserve the original teacher (prevent ownership change)
        book.setTeacherProfile(existingBook.getTeacherProfile());

        // Preserve createdAt if missing
        if (book.getCreatedAt() == null) {
            book.setCreatedAt(existingBook.getCreatedAt());
        }

        book = bookRepository.save(book);
        return bookMapper.toDto(book);
    }

    /**
     * Partially update a book.
     * Only the owner (teacher who created the book) can update it.
     *
     * @param bookDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<BookDTO> partialUpdate(BookDTO bookDTO) {
        LOG.debug("Request to partially update Book : {}", bookDTO);

        return bookRepository
            .findById(bookDTO.getId())
            .map(existingBook -> {
                // Verify ownership before update
                UserProfile currentUserProfile = userProfileRepository
                    .findOneByUserIsCurrentUser()
                    .orElseThrow(() -> new RuntimeException("Current user profile not found"));

                // Check if current user is the owner
                if (
                    existingBook.getTeacherProfile() == null || !existingBook.getTeacherProfile().getId().equals(currentUserProfile.getId())
                ) {
                    throw new SecurityException("You can only update your own books");
                }

                bookMapper.partialUpdate(existingBook, bookDTO);

                return existingBook;
            })
            .map(bookRepository::save)
            .map(bookMapper::toDto);
    }

    /**
     * Get all the books.
     *
     * @param filter the filter to apply (enrolled, not-enrolled).
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<BookDTO> findAll(String filter, Pageable pageable) {
        LOG.debug("Request to get all Books with filter: {}", filter);

        if ("enrolled".equals(filter)) {
            return SecurityUtils.getCurrentUserLogin()
                .map(login -> bookRepository.findAllByEnrolledUser(login, pageable))
                .orElse(Page.empty(pageable))
                .map(bookMapper::toDto);
        }

        if ("not-enrolled".equals(filter)) {
            return SecurityUtils.getCurrentUserLogin()
                .map(login -> bookRepository.findAllByNotEnrolledUser(login, pageable))
                .orElse(Page.empty(pageable))
                .map(bookMapper::toDto);
        }

        return bookRepository.findAll(pageable).map(bookMapper::toDto);
    }

    /**
     * Get all the books.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<BookDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Books");
        return bookRepository.findAll(pageable).map(bookMapper::toDto);
    }

    /**
     * Get all public books.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<BookDTO> findAllPublic(Pageable pageable) {
        LOG.debug("Request to get all public Books");
        return bookRepository.findByIsPublic(true, pageable).map(bookMapper::toDto);
    }

    /**
     * Get all books created by the current user (teacher).
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<BookDTO> findAllMyBooks(Pageable pageable) {
        LOG.debug("Request to get all My Books");
        return SecurityUtils.getCurrentUserLogin()
            .map(login -> bookRepository.findAllByTeacherProfileUserLogin(login, pageable))
            .orElse(Page.empty(pageable))
            .map(bookMapper::toDto);
    }

    /**
     * Get all books that the current user (student) has enrolled in.
     * This is a dedicated endpoint for students to get their enrolled books,
     * avoiding the need to use TEACHER role endpoints.
     *
     * @param pageable the pagination information.
     * @return the list of enrolled books.
     */
    @Transactional(readOnly = true)
    public Page<BookDTO> findAllEnrolledBooks(Pageable pageable) {
        LOG.debug("Request to get all Enrolled Books for current user");
        return SecurityUtils.getCurrentUserLogin()
            .map(login -> bookRepository.findAllByEnrolledUser(login, pageable))
            .orElse(Page.empty(pageable))
            .map(bookMapper::toDto);
    }

    /**
     * Get one book by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<BookDTO> findOne(Long id) {
        LOG.debug("Request to get Book : {}", id);
        return bookRepository.findById(id).map(bookMapper::toDto);
    }

    /**
     * Get top 4 newest books ordered by creation date.
     * Used for featured/latest books display on homepage.
     *
     * @return the list of 4 newest books.
     */
    @Transactional(readOnly = true)
    public List<BookDTO> findTop4Newest() {
        LOG.debug("Request to get top 4 newest Books");
        return bookRepository.findTop4ByOrderByCreatedAtDesc().stream().map(bookMapper::toDto).collect(Collectors.toList());
    }

    /**
     * Delete the book by id.
     * Only the owner (teacher who created the book) can delete it.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Book : {}", id);

        // Verify ownership before delete
        Book existingBook = bookRepository.findById(id).orElseThrow(() -> new RuntimeException("Book not found"));

        UserProfile currentUserProfile = userProfileRepository
            .findOneByUserIsCurrentUser()
            .orElseThrow(() -> new RuntimeException("Current user profile not found"));

        // Check if current user is the owner (with null safety)
        if (existingBook.getTeacherProfile() == null || !existingBook.getTeacherProfile().getId().equals(currentUserProfile.getId())) {
            throw new SecurityException("You can only delete your own books");
        }

        bookRepository.deleteById(id);
    }
}
