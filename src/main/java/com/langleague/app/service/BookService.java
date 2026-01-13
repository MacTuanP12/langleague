package com.langleague.app.service;

import com.langleague.app.domain.Book;
import com.langleague.app.domain.UserProfile;
import com.langleague.app.repository.BookRepository;
import com.langleague.app.repository.UserProfileRepository;
import com.langleague.app.security.SecurityUtils;
import com.langleague.app.service.dto.BookDTO;
import com.langleague.app.service.mapper.BookMapper;
import java.time.Instant;
import java.util.Optional;
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
            SecurityUtils.getCurrentUserLogin()
                .flatMap(userProfileRepository::findOneByUserIsCurrentUser)
                .ifPresent(book::setTeacherProfile);
        }

        if (book.getCreatedAt() == null) {
            book.setCreatedAt(Instant.now());
        }

        book = bookRepository.save(book);
        return bookMapper.toDto(book);
    }

    /**
     * Update a book.
     *
     * @param bookDTO the entity to save.
     * @return the persisted entity.
     */
    public BookDTO update(BookDTO bookDTO) {
        LOG.debug("Request to update Book : {}", bookDTO);
        Book book = bookMapper.toEntity(bookDTO);

        // Preserve existing fields if necessary, but for now standard update
        // If teacher profile is lost in DTO, we might want to recover it, but usually DTO should have it or we trust the client/mapper
        // For security, we might want to ensure the teacher doesn't change the owner, but that's a refinement.

        book = bookRepository.save(book);
        return bookMapper.toDto(book);
    }

    /**
     * Partially update a book.
     *
     * @param bookDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<BookDTO> partialUpdate(BookDTO bookDTO) {
        LOG.debug("Request to partially update Book : {}", bookDTO);

        return bookRepository
            .findById(bookDTO.getId())
            .map(existingBook -> {
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
     * Delete the book by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Book : {}", id);
        bookRepository.deleteById(id);
    }
}
