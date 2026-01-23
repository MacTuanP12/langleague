package com.langleague.app.service;

import com.langleague.app.domain.Note;
import com.langleague.app.domain.UserProfile;
import com.langleague.app.repository.NoteRepository;
import com.langleague.app.repository.UserProfileRepository;
import com.langleague.app.repository.UserRepository;
import com.langleague.app.security.SecurityUtils;
import com.langleague.app.service.dto.NoteDTO;
import com.langleague.app.service.mapper.NoteMapper;
import com.langleague.app.web.rest.errors.BadRequestAlertException;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.langleague.app.domain.Note}.
 */
@Service
@Transactional
public class NoteService {

    private final Logger log = LoggerFactory.getLogger(NoteService.class);

    private final NoteRepository noteRepository;

    private final NoteMapper noteMapper;

    private final UserRepository userRepository;

    private final UserProfileRepository userProfileRepository;

    public NoteService(
        NoteRepository noteRepository,
        NoteMapper noteMapper,
        UserRepository userRepository,
        UserProfileRepository userProfileRepository
    ) {
        this.noteRepository = noteRepository;
        this.noteMapper = noteMapper;
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
    }

    /**
     * Get current user's profile.
     * @return Optional<UserProfile>
     */
    private Optional<UserProfile> getCurrentUserProfile() {
        return SecurityUtils.getCurrentUserLogin()
            .flatMap(userRepository::findOneByLogin)
            .map(user -> {
                UserProfile probe = new UserProfile();
                probe.setUser(user);
                return userProfileRepository.findOne(Example.of(probe)).orElse(null);
            });
    }

    /**
     * Verify that the current user owns the note.
     * @param noteId the note id
     * @throws BadRequestAlertException if user doesn't own the note
     */
    private void verifyOwnership(Long noteId) {
        UserProfile currentUserProfile = getCurrentUserProfile()
            .orElseThrow(() -> new BadRequestAlertException("User profile not found", "note", "userprofilenotfound"));

        Note note = noteRepository
            .findById(noteId)
            .orElseThrow(() -> new BadRequestAlertException("Note not found", "note", "notenotfound"));

        if (!note.getUserProfile().getId().equals(currentUserProfile.getId())) {
            throw new BadRequestAlertException("Access denied: You don't own this note", "note", "accessdenied");
        }
    }

    /**
     * Save a note.
     * BUSINESS RULE: 1 student can only have 1 note per unit.
     * This method now handles create and update logic separately.
     *
     * @param noteDTO the entity to save.
     * @return the persisted entity.
     */
    public NoteDTO save(NoteDTO noteDTO) {
        log.debug("Request to save Note : {}", noteDTO);

        UserProfile currentUserProfile = getCurrentUserProfile()
            .orElseThrow(() -> new BadRequestAlertException("User profile not found", "note", "userprofilenotfound"));

        // CREATE logic
        if (noteDTO.getId() == null) {
            // Check if a note already exists for this user and unit
            List<Note> existingNotes = noteRepository.findAllByUserProfileIdAndUnitId(currentUserProfile.getId(), noteDTO.getUnitId());

            if (!existingNotes.isEmpty()) {
                // Instead of throwing an error, update the existing note with the new content
                Note existingNote = existingNotes.get(0);
                log.warn(
                    "Duplicate note creation attempt detected for user {} and unit {}. Updating existing note ID: {}",
                    currentUserProfile.getId(),
                    noteDTO.getUnitId(),
                    existingNote.getId()
                );

                // Update the existing note with new content
                existingNote.setContent(noteDTO.getContent());
                existingNote.setUpdatedAt(Instant.now());
                existingNote = noteRepository.save(existingNote);
                return noteMapper.toDto(existingNote);
            }

            // Set creation-specific fields for new note
            noteDTO.setUserProfileId(currentUserProfile.getId());
            noteDTO.setCreatedAt(Instant.now());
        }
        // UPDATE logic
        else {
            // For updates, we must verify ownership to prevent IDOR attacks
            verifyOwnership(noteDTO.getId());
            noteDTO.setUpdatedAt(Instant.now());
        }

        Note note = noteMapper.toEntity(noteDTO);
        note = noteRepository.save(note);
        return noteMapper.toDto(note);
    }

    /**
     * Update a note.
     *
     * @param noteDTO the entity to save.
     * @return the persisted entity.
     */
    public NoteDTO update(NoteDTO noteDTO) {
        log.debug("Request to update Note : {}", noteDTO);

        // This method is now a simple wrapper around save() for clarity in the Resource layer.
        // All logic is centralized in the save() method.
        return save(noteDTO);
    }

