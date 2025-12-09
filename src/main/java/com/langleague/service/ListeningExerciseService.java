package com.langleague.service;

import com.langleague.domain.ListeningExercise;
import com.langleague.repository.ListeningExerciseRepository;
import com.langleague.service.dto.ListeningExerciseDTO;
import com.langleague.service.mapper.ListeningExerciseMapper;
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
 * Service Implementation for managing {@link com.langleague.domain.ListeningExercise}.
 */
@Service
@Transactional
public class ListeningExerciseService {

    private static final Logger LOG = LoggerFactory.getLogger(ListeningExerciseService.class);

    private final ListeningExerciseRepository listeningExerciseRepository;

    private final ListeningExerciseMapper listeningExerciseMapper;

    public ListeningExerciseService(
        ListeningExerciseRepository listeningExerciseRepository,
        ListeningExerciseMapper listeningExerciseMapper
    ) {
        this.listeningExerciseRepository = listeningExerciseRepository;
        this.listeningExerciseMapper = listeningExerciseMapper;
    }

    /**
     * Save a listeningExercise.
     *
     * @param listeningExerciseDTO the entity to save.
     * @return the persisted entity.
     */
    public ListeningExerciseDTO save(ListeningExerciseDTO listeningExerciseDTO) {
        LOG.debug("Request to save ListeningExercise : {}", listeningExerciseDTO);
        ListeningExercise listeningExercise = listeningExerciseMapper.toEntity(listeningExerciseDTO);
        listeningExercise = listeningExerciseRepository.save(listeningExercise);
        return listeningExerciseMapper.toDto(listeningExercise);
    }

    /**
     * Update a listeningExercise.
     *
     * @param listeningExerciseDTO the entity to save.
     * @return the persisted entity.
     */
    public ListeningExerciseDTO update(ListeningExerciseDTO listeningExerciseDTO) {
        LOG.debug("Request to update ListeningExercise : {}", listeningExerciseDTO);
        ListeningExercise listeningExercise = listeningExerciseMapper.toEntity(listeningExerciseDTO);
        listeningExercise = listeningExerciseRepository.save(listeningExercise);
        return listeningExerciseMapper.toDto(listeningExercise);
    }

    /**
     * Partially update a listeningExercise.
     *
     * @param listeningExerciseDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ListeningExerciseDTO> partialUpdate(ListeningExerciseDTO listeningExerciseDTO) {
        LOG.debug("Request to partially update ListeningExercise : {}", listeningExerciseDTO);

        return listeningExerciseRepository
            .findById(listeningExerciseDTO.getId())
            .map(existingListeningExercise -> {
                listeningExerciseMapper.partialUpdate(existingListeningExercise, listeningExerciseDTO);

                return existingListeningExercise;
            })
            .map(listeningExerciseRepository::save)
            .map(listeningExerciseMapper::toDto);
    }

    /**
     * Get all the listeningExercises.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ListeningExerciseDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all ListeningExercises");
        return listeningExerciseRepository.findAll(pageable).map(listeningExerciseMapper::toDto);
    }

    /**
     * Get one listeningExercise by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ListeningExerciseDTO> findOne(Long id) {
        LOG.debug("Request to get ListeningExercise : {}", id);
        return listeningExerciseRepository.findById(id).map(listeningExerciseMapper::toDto);
    }

    /**
     * Delete the listeningExercise by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete ListeningExercise : {}", id);
        listeningExerciseRepository.deleteById(id);
    }

    /**
     * Get all listening exercises by chapter ID.
     *
     * @param chapterId the chapter ID
     * @return list of listening exercises
     */
    @Transactional(readOnly = true)
    public List<ListeningExerciseDTO> findByChapterId(Long chapterId) {
        LOG.debug("Request to get ListeningExercises by chapter : {}", chapterId);
        return listeningExerciseRepository
            .findByChapterId(chapterId)
            .stream()
            .map(listeningExerciseMapper::toDto)
            .collect(Collectors.toList());
    }
}
