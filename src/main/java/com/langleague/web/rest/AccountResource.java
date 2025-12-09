package com.langleague.web.rest;

import com.langleague.domain.User;
import com.langleague.repository.UserRepository;
import com.langleague.security.SecurityUtils;
import com.langleague.service.AppUserService;
import com.langleague.service.MailService;
import com.langleague.service.UserService;
import com.langleague.service.dto.AdminUserDTO;
import com.langleague.service.dto.PasswordChangeDTO;
import com.langleague.web.rest.errors.*;
import com.langleague.web.rest.vm.KeyAndPasswordVM;
import com.langleague.web.rest.vm.ManagedUserVM;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

/**
 * REST controller for managing the current user's account.
 * Use case 3: Register account
 * Use case 6: Reset password
 * Use case 7: Verify email/phone
 * Use case 10: Edit profile
 * Use case 11: Change password
 * Use case 13: Change avatar
 */
@Tag(name = "Account", description = "User account management and profile settings")
@RestController
@RequestMapping("/api")
public class AccountResource {

    private static final Logger LOG = LoggerFactory.getLogger(AccountResource.class);

    private final UserRepository userRepository;

    private final UserService userService;

    private final MailService mailService;

    private final AppUserService appUserService;

    public AccountResource(UserRepository userRepository, UserService userService, MailService mailService, AppUserService appUserService) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.mailService = mailService;
        this.appUserService = appUserService;
    }

    /**
     * {@code POST  /register} : register the user.
     *
     * @param managedUserVM the managed user View Model.
     * @throws InvalidPasswordException {@code 400 (Bad Request)} if the password is incorrect.
     * @throws EmailAlreadyUsedException {@code 400 (Bad Request)} if the email is already used.
     * @throws LoginAlreadyUsedException {@code 400 (Bad Request)} if the login is already used.
     */
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void registerAccount(@Valid @RequestBody ManagedUserVM managedUserVM) {
        LOG.info("Registration request received for email: {}", managedUserVM.getEmail());

        if (isPasswordLengthInvalid(managedUserVM.getPassword())) {
            LOG.warn("Invalid password length for registration: {}", managedUserVM.getEmail());
            throw new InvalidPasswordException();
        }

        try {
            User user = userService.registerUser(managedUserVM, managedUserVM.getPassword());
            LOG.info("User registered successfully: {}", user.getLogin());

            mailService.sendActivationEmail(user);
            LOG.info("Activation email sent to: {}", user.getEmail());
        } catch (EmailAlreadyUsedException e) {
            LOG.warn("Email already used: {}", managedUserVM.getEmail());
            throw e;
        } catch (LoginAlreadyUsedException e) {
            LOG.warn("Username already used: {}", managedUserVM.getLogin());
            throw e;
        } catch (Exception e) {
            LOG.error("Error during registration for email: {}", managedUserVM.getEmail(), e);
            throw e;
        }
    }

    /**
     * {@code GET  /activate} : activate the registered user.
     *
     * @param key the activation key.
     * @throws ResourceNotFoundException {@code 404 (Not Found)} if the activation key is invalid.
     */
    @GetMapping("/activate")
    public void activateAccount(@RequestParam(value = "key") String key) {
        LOG.info("Activation request received with key: {}", key);
        Optional<User> user = userService.activateRegistration(key);
        if (user.isEmpty()) {
            LOG.error("No user was found for activation key: {}", key);
            throw new ResourceNotFoundException("No user was found for this activation key");
        }
        LOG.info("User activated successfully: {}", user.get().getLogin());
    }

    /**
     * {@code GET  /account} : get the current user.
     *
     * @return the current user.
     * @throws UserNotAuthenticatedException {@code 401 (Unauthorized)} if user is not authenticated.
     */
    @GetMapping("/account")
    public AdminUserDTO getAccount() {
        return userService
            .getUserWithAuthorities()
            .map(user -> {
                AdminUserDTO dto = new AdminUserDTO(user);
                // Try to populate AppUser profile fields into the session DTO
                appUserService
                    .findByUserLogin(user.getLogin())
                    .ifPresent(appUserDTO -> {
                        if (appUserDTO.getDisplayName() != null) dto.setDisplayName(appUserDTO.getDisplayName());
                        if (appUserDTO.getBio() != null) dto.setBio(appUserDTO.getBio());
                    });
                return dto;
            })
            .orElseThrow(() -> new UserNotAuthenticatedException("User could not be found"));
    }

    /**
     * {@code POST  /account} : update the current user information.
     *
     * @param userDTO the current user information.
     * @throws EmailAlreadyUsedException {@code 400 (Bad Request)} if the email is already used.
     * @throws UserNotAuthenticatedException {@code 401 (Unauthorized)} if user is not authenticated.
     */
    @RequestMapping(value = "/account", method = { RequestMethod.POST, RequestMethod.PUT })
    // Accept partial AdminUserDTO for current user updates; don't trigger @Valid validation
    public void saveAccount(@RequestBody AdminUserDTO userDTO) {
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new UserNotAuthenticatedException("Current user login not found")
        );
        LOG.debug(
            "Saving account for userLogin={} with payload email={}, firstName={}, lastName={}",
            userLogin,
            userDTO.getEmail(),
            userDTO.getFirstName(),
            userDTO.getLastName()
        );
        Optional<User> existingUser = userRepository.findOneByEmailIgnoreCase(userDTO.getEmail());
        LOG.debug("Existing user for email {}: {}", userDTO.getEmail(), existingUser.map(User::getLogin).orElse("<none>"));
        if (existingUser.isPresent() && (!existingUser.get().getLogin().equalsIgnoreCase(userLogin))) {
            throw new EmailAlreadyUsedException();
        }
        LOG.debug("Proceeding to find logged-in user by login: {}", userLogin);
        Optional<User> user = userRepository.findOneByLogin(userLogin);
        if (user.isEmpty()) {
            throw new UserNotAuthenticatedException("User could not be found");
        }
        userService.updateUser(
            userDTO.getFirstName(),
            userDTO.getLastName(),
            userDTO.getEmail(),
            userDTO.getLangKey(),
            userDTO.getImageUrl()
        );

        //  Update AppUser fields if provided (displayName, bio)
        if (userDTO.getDisplayName() != null || userDTO.getBio() != null) {
            appUserService.updateProfile(userLogin, userDTO.getDisplayName(), userDTO.getBio());
            LOG.debug("Updated AppUser profile for user: {}", userLogin);
        }
    }

    /**
     * {@code POST  /account/change-password} : changes the current user's password.
     *
     * @param passwordChangeDto current and new password.
     * @throws InvalidPasswordException {@code 400 (Bad Request)} if the new password is incorrect.
     */
    @PostMapping(path = "/account/change-password")
    public void changePassword(@RequestBody PasswordChangeDTO passwordChangeDto) {
        if (isPasswordLengthInvalid(passwordChangeDto.getNewPassword())) {
            throw new InvalidPasswordException();
        }
        userService.changePassword(passwordChangeDto.getCurrentPassword(), passwordChangeDto.getNewPassword());
    }

    /**
     * {@code POST   /account/reset-password/init} : Send an email to reset the password of the user.
     *
     * @param mail the mail of the user.
     */
    @PostMapping(path = "/account/reset-password/init")
    public void requestPasswordReset(@RequestBody String mail) {
        Optional<User> user = userService.requestPasswordReset(mail);
        if (user.isPresent()) {
            mailService.sendPasswordResetMail(user.orElseThrow());
        } else {
            // Pretend the request has been successful to prevent checking which emails really exist
            // but log that an invalid attempt has been made
            LOG.warn("Password reset requested for non existing mail");
        }
    }

    /**
     * {@code POST   /account/reset-password/finish} : Finish to reset the password of the user.
     *
     * @param keyAndPassword the generated key and the new password.
     * @throws InvalidPasswordException {@code 400 (Bad Request)} if the password is incorrect.
     * @throws ResourceNotFoundException {@code 404 (Not Found)} if the reset key is invalid.
     */
    @PostMapping(path = "/account/reset-password/finish")
    public void finishPasswordReset(@RequestBody KeyAndPasswordVM keyAndPassword) {
        if (isPasswordLengthInvalid(keyAndPassword.getNewPassword())) {
            throw new InvalidPasswordException();
        }
        Optional<User> user = userService.completePasswordReset(keyAndPassword.getNewPassword(), keyAndPassword.getKey());

        if (user.isEmpty()) {
            throw new ResourceNotFoundException("No user was found for this reset key");
        }
    }

    private static boolean isPasswordLengthInvalid(String password) {
        return (
            StringUtils.isEmpty(password) ||
            password.length() < ManagedUserVM.PASSWORD_MIN_LENGTH ||
            password.length() > ManagedUserVM.PASSWORD_MAX_LENGTH
        );
    }

    /**
     * {@code GET /account/test-email} : Test mail service configuration.
     * This endpoint sends a test email to verify mail service is working.
     */
    @GetMapping("/account/test-email")
    public void testEmailService() {
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new UserNotAuthenticatedException("Current user login not found")
        );
        User user = userRepository
            .findOneByLogin(userLogin)
            .orElseThrow(() -> new UserNotAuthenticatedException("User could not be found"));

        mailService.sendEmail(
            user.getEmail(),
            "Test Email from LangLeague",
            "This is a test email to verify mail service is working correctly.",
            false,
            false
        );
        LOG.info("Test email sent to: {}", user.getEmail());
    }

    /**
     * {@code POST /account/lock} : Lock current user's account.
     * Use case 12: Lock/Unlock account
     */
    @PostMapping("/account/lock")
    public void lockOwnAccount() {
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new UserNotAuthenticatedException("Current user login not found")
        );
        userService.lockAccount(userLogin);
    }

    /**
     * {@code POST /account/unlock} : Unlock current user's account.
     * Use case 12: Lock/Unlock account
     */
    @PostMapping("/account/unlock")
    public void unlockOwnAccount() {
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new UserNotAuthenticatedException("Current user login not found")
        );
        userService.unlockAccount(userLogin);
    }

    /**
     * {@code PUT /account/avatar} : Update current user's avatar.
     * Use case 13: Change avatar
     * Updates User.imageUrl field (supports both URLs and base64)
     */
    @PutMapping("/account/avatar")
    public Map<String, String> updateAvatar(@RequestBody Map<String, String> payload) {
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new UserNotAuthenticatedException("Current user login not found")
        );
        String imageUrl = payload.get("imageUrl");
        LOG.debug("Received avatar update for userLogin={} payloadLength={}", userLogin, imageUrl == null ? 0 : imageUrl.length());

        // Option 1: If it's already a URL (http/https), use it directly
        if (imageUrl != null && (imageUrl.startsWith("http://") || imageUrl.startsWith("https://"))) {
            userService.updateUserImageUrl(userLogin, imageUrl);
            LOG.debug("User.imageUrl updated with external URL: {}", imageUrl);
            Map<String, String> res = new HashMap<>();
            res.put("url", imageUrl);
            return res;
        }

        // Option 2: If it's base64, save to file system and store URL
        String base64 = imageUrl;
        String extension = "png";
        if (base64 != null && base64.startsWith("data:")) {
            int semi = base64.indexOf(';');
            int comma = base64.indexOf(',');
            if (semi > 5 && comma > semi) {
                String mime = base64.substring(5, semi);
                if (mime.contains("/")) {
                    extension = mime.substring(mime.indexOf('/') + 1);
                    // normalize jpeg -> jpg
                    if (extension.equalsIgnoreCase("jpeg")) extension = "jpg";
                }
                base64 = base64.substring(comma + 1);
            }
        }

        try {
            if (base64 != null && !base64.isBlank()) {
                byte[] data = Base64.getDecoder().decode(base64);
                // Use a stable directory under the user's home so uploads survive working dir changes
                Path uploads = Path.of(System.getProperty("user.home"), ".langleague", "uploads", "avatars");
                Files.createDirectories(uploads);
                String fileName = userLogin + "." + extension;
                Path target = uploads.resolve(fileName);
                Files.write(target, data);
                // Build an absolute URL using the current request context so the frontend can fetch it
                String publicUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/content/avatars/")
                    .path(fileName)
                    .toUriString();
                userService.updateUserImageUrl(userLogin, publicUrl);
                LOG.debug("Avatar saved to {} and User.imageUrl updated with url={}", target.toAbsolutePath(), publicUrl);
                Map<String, String> res = new HashMap<>();
                res.put("url", publicUrl);
                return res;
            } else {
                LOG.warn("Empty avatar payload for userLogin={}", userLogin);
            }
        } catch (Exception e) {
            LOG.error("Failed to save avatar for user {}: {}", userLogin, e.getMessage(), e);
            throw new BadRequestAlertException("Failed to update avatar", "avatar", "uploadfailed");
        }
        return new HashMap<>();
    }

    /**
     * {@code PUT /account/profile} : Update current user's profile.
     * Use case 10: Edit profile
     */
    @PutMapping("/account/profile")
    public AdminUserDTO updateProfile(@RequestBody Map<String, String> profileData) {
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new UserNotAuthenticatedException("Current user login not found")
        );
        LOG.debug("Updating profile for userLogin={} with displayName={}", userLogin, profileData.get("displayName"));
        appUserService.updateProfile(userLogin, profileData.get("displayName"), profileData.get("bio"));
        // Return refreshed session DTO so frontend can immediately update UI without an extra GET
        return userService
            .getUserWithAuthorities()
            .map(user -> {
                AdminUserDTO dto = new AdminUserDTO(user);
                appUserService
                    .findByUserLogin(user.getLogin())
                    .ifPresent(appUserDTO -> {
                        if (appUserDTO.getDisplayName() != null) dto.setDisplayName(appUserDTO.getDisplayName());
                        if (appUserDTO.getBio() != null) dto.setBio(appUserDTO.getBio());
                    });
                return dto;
            })
            .orElseThrow(() -> new UserNotAuthenticatedException("User could not be found"));
    }
    // TODO: Use case 14, 15, 7 (notifications, learning goals, phone verification)
    // Will be handled in separate logic layer as requested by user
}
