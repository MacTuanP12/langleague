package com.langleague.security;

import com.langleague.domain.AppUser;
import com.langleague.domain.Authority;
import com.langleague.domain.User;
import com.langleague.repository.AppUserRepository;
import com.langleague.repository.UserRepository;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Custom OAuth2 User Service to handle OAuth2 authentication
 * Creates both User (admin managed) and AppUser (actual user) with 1:1
 * relationship
 */
@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private static final Logger log = LoggerFactory.getLogger(CustomOAuth2UserService.class);

    private final UserRepository userRepository;
    private final AppUserRepository appUserRepository;

    public CustomOAuth2UserService(UserRepository userRepository, AppUserRepository appUserRepository) {
        this.userRepository = userRepository;
        this.appUserRepository = appUserRepository;
    }

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // Process OAuth2 user info and sync with local database
        User user = processOAuth2User(userRequest, oAuth2User);

        // Get authorities from the local user
        Set<GrantedAuthority> authorities = user
            .getAuthorities()
            .stream()
            .map(Authority::getName)
            .map(SimpleGrantedAuthority::new)
            .collect(Collectors.toSet());

        // Create a new OAuth2User with the authorities from our database
        return new DefaultOAuth2User(authorities, oAuth2User.getAttributes(), "email");
    }

    @SuppressWarnings("unused") // userRequest may be used for provider-specific logic in the future
    private User processOAuth2User(OAuth2UserRequest userRequest, OAuth2User oAuth2User) {
        String email = oAuth2User.getAttribute("email");

        if (email == null || email.isEmpty()) {
            throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
        }

        log.debug("Processing OAuth2 user with email: {}", email);

        // Find existing User by email
        Optional<User> userOptional = userRepository.findOneByEmailIgnoreCase(email);
        User user;
        AppUser appUser;

        if (userOptional.isPresent()) {
            user = userOptional.orElseThrow();
            log.debug("Found existing user: {}", user.getLogin());

            // Find or create AppUser for this User
            appUser = appUserRepository.findByInternalUserId(user.getId()).orElseGet(() -> createAppUserForExistingUser(user, oAuth2User));

            // Update user info from OAuth2 if needed
            updateExistingUser(user, appUser, oAuth2User);
        } else {
            // Create new User and AppUser
            log.debug("Creating new user for email: {}", email);
            user = createNewUser(oAuth2User);
            createAppUserForNewUser(user, oAuth2User);
        }
        return user;
    }

    private void updateExistingUser(User user, AppUser appUser, OAuth2User oAuth2User) {
        // Update User information if needed
        String firstName = oAuth2User.getAttribute("given_name");
        String lastName = oAuth2User.getAttribute("family_name");

        boolean userUpdated = false;
        if (firstName != null && !firstName.equals(user.getFirstName())) {
            user.setFirstName(firstName);
            userUpdated = true;
        }
        if (lastName != null && !lastName.equals(user.getLastName())) {
            user.setLastName(lastName);
            userUpdated = true;
        }

        if (userUpdated) {
            userRepository.save(user);
            log.debug("Updated user info: {}", user.getLogin());
        }

        // Update AppUser information
        String name = oAuth2User.getAttribute("name");

        boolean appUserUpdated = false;
        if (name != null && !name.equals(appUser.getDisplayName())) {
            appUser.setDisplayName(name);
            appUserUpdated = true;
        }

        if (appUserUpdated) {
            appUserRepository.save(appUser);
            log.debug("Updated app user info for: {}", user.getLogin());
        }
    }

    private User createNewUser(OAuth2User oAuth2User) {
        User user = new User();
        user.setEmail(oAuth2User.getAttribute("email"));
        user.setFirstName(oAuth2User.getAttribute("given_name"));
        user.setLastName(oAuth2User.getAttribute("family_name"));
        user.setActivated(true);
        user.setLangKey("en");

        // Assign default "ROLE_USER" authority
        Set<Authority> authorities = new HashSet<>();
        Authority userAuthority = new Authority();
        userAuthority.setName("ROLE_USER");
        authorities.add(userAuthority);
        user.setAuthorities(authorities);

        // Generate unique login from email
        String email = user.getEmail();
        String baseLogin = email.substring(0, email.indexOf("@"));
        String login = baseLogin;
        int counter = 1;

        // Ensure unique login
        while (userRepository.findOneByLogin(login).isPresent()) {
            login = baseLogin + counter;
            counter++;
        }
        user.setLogin(login);

        // No password for OAuth2 users
        user.setPassword(null);

        user = userRepository.save(user);
        log.debug("Created new user: {}", user.getLogin());
        return user;
    }

    private void createAppUserForNewUser(User user, OAuth2User oAuth2User) {
        AppUser appUser = new AppUser();
        appUser.setInternalUser(user);
        appUser.setDisplayName(oAuth2User.getAttribute("name"));

        appUserRepository.save(appUser);
        log.debug("Created new app user for: {}", user.getLogin());
    }

    private AppUser createAppUserForExistingUser(User user, OAuth2User oAuth2User) {
        AppUser appUser = new AppUser();
        appUser.setInternalUser(user);
        appUser.setDisplayName(oAuth2User.getAttribute("name"));

        appUser = appUserRepository.save(appUser);
        log.debug("Created app user for existing user: {}", user.getLogin());
        return appUser;
    }
}
