package com.langleague.app.service.mapper;

import com.langleague.app.domain.User;
import com.langleague.app.domain.UserProfile;
import com.langleague.app.service.dto.UserDTO;
import com.langleague.app.service.dto.UserProfileDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link UserProfile} and its DTO {@link UserProfileDTO}.
 */
@Mapper(componentModel = "spring")
public interface UserProfileMapper extends EntityMapper<UserProfileDTO, UserProfile> {
    @Mapping(target = "user", source = "user", qualifiedByName = "userLogin")
    UserProfileDTO toDto(UserProfile s);

    @Named("userLogin")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "login", source = "login")
    UserDTO toDtoUserLogin(User user);

    @Override
    @Mapping(target = "books", ignore = true)
    @Mapping(target = "removeBooks", ignore = true)
    @Mapping(target = "enrollments", ignore = true)
    @Mapping(target = "removeEnrollments", ignore = true)
    @Mapping(target = "progresses", ignore = true)
    @Mapping(target = "removeProgresses", ignore = true)
    @Mapping(target = "user", source = "user")
    UserProfile toEntity(UserProfileDTO userProfileDTO);
}
