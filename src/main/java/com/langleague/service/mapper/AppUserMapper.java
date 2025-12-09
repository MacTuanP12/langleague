package com.langleague.service.mapper;

import com.langleague.domain.AppUser;
import com.langleague.domain.User;
import com.langleague.service.dto.AppUserDTO;
import com.langleague.service.dto.UserDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link AppUser} and its DTO {@link AppUserDTO}.
 */
@Mapper(componentModel = "spring")
public interface AppUserMapper extends EntityMapper<AppUserDTO, AppUser> {
    @Mapping(target = "internalUser", source = "internalUser", qualifiedByName = "userId")
    AppUserDTO toDto(AppUser s);

    @Mapping(target = "internalUser", source = "internalUser", qualifiedByName = "userFromId")
    AppUser toEntity(AppUserDTO dto);

    @Named("userId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    UserDTO toDtoUserId(User user);

    @Named("userFromId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    User userFromId(UserDTO userDTO);
}
