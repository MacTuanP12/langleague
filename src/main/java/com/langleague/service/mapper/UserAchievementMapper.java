package com.langleague.service.mapper;

import com.langleague.domain.Achievement;
import com.langleague.domain.AppUser;
import com.langleague.domain.UserAchievement;
import com.langleague.service.dto.AchievementDTO;
import com.langleague.service.dto.AppUserDTO;
import com.langleague.service.dto.UserAchievementDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link UserAchievement} and its DTO {@link UserAchievementDTO}.
 */
@Mapper(componentModel = "spring")
public interface UserAchievementMapper extends EntityMapper<UserAchievementDTO, UserAchievement> {
    @Mapping(target = "appUser", source = "appUser", qualifiedByName = "appUserId")
    @Mapping(target = "achievement", source = "achievement", qualifiedByName = "achievementId")
    UserAchievementDTO toDto(UserAchievement s);

    @Named("appUserId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    AppUserDTO toDtoAppUserId(AppUser appUser);

    @Named("achievementId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    AchievementDTO toDtoAchievementId(Achievement achievement);
}
