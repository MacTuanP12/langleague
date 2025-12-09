package com.langleague.service.mapper;

import com.langleague.domain.AppUser;
import com.langleague.domain.LearningStreak;
import com.langleague.service.dto.AppUserDTO;
import com.langleague.service.dto.LearningStreakDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link LearningStreak} and its DTO {@link LearningStreakDTO}.
 */
@Mapper(componentModel = "spring")
public interface LearningStreakMapper extends EntityMapper<LearningStreakDTO, LearningStreak> {
    @Mapping(target = "appUser", source = "appUser", qualifiedByName = "appUserId")
    LearningStreakDTO toDto(LearningStreak s);

    @Named("appUserId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    AppUserDTO toDtoAppUserId(AppUser appUser);
}
