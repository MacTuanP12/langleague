package com.langleague.service.mapper;

import com.langleague.domain.User;
import com.langleague.service.dto.UserDTO;
import java.util.*;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.stereotype.Service;

/**
 * Mapper for the entity {@link User} and its DTO {@link UserDTO}.
 *
 * This mapper provides named mapping methods used by other MapStruct mappers
 * for handling User entity references.
 */
@Service
public class UserMapper {

    /**
     * Map User entity to UserDTO with only ID field.
     * Used by MapStruct mappers with @Mapping(qualifiedByName = "id")
     *
     * @param user the User entity
     * @return UserDTO with only ID populated
     */
    @Named("id")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    public UserDTO toDtoId(User user) {
        if (user == null) {
            return null;
        }
        UserDTO userDto = new UserDTO();
        userDto.setId(user.getId());
        return userDto;
    }

    /**
     * Map Set of User entities to Set of UserDTOs with only ID field.
     * Used by MapStruct mappers with @Mapping(qualifiedByName = "idSet")
     *
     * @param users the Set of User entities
     * @return Set of UserDTOs with only ID populated
     */
    @Named("idSet")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    public Set<UserDTO> toDtoIdSet(Set<User> users) {
        if (users == null) {
            return Collections.emptySet();
        }
        Set<UserDTO> userSet = new HashSet<>();
        for (User userEntity : users) {
            userSet.add(this.toDtoId(userEntity));
        }
        return userSet;
    }

    /**
     * Map User entity to UserDTO with ID and login fields.
     * Used by MapStruct mappers with @Mapping(qualifiedByName = "login")
     *
     * @param user the User entity
     * @return UserDTO with ID and login populated
     */
    @Named("login")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "login", source = "login")
    public UserDTO toDtoLogin(User user) {
        if (user == null) {
            return null;
        }
        UserDTO userDto = new UserDTO();
        userDto.setId(user.getId());
        userDto.setLogin(user.getLogin());
        return userDto;
    }

    /**
     * Map Set of User entities to Set of UserDTOs with ID and login fields.
     * Used by MapStruct mappers with @Mapping(qualifiedByName = "loginSet")
     *
     * @param users the Set of User entities
     * @return Set of UserDTOs with ID and login populated
     */
    @Named("loginSet")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "login", source = "login")
    public Set<UserDTO> toDtoLoginSet(Set<User> users) {
        if (users == null) {
            return Collections.emptySet();
        }
        Set<UserDTO> userSet = new HashSet<>();
        for (User userEntity : users) {
            userSet.add(this.toDtoLogin(userEntity));
        }
        return userSet;
    }

    /**
     * Create a User entity from ID only.
     *
     * @param id the User ID
     * @return User entity with only ID set
     */
    public User userFromId(Long id) {
        if (id == null) {
            return null;
        }
        User user = new User();
        user.setId(id);
        return user;
    }
}
