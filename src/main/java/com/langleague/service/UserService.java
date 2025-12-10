package com.langleague.service;

import com.langleague.config.Constants;
import com.langleague.domain.Authority;
import com.langleague.domain.User;
import com.langleague.repository.AuthorityRepository;
import com.langleague.repository.UserRepository;
import com.langleague.security.AuthoritiesConstants;
import com.langleague.security.SecurityUtils;
import com.langleague.service.dto.AdminUserDTO;
import com.langleague.service.dto.UserDTO;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.CacheManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import tech.jhipster.security.RandomUtil;

/**
 * Service class for managing users.
 */
@Service
@Transactional
public class UserService {

    private static final Logger LOG = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthorityRepository authorityRepository;

    private final CacheManager cacheManager;

    private final AppUserService appUserService;

    private final FileStorageService fileStorageService;

    public UserService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        AuthorityRepository authorityRepository,
        CacheManager cacheManager,
        AppUserService appUserService,
        FileStorageService fileStorageService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authorityRepository = authorityRepository;
        this.cacheManager = cacheManager;
        this.appUserService = appUserService;
        this.fileStorageService = fileStorageService;
    }

    public Optional<User> activateRegistration(String key) {
        LOG.debug("Activating user for activation key {}", key);
        return userRepository
            .findOneByActivationKey(key)
            .map(user -> {
                // activate given user for the registration key.
                user.setActivated(true);
                user.setActivationKey(null);
                this.clearUserCaches(user);
                LOG.debug("Activated user: {}", user);
                return user;
            });
    }

    public Optional<User> completePasswordReset(String newPassword, String key) {
        LOG.debug("Reset user password for reset key {}", key);
        return userRepository
            .findOneByResetKey(key)
            .filter(user -> user.getResetDate().isAfter(Instant.now().minus(1, ChronoUnit.DAYS)))
            .map(user -> {
                user.setPassword(passwordEncoder.encode(newPassword));
                user.setResetKey(null);
                user.setResetDate(null);
                this.clearUserCaches(user);
                return user;
            });
    }

    public Optional<User> requestPasswordReset(String mail) {
        return userRepository
            .findOneByEmailIgnoreCase(mail)
            .filter(User::isActivated)
            .map(user -> {
                user.setResetKey(RandomUtil.generateResetKey());
                user.setResetDate(Instant.now());
                this.clearUserCaches(user);
                return user;
            });
    }

    public User registerUser(AdminUserDTO userDTO, String password) {
        userRepository
            .findOneByLogin(userDTO.getLogin().toLowerCase())
            .ifPresent(existingUser -> {
                boolean removed = removeNonActivatedUser(existingUser);
                if (!removed) {
                    throw new UsernameAlreadyUsedException();
                }
            });
        userRepository
            .findOneByEmailIgnoreCase(userDTO.getEmail())
            .ifPresent(existingUser -> {
                boolean removed = removeNonActivatedUser(existingUser);
                if (!removed) {
                    throw new EmailAlreadyUsedException();
                }
            });
        User newUser = new User();
        String encryptedPassword = passwordEncoder.encode(password);
        newUser.setLogin(userDTO.getLogin().toLowerCase());
        // new user gets initially a generated password
        newUser.setPassword(encryptedPassword);
        newUser.setFirstName(userDTO.getFirstName());
        newUser.setLastName(userDTO.getLastName());
        if (userDTO.getEmail() != null) {
            newUser.setEmail(userDTO.getEmail().toLowerCase());
        }
        newUser.setImageUrl(userDTO.getImageUrl());
        newUser.setLangKey(userDTO.getLangKey());
        // new user is not active
        newUser.setActivated(false);
        // new user gets registration key
        newUser.setActivationKey(RandomUtil.generateActivationKey());
        Set<Authority> authorities = new HashSet<>();
        authorityRepository.findById(AuthoritiesConstants.USER).ifPresent(authorities::add);
        newUser.setAuthorities(authorities);
        userRepository.save(newUser);
        this.clearUserCaches(newUser);
        LOG.debug("Created Information for User: {}", newUser);

        // CRITICAL FIX: Create AppUser within same transaction
        // If AppUser creation fails, entire transaction rolls back (both User and AppUser)
        // This prevents data inconsistency where User exists but AppUser is missing
        appUserService.createAppUserForNewUser(newUser);
        LOG.info("AppUser created successfully for new registration: {}", newUser.getLogin());

        return newUser;
    }

    private boolean removeNonActivatedUser(User existingUser) {
        if (existingUser.isActivated()) {
            return false;
        }
        userRepository.delete(existingUser);
        userRepository.flush();
        this.clearUserCaches(existingUser);
        return true;
    }

    public User createUser(AdminUserDTO userDTO) {
        User user = new User();
        user.setLogin(userDTO.getLogin().toLowerCase());
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        if (userDTO.getEmail() != null) {
            user.setEmail(userDTO.getEmail().toLowerCase());
        }
        user.setImageUrl(userDTO.getImageUrl());
        if (userDTO.getLangKey() == null) {
            user.setLangKey(Constants.DEFAULT_LANGUAGE); // default language
        } else {
            user.setLangKey(userDTO.getLangKey());
        }
        String encryptedPassword = passwordEncoder.encode(RandomUtil.generatePassword());
        user.setPassword(encryptedPassword);
        user.setResetKey(RandomUtil.generateResetKey());
        user.setResetDate(Instant.now());
        user.setActivated(true);
        if (userDTO.getAuthorities() != null) {
            Set<Authority> authorities = userDTO
                .getAuthorities()
                .stream()
                .map(authorityRepository::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toSet());
            user.setAuthorities(authorities);
        }
        userRepository.save(user);
        this.clearUserCaches(user);
        LOG.debug("Created Information for User: {}", user);

        // ✅ FIX: Tạo AppUser tương ứng cho user mới (admin created)
        try {
            appUserService.createAppUserForNewUser(user);
            LOG.info("AppUser created successfully for admin-created user: {}", user.getLogin());
        } catch (Exception e) {
            LOG.error("Failed to create AppUser for admin-created user: {}", user.getLogin(), e);
        }

        return user;
    }

    /**
     * Update all information for a specific user, and return the modified user.
     *
     * @param userDTO user to update.
     * @return updated user.
     */
    public Optional<AdminUserDTO> updateUser(AdminUserDTO userDTO) {
        return Optional.of(userRepository.findById(userDTO.getId()))
            .filter(Optional::isPresent)
            .map(Optional::get)
            .map(user -> {
                this.clearUserCaches(user);
                user.setLogin(userDTO.getLogin().toLowerCase());
                user.setFirstName(userDTO.getFirstName());
                user.setLastName(userDTO.getLastName());
                if (userDTO.getEmail() != null) {
                    user.setEmail(userDTO.getEmail().toLowerCase());
                }
                user.setImageUrl(userDTO.getImageUrl());
                user.setActivated(userDTO.isActivated());
                user.setLocked(userDTO.isLocked());
                user.setLangKey(userDTO.getLangKey());
                Set<Authority> managedAuthorities = user.getAuthorities();
                managedAuthorities.clear();
                // Batch load authorities instead of N queries
                Set<Authority> authorities = authorityRepository.findByNameIn(userDTO.getAuthorities());
                managedAuthorities.addAll(authorities);
                userRepository.save(user);
                this.clearUserCaches(user);
                LOG.debug("Changed Information for User: {}", user);
                return user;
            })
            .map(AdminUserDTO::new);
    }

    public void deleteUser(String login) {
        userRepository
            .findOneByLogin(login)
            .ifPresent(user -> {
                // First delete associated AppUser if exists
                appUserService
                    .findByUserLogin(login)
                    .ifPresent(appUser -> {
                        LOG.debug("Deleting associated AppUser for user: {}", login);
                        appUserService.delete(appUser.getId());
                    });

                // Then delete the user
                userRepository.delete(user);
                this.clearUserCaches(user);
                LOG.debug("Deleted User: {}", user);
            });
    }

    /**
     * Update basic information (first name, last name, email, language) for the current user.
     *
     * @param firstName first name of user.
     * @param lastName  last name of user.
     * @param email     email id of user.
     * @param langKey   language key.
     * @param imageUrl  image URL of user.
     */
    public void updateUser(String firstName, String lastName, String email, String langKey, String imageUrl) {
        SecurityUtils.getCurrentUserLogin()
            .flatMap(userRepository::findOneByLogin)
            .ifPresent(user -> {
                user.setFirstName(firstName);
                user.setLastName(lastName);
                if (email != null) {
                    user.setEmail(email.toLowerCase());
                }
                user.setLangKey(langKey);
                user.setImageUrl(imageUrl);
                userRepository.save(user);
                this.clearUserCaches(user);
                LOG.debug("Changed Information for User: {}", user);

                //  Đồng bộ displayName trong AppUser khi update firstName/lastName
                if (firstName != null || lastName != null) {
                    String newDisplayName = (firstName != null ? firstName : "") + " " + (lastName != null ? lastName : "");
                    appUserService.updateProfile(user.getLogin(), newDisplayName.trim(), null);
                    LOG.debug("Updated AppUser displayName for user: {}", user.getLogin());
                }
            });
    }

    /**
     * Update user's image URL (avatar).
     *
     * PERFORMANCE FIX: No longer accepts base64 data URIs
     * Use uploadUserAvatar() to upload image files instead
     *
     * @param login user login
     * @param imageUrl new image URL (file path or HTTP URL, NOT base64)
     * @throws IllegalArgumentException if base64 data URI is provided
     */
    @Transactional
    public void updateUserImageUrl(String login, String imageUrl) {
        // PERFORMANCE FIX: Reject base64 images
        if (imageUrl != null && imageUrl.startsWith("data:image/")) {
            throw new IllegalArgumentException(
                "Base64 images are no longer supported. Please upload the image file using uploadUserAvatar() instead."
            );
        }

        userRepository
            .findOneByLogin(login)
            .ifPresent(user -> {
                user.setImageUrl(imageUrl);
                userRepository.save(user);
                this.clearUserCaches(user);
                LOG.debug("Updated imageUrl for user: {}", login);
            });
    }

    /**
     * Upload user avatar image file
     *
     * PERFORMANCE FIX: Replaces base64 image storage with file-based storage
     * This prevents database bloat and improves query performance
     *
     * @param login user login
     * @param avatarFile the avatar image file
     * @return the file URL path
     * @throws Exception if upload fails
     */
    @Transactional
    public String uploadUserAvatar(String login, MultipartFile avatarFile) throws Exception {
        LOG.debug("Uploading avatar for user: {}", login);

        // Validate file
        if (avatarFile == null || avatarFile.isEmpty()) {
            throw new IllegalArgumentException("Avatar file is required");
        }

        // Validate file type
        String contentType = avatarFile.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("File must be an image (png, jpg, jpeg, gif, webp)");
        }

        // Validate file size (max 5MB)
        long maxSize = 5 * 1024 * 1024; // 5MB
        if (avatarFile.getSize() > maxSize) {
            throw new IllegalArgumentException("Avatar file size must not exceed 5MB");
        }

        // Store file
        String fileName = fileStorageService.storeFile(avatarFile, "avatars", login);
        String imageUrl = "/uploads/avatars/" + fileName;

        // Update user
        updateUserImageUrl(login, imageUrl);

        LOG.info("Avatar uploaded successfully for user {}: {}", login, imageUrl);
        return imageUrl;
    }

    @Transactional
    public void changePassword(String currentClearTextPassword, String newPassword) {
        SecurityUtils.getCurrentUserLogin()
            .flatMap(userRepository::findOneByLogin)
            .ifPresent(user -> {
                String currentEncryptedPassword = user.getPassword();
                if (!passwordEncoder.matches(currentClearTextPassword, currentEncryptedPassword)) {
                    throw new InvalidPasswordException();
                }
                String encryptedPassword = passwordEncoder.encode(newPassword);
                user.setPassword(encryptedPassword);
                this.clearUserCaches(user);
                LOG.debug("Changed password for User: {}", user);
            });
    }

    @Transactional(readOnly = true)
    public Page<AdminUserDTO> getAllManagedUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(AdminUserDTO::new);
    }

    @Transactional(readOnly = true)
    public Page<UserDTO> getAllPublicUsers(Pageable pageable) {
        return userRepository.findAllByIdNotNullAndActivatedIsTrue(pageable).map(UserDTO::new);
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserWithAuthoritiesByLogin(String login) {
        return userRepository.findOneWithAuthoritiesByLogin(login);
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserWithAuthorities() {
        return SecurityUtils.getCurrentUserLogin().flatMap(userRepository::findOneWithAuthoritiesByLogin);
    }

    /**
     * Not activated users should be automatically deleted after 3 days.
     * <p>
     * This is scheduled to get fired every day, at 01:00 (am).
     */
    @Scheduled(cron = "0 0 1 * * ?")
    public void removeNotActivatedUsers() {
        userRepository
            .findAllByActivatedIsFalseAndActivationKeyIsNotNullAndCreatedDateBefore(Instant.now().minus(3, ChronoUnit.DAYS))
            .forEach(user -> {
                LOG.debug("Deleting not activated user {}", user.getLogin());
                userRepository.delete(user);
                this.clearUserCaches(user);
            });
    }

    /**
     * Gets a list of all the authorities.
     * @return a list of all the authorities.
     */
    @Transactional(readOnly = true)
    public List<String> getAuthorities() {
        return authorityRepository.findAll().stream().map(Authority::getName).toList();
    }

    /**
     * Lock a user account.
     * Use case 12: Lock/Unlock account
     *
     * @param login the login of the user to lock
     */
    public void lockAccount(String login) {
        LOG.debug("Request to lock account for user : {}", login);
        userRepository
            .findOneByLogin(login)
            .ifPresent(user -> {
                user.setActivated(false);
                userRepository.save(user);
                this.clearUserCaches(user);
                LOG.info("Account locked for user: {}", login);
            });
    }

    /**
     * Unlock a user account.
     * Use case 12: Lock/Unlock account
     *
     * @param login the login of the user to unlock
     */
    public void unlockAccount(String login) {
        LOG.debug("Request to unlock account for user : {}", login);
        userRepository
            .findOneByLogin(login)
            .ifPresent(user -> {
                user.setActivated(true);
                userRepository.save(user);
                this.clearUserCaches(user);
                LOG.info("Account unlocked for user: {}", login);
            });
    }

    private void clearUserCaches(User user) {
        Objects.requireNonNull(cacheManager.getCache(UserRepository.USERS_BY_LOGIN_CACHE)).evictIfPresent(user.getLogin());
        if (user.getEmail() != null) {
            Objects.requireNonNull(cacheManager.getCache(UserRepository.USERS_BY_EMAIL_CACHE)).evictIfPresent(user.getEmail());
        }
    }
}
