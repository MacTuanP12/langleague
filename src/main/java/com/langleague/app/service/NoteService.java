package com.langleague.app.service;

import com.langleague.app.domain.Note;
import com.langleague.app.domain.UserProfile;
import com.langleague.app.repository.NoteRepository;
import com.langleague.app.repository.UserProfileRepository;
import com.langleague.app.repository.UserRepository;
import com.langleague.app.security.SecurityUtils;
import com.langleague.app.service.dto.NoteDTO;
import com.langleague.app.service.mapper.NoteMapper;
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
     * Save a note.
     *
     * @param noteDTO the entity to save.
     * @return the persisted entity.
     */
    public NoteDTO save(NoteDTO noteDTO) {
        log.debug("Request to save Note : {}", noteDTO);
        if (noteDTO.getCreatedAt() == null) {
            noteDTO.setCreatedAt(Instant.now());
        }

        // Auto-assign UserProfile if missing (matches Frontend expectation)
        if (noteDTO.getUserProfileId() == null) {
            SecurityUtils.getCurrentUserLogin()
                .flatMap(userRepository::findOneByLogin)
                .ifPresent(user -> {
                    UserProfile probe = new UserProfile();
                    probe.setUser(user);
                    userProfileRepository.findOne(Example.of(probe)).ifPresent(profile -> noteDTO.setUserProfileId(profile.getId()));
                });
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
        noteDTO.setUpdatedAt(Instant.now());
        Note note = noteMapper.toEntity(noteDTO);
        note = noteRepository.save(note);
        return noteMapper.toDto(note);
    }

    /**
     * Partially update a note.
     *
     * @param noteDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<NoteDTO> partialUpdate(NoteDTO noteDTO) {
        log.debug("Request to partially update Note : {}", noteDTO);

        return noteRepository
            .findById(noteDTO.getId())
            .map(existingNote -> {
                noteMapper.partialUpdate(existingNote, noteDTO);

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
     * Delete the note by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Note : {}", id);
        noteRepository.deleteById(id);
    }
}