    /**
     * Partially update a note.
     *
     * @param noteDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<NoteDTO> partialUpdate(NoteDTO noteDTO) {
        log.debug("Request to partially update Note : {}", noteDTO);

        // Verify ownership before update
        verifyOwnership(noteDTO.getId());

        return noteRepository
            .findById(noteDTO.getId())
            .map(existingNote -> {
                noteMapper.partialUpdate(existingNote, noteDTO);
                existingNote.setUpdatedAt(Instant.now());

                return existingNote;
            })
            .map(noteRepository::save)
            .map(noteMapper::toDto);
    }

    /**
     * Get all the notes.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<NoteDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Notes");
        return noteRepository.findAll(pageable).map(noteMapper::toDto);
    }

    /**
     * Get one note by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<NoteDTO> findOne(Long id) {
        log.debug("Request to get Note : {}", id);

        // Verify ownership before returning
        verifyOwnership(id);

        return noteRepository.findById(id).map(noteMapper::toDto);
    }

    /**
     * Get all notes by user profile and unit.
     *
     * @param userProfileId the id of the user profile.
     * @param unitId the id of the unit.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<NoteDTO> findAllByUserAndUnit(Long userProfileId, Long unitId) {
        log.debug("Request to get Notes for UserProfile : {} and Unit : {}", userProfileId, unitId);
        return noteRepository
            .findAllByUserProfileIdAndUnitId(userProfileId, unitId)
            .stream()
            .map(noteMapper::toDto)
            .collect(Collectors.toList());
    }

    /**
     * Get all notes for the current user.
     *
     * @param pageable the pagination information.
     * @return the page of entities.
     */
    @Transactional(readOnly = true)
    public Page<NoteDTO> findAllByCurrentUser(Pageable pageable) {
        log.debug("Request to get all Notes for current user");
        return SecurityUtils.getCurrentUserLogin()
            .flatMap(userRepository::findOneByLogin)
            .flatMap(user -> {
                UserProfile probe = new UserProfile();
                probe.setUser(user);
                return userProfileRepository.findOne(Example.of(probe));
            })
            .map(profile -> noteRepository.findAllByUserProfileId(profile.getId(), pageable).map(noteMapper::toDto))
            .orElse(Page.empty(pageable));
    }

    /**
     * Get all notes for the current user and unit.
     *
     * @param unitId the id of the unit.
     * @param pageable the pagination information.
     * @return the page of entities.
     */
    @Transactional(readOnly = true)
    public Page<NoteDTO> findAllByCurrentUserAndUnit(Long unitId, Pageable pageable) {
        log.debug("Request to get all Notes for current user and unit : {}", unitId);
        return SecurityUtils.getCurrentUserLogin()
            .flatMap(userRepository::findOneByLogin)
            .flatMap(user -> {
                UserProfile probe = new UserProfile();
                probe.setUser(user);
                return userProfileRepository.findOne(Example.of(probe));
            })
            .map(profile -> noteRepository.findAllByUserProfileIdAndUnitId(profile.getId(), unitId, pageable).map(noteMapper::toDto))
            .orElse(Page.empty(pageable));
    }

    /**
     * Delete the note by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Note : {}", id);

        // Verify ownership before delete
        verifyOwnership(id);

        noteRepository.deleteById(id);
    }

    /**
     * Check if current user has a note for the given unit.
     *
     * @param unitId the unit id
     * @return true if note exists, false otherwise
     */
    @Transactional(readOnly = true)
    public boolean hasNoteForUnit(Long unitId) {
        log.debug("Request to check if current user has note for unit : {}", unitId);

        return getCurrentUserProfile()
            .map(profile -> !noteRepository.findAllByUserProfileIdAndUnitId(profile.getId(), unitId).isEmpty())
            .orElse(false);
    }

    /**
     * Get note for current user and unit (if exists).
     *
     * @param unitId the unit id
     * @return Optional<NoteDTO>
     */
    @Transactional(readOnly = true)
    public Optional<NoteDTO> findNoteByCurrentUserAndUnit(Long unitId) {
        log.debug("Request to get note for current user and unit : {}", unitId);

        return getCurrentUserProfile()
            .flatMap(profile -> {
                List<Note> notes = noteRepository.findAllByUserProfileIdAndUnitId(profile.getId(), unitId);
                return notes.isEmpty() ? Optional.empty() : Optional.of(noteMapper.toDto(notes.get(0)));
            });
    }
}
