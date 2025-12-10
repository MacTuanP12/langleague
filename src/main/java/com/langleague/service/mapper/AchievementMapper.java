package com.langleague.service.mapper;

import com.langleague.domain.Achievement;
import com.langleague.service.dto.AchievementDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Achievement} and its DTO {@link AchievementDTO}.
 */
@Mapper(componentModel = "spring")
public interface AchievementMapper extends EntityMapper<AchievementDTO, Achievement> {
    @Override
    @Mapping(target = "criteriaType", ignore = true)
    @Mapping(target = "targetValue", ignore = true)
    @Mapping(target = "iconUrl", ignore = true)
    @Mapping(target = "userAchievements", ignore = true)
    @Mapping(target = "removeUserAchievement", ignore = true)
    Achievement toEntity(AchievementDTO dto);

    @Override
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "criteriaType", ignore = true)
    @Mapping(target = "targetValue", ignore = true)
    @Mapping(target = "iconUrl", ignore = true)
    @Mapping(target = "userAchievements", ignore = true)
    @Mapping(target = "removeUserAchievement", ignore = true)
    void partialUpdate(@MappingTarget Achievement entity, AchievementDTO dto);
}
