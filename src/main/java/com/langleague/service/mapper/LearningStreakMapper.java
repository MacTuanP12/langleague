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
    @Mapping(target = "iconUrl", ignore = true)
    LearningStreakDTO toDto(LearningStreak s);

    @Override
    @Mapping(target = "appUser", ignore = true)
    @Mapping(target = "version", ignore = true)
    LearningStreak toEntity(LearningStreakDTO dto);

    @Override
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "appUser", ignore = true)
    @Mapping(target = "version", ignore = true)
    void partialUpdate(@MappingTarget LearningStreak entity, LearningStreakDTO dto);

    @Named("appUserId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    AppUserDTO toDtoAppUserId(AppUser appUser);
}
