package com.langleague.service.mapper;

import com.langleague.domain.AppUser;
import com.langleague.domain.User;
import com.langleague.service.dto.AdminUserDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring", uses = { AppUserMapper.class })
public interface AdminUserMapper extends EntityMapper<AdminUserDTO, User> {
    @Mapping(target = "authorities", source = "authorities", qualifiedByName = "authoritiesToString")
    @Mapping(target = "displayName", source = "appUser.displayName")
    @Mapping(target = "bio", source = "appUser.bio")
    AdminUserDTO toDto(User user, AppUser appUser);

    @Named("authoritiesToString")
    default java.util.Set<String> authoritiesToString(java.util.Set<com.langleague.domain.Authority> authorities) {
        if (authorities == null) {
            return java.util.Collections.emptySet();
        }
        return authorities.stream().map(com.langleague.domain.Authority::getName).collect(java.util.stream.Collectors.toSet());
    }

    default User fromId(Long id) {
        if (id == null) {
            return null;
        }
        User user = new User();
        user.setId(id);
        return user;
    }
}
