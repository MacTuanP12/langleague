package com.langleague.service;

import com.langleague.domain.AppUser;
import com.langleague.domain.User;
import com.langleague.repository.AppUserRepository;
import com.langleague.repository.UserRepository;
import com.langleague.service.dto.AppUserDTO;
import com.langleague.service.mapper.AppUserMapper;
import java.util.List;
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

    public AppUser createAppUserForNewUser(User user) {
        LOG.debug("Creating AppUser for new User: {}", user.getLogin());
        try {
            AppUser appUser = new AppUser();
            appUser.setInternalUser(user);
            appUser.setDisplayName(user.getFirstName() + " " + user.getLastName());
            appUser.setBio("Hello, I'm new here!");
            appUser = appUserRepository.save(appUser);
            LOG.info("Created new AppUser (id={} login={})", appUser.getId(), user.getLogin());
            return appUser;
        } catch (DataIntegrityViolationException e) {
            LOG.warn("AppUser already exists for user {} (caught DataIntegrityViolation), fetching existing", user.getLogin());
            return appUserRepository
                .findByUser_Login(user.getLogin())
                .orElseThrow(() -> new RuntimeException("Failed to create or fetch AppUser for login: " + user.getLogin()));
        }
    }

    public AppUserDTO save(AppUserDTO appUserDTO) {
        LOG.debug("Request to save AppUser : {}", appUserDTO);
        AppUser appUser = appUserMapper.toEntity(appUserDTO);
        if (appUserDTO.getInternalUser() != null) {
            User user;
            if (appUserDTO.getInternalUser().getId() != null) {
                user = userRepository
                    .findById(appUserDTO.getInternalUser().getId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + appUserDTO.getInternalUser().getId()));
            } else if (appUserDTO.getInternalUser().getLogin() != null) {
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

    @CacheEvict(
        value = "appUserByLogin",
        key = "#appUserDTO.internalUser != null ? #appUserDTO.internalUser.login : ''",
        condition = "#appUserDTO.internalUser != null"
    )
    public AppUserDTO update(AppUserDTO appUserDTO) {
        LOG.debug("Request to update AppUser : {}", appUserDTO);
        AppUser existingAppUser = appUserRepository
            .findById(appUserDTO.getId())
            .orElseThrow(() -> new IllegalArgumentException("AppUser not found with id: " + appUserDTO.getId()));
        appUserMapper.partialUpdate(existingAppUser, appUserDTO);
        existingAppUser = appUserRepository.save(existingAppUser);
        return appUserMapper.toDto(existingAppUser);
    }

    @CacheEvict(value = "appUserByLogin", allEntries = true)
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

    @Transactional(readOnly = true)
    public Page<AppUserDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all AppUsers");
        return appUserRepository.findAll(pageable).map(appUserMapper::toDto);
    }

    @Transactional(readOnly = true)
    public List<AppUser> findAllByUserLoginIn(List<String> logins) {
        LOG.debug("Request to get all AppUsers by logins: {}", logins);
        return appUserRepository.findAllByUser_LoginIn(logins);
    }

    @Transactional(readOnly = true)
    public Optional<AppUserDTO> findOne(Long id) {
        LOG.debug("Request to get AppUser : {}", id);
        return appUserRepository.findById(id).map(appUserMapper::toDto);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "appUserByLogin", key = "#login", unless = "#result == null")
    public Optional<AppUser> findByUserLogin(String login) {
        LOG.debug("Request to get AppUser by user login : {}", login);
        return appUserRepository.findByUser_Login(login);
    }

    @CacheEvict(value = "appUserByLogin", allEntries = true)
    public void delete(Long id) {
        LOG.debug("Request to delete AppUser : {}", id);
        appUserRepository.deleteById(id);
    }

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
