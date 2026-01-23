package com.langleague.app.service;

import com.langleague.app.domain.Book;
import com.langleague.app.domain.Enrollment;
import com.langleague.app.domain.UserProfile;
import com.langleague.app.domain.enumeration.EnrollmentStatus;
import com.langleague.app.repository.BookRepository;
import com.langleague.app.repository.EnrollmentRepository;
import com.langleague.app.repository.UserProfileRepository;
import com.langleague.app.service.dto.EnrollmentDTO;
import com.langleague.app.service.mapper.EnrollmentMapper;
import java.time.Instant;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.langleague.app.domain.Enrollment}.
 */
@Service
@Transactional
public class EnrollmentService {

    private static final Logger LOG = LoggerFactory.getLogger(EnrollmentService.class);

    private final EnrollmentRepository enrollmentRepository;

    private final EnrollmentMapper enrollmentMapper;

    private final UserProfileRepository userProfileRepository;

    private final BookRepository bookRepository;

    public EnrollmentService(
        EnrollmentRepository enrollmentRepository,
        EnrollmentMapper enrollmentMapper,
        UserProfileRepository userProfileRepository,
        BookRepository bookRepository
    ) {
        this.enrollmentRepository = enrollmentRepository;
        this.enrollmentMapper = enrollmentMapper;
        this.userProfileRepository = userProfileRepository;
        this.bookRepository = bookRepository;
    }

    /**
     * Save a enrollment.
     *
     * @param enrollmentDTO the entity to save.
     * @return the persisted entity.
     */
    public EnrollmentDTO save(EnrollmentDTO enrollmentDTO) {
        LOG.debug("Request to save Enrollment : {}", enrollmentDTO);
        Enrollment enrollment = enrollmentMapper.toEntity(enrollmentDTO);
        enrollment = enrollmentRepository.save(enrollment);
        return enrollmentMapper.toDto(enrollment);
    }

    /**
     * Enroll current user in a book.
     *
     * @param bookId the id of the book.
     * @return the persisted entity.
     */
    public EnrollmentDTO enrollInBook(Long bookId) {
        LOG.debug("Request to enroll current user in Book : {}", bookId);

        // 1. Get current user profile
        UserProfile userProfile = userProfileRepository
            .findOneByUserIsCurrentUser()
            .orElseThrow(() -> new RuntimeException("Current user profile not found"));

        // 2. Check if already enrolled
        Optional<Enrollment> existingEnrollment = enrollmentRepository.findOneByUserIsCurrentUserAndBookId(bookId);
        if (existingEnrollment.isPresent()) {
            return enrollmentMapper.toDto(existingEnrollment.orElseThrow());
        }

        // 3. Get book
        Book book = bookRepository.findById(bookId).orElseThrow(() -> new RuntimeException("Book not found"));

        // 4. Create new enrollment
        Enrollment enrollment = new Enrollment();
        enrollment.setUserProfile(userProfile);
        enrollment.setBook(book);
        enrollment.setEnrolledAt(Instant.now());
        enrollment.setStatus(EnrollmentStatus.ACTIVE);

        enrollment = enrollmentRepository.save(enrollment);
        return enrollmentMapper.toDto(enrollment);
    }

    /**
     * Update a enrollment.
     *
     * @param enrollmentDTO the entity to save.
     * @return the persisted entity.
     */
    public EnrollmentDTO update(EnrollmentDTO enrollmentDTO) {
        LOG.debug("Request to update Enrollment : {}", enrollmentDTO);
        Enrollment enrollment = enrollmentMapper.toEntity(enrollmentDTO);
        enrollment = enrollmentRepository.save(enrollment);
        return enrollmentMapper.toDto(enrollment);
    }

    /**
     * Partially update a enrollment.
     *
     * @param enrollmentDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<EnrollmentDTO> partialUpdate(EnrollmentDTO enrollmentDTO) {
        LOG.debug("Request to partially update Enrollment : {}", enrollmentDTO);

        return enrollmentRepository
            .findById(enrollmentDTO.getId())
            .map(existingEnrollment -> {
                enrollmentMapper.partialUpdate(existingEnrollment, enrollmentDTO);

                return existingEnrollment;
            })
            .map(enrollmentRepository::save)
            .map(enrollmentMapper::toDto);
    }

    /**
     * Get all the enrollments.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<EnrollmentDTO> findAll() {
        LOG.debug("Request to get all Enrollments");
        return enrollmentRepository.findAll().stream().map(enrollmentMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get all the enrollments for the current user.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<EnrollmentDTO> findAllByCurrentUser() {
        LOG.debug("Request to get all Enrollments for current user");
        return enrollmentRepository
            .findByUserIsCurrentUser()
            .stream()
            .map(enrollmentMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one enrollment by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<EnrollmentDTO> findOne(Long id) {
        LOG.debug("Request to get Enrollment : {}", id);
        return enrollmentRepository.findById(id).map(enrollmentMapper::toDto);
    }

    /**
     * Get one enrollment by current user and book id.
     *
     * @param bookId the id of the book.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<EnrollmentDTO> findOneByCurrentUserAndBookId(Long bookId) {
        LOG.debug("Request to get Enrollment for current user and book : {}", bookId);
        return enrollmentRepository.findOneByUserIsCurrentUserAndBookId(bookId).map(enrollmentMapper::toDto);
    }

    /**
     * Count all enrollments.
     *
     * @return the count of entities.
     */
    @Transactional(readOnly = true)
    public long countAll() {
        LOG.debug("Request to count all Enrollments");
        return enrollmentRepository.count();
    }

    /**
     * Delete the enrollment by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Enrollment : {}", id);
        enrollmentRepository.deleteById(id);
    }
}
