package com.langleague.service;

import com.langleague.domain.AppUser;
import com.langleague.domain.User;
import com.langleague.repository.AppUserRepository;
import com.langleague.repository.UserRepository;
import com.langleague.service.dto.AppUserDTO;
import com.langleague.service.mapper.AppUserMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.langleague.domain.AppUser}.
 */
@Service
@Transactional
public class AppUserService {

    private static final Logger LOG = LoggerFactory.getLogger(AppUserService.class);

    private final AppUserRepository appUserRepository;

    private final AppUserMapper appUserMapper;

    private final UserRepository userRepository;

    public AppUserService(AppUserRepository appUserRepository, AppUserMapper appUserMapper, UserRepository userRepository) {
        this.appUserRepository = appUserRepository;
        this.appUserMapper = appUserMapper;
        this.userRepository = userRepository;
    }

    /**
     * Create AppUser for new User with race condition protection.
     * FIXED: Uses database unique constraint instead of synchronized block
     * to support multi-instance deployments (cluster-safe).
     */
    public AppUser createAppUserForNewUser(User user) {
        LOG.debug("Creating AppUser for new User: {}", user.getLogin());

        try {
            // Try to create directly, rely on DB unique constraint on user_id
            AppUser appUser = new AppUser();
            appUser.setInternalUser(user);
            appUser.setDisplayName(user.getFirstName() + " " + user.getLastName());
            appUser.setBio("Hello, I'm new here!");
            appUser = appUserRepository.save(appUser);
            LOG.info("Created new AppUser (id={} login={})", appUser.getId(), user.getLogin());
            return appUser;
        } catch (DataIntegrityViolationException e) {
            // Another thread/instance already created this AppUser, fetch and return
            LOG.warn("AppUser already exists for user {} (caught DataIntegrityViolation), fetching existing", user.getLogin());
            return appUserRepository
                .findByUser_Login(user.getLogin())
                .orElseThrow(() -> new RuntimeException("Failed to create or fetch AppUser for login: " + user.getLogin()));
        }
    }

    /**
     * Save a appUser.
     *
     * @param appUserDTO the entity to save.
     * @return the persisted entity.
     */
    public AppUserDTO save(AppUserDTO appUserDTO) {
        LOG.debug("Request to save AppUser : {}", appUserDTO);
        AppUser appUser = appUserMapper.toEntity(appUserDTO);

        // Handle the case where internalUser is provided with login instead of ID
        if (appUserDTO.getInternalUser() != null) {
            User user = null;

            // Try to find by ID first
            if (appUserDTO.getInternalUser().getId() != null) {
                user = userRepository
                    .findById(appUserDTO.getInternalUser().getId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + appUserDTO.getInternalUser().getId()));
            }
            // If ID not provided, try to find by login
            else if (appUserDTO.getInternalUser().getLogin() != null) {
                user = userRepository
                    .findOneByLogin(appUserDTO.getInternalUser().getLogin())
                    .orElseThrow(() ->
                        new IllegalArgumentException("User not found with login: " + appUserDTO.getInternalUser().getLogin())
                    );
            } else {
                throw new IllegalArgumentException("Either user ID or login must be provided");
            }

            appUser.setInternalUser(user);
        }

        appUser = appUserRepository.save(appUser);
        return appUserMapper.toDto(appUser);
    }

    /**
     * Update a appUser.
     *
     * @param appUserDTO the entity to save.
     * @return the persisted entity.
     */
    @CacheEvict(
        value = "appUserByLogin",
        key = "#appUserDTO.internalUser != null ? #appUserDTO.internalUser.login : ''",
        condition = "#appUserDTO.internalUser != null"
    )
    public AppUserDTO update(AppUserDTO appUserDTO) {
        LOG.debug("Request to update AppUser : {}", appUserDTO);

        // Fetch existing entity to preserve version and other managed fields
        AppUser existingAppUser = appUserRepository
            .findById(appUserDTO.getId())
            .orElseThrow(() -> new IllegalArgumentException("AppUser not found with id: " + appUserDTO.getId()));

        // Update fields from DTO
        appUserMapper.partialUpdate(existingAppUser, appUserDTO);

        existingAppUser = appUserRepository.save(existingAppUser);
        return appUserMapper.toDto(existingAppUser);
    }

    /**
     * Partially update a appUser.
     *
     * @param appUserDTO the entity to update partially.
     * @return the persisted entity.
     */
    @CacheEvict(value = "appUserByLogin", allEntries = true) // Safer to evict all on partial update
    public Optional<AppUserDTO> partialUpdate(AppUserDTO appUserDTO) {
        LOG.debug("Request to partially update AppUser : {}", appUserDTO);

        return appUserRepository
            .findById(appUserDTO.getId())
            .map(existingAppUser -> {
                appUserMapper.partialUpdate(existingAppUser, appUserDTO);

                return existingAppUser;
            })
            .map(appUserRepository::save)
            .map(appUserMapper::toDto);
    }

    /**
     * Get all the appUsers.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<AppUserDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all AppUsers");
        return appUserRepository.findAll(pageable).map(appUserMapper::toDto);
    }

    /**
     * Get one appUser by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<AppUserDTO> findOne(Long id) {
        LOG.debug("Request to get AppUser : {}", id);
        return appUserRepository.findById(id).map(appUserMapper::toDto);
    }

    /**
     * Get one AppUser by user login.
     *
     * @param login user login.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    @Cacheable(value = "appUserByLogin", key = "#login", unless = "#result == null")
    public Optional<AppUserDTO> findByUserLogin(String login) {
        LOG.debug("Request to get AppUser by user login : {}", login);
        return appUserRepository.findByUser_Login(login).map(appUserMapper::toDto);
    }

    /**
     * Delete the appUser by id.
     *
     * @param id the id of the entity.
     */
    @CacheEvict(value = "appUserByLogin", allEntries = true)
    public void delete(Long id) {
        LOG.debug("Request to delete AppUser : {}", id);
        appUserRepository.deleteById(id);
    }

    /**
     * Use case 10: Edit profile
     * Update personal information (displayName, bio)
     *
     * @param login user login
     * @param displayName display name
     * @param bio biography
     * @return updated AppUser
     */
    @CacheEvict(value = "appUserByLogin", key = "#login")
    public Optional<AppUser> updateProfile(String login, String displayName, String bio) {
        LOG.debug("Request to update profile for user : {}", login);
        return appUserRepository
            .findByUser_Login(login)
            .map(appUser -> {
                if (displayName != null) appUser.setDisplayName(displayName);
                if (bio != null) appUser.setBio(bio);
                return appUserRepository.save(appUser);
            });
    }
}
