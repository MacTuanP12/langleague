package com.langleague.service.mapper;

import com.langleague.domain.AppUser;
import com.langleague.domain.StudySession;
import com.langleague.service.dto.AppUserDTO;
import com.langleague.service.dto.StudySessionDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link StudySession} and its DTO {@link StudySessionDTO}.
 */
@Mapper(componentModel = "spring")
public interface StudySessionMapper extends EntityMapper<StudySessionDTO, StudySession> {
    @Mapping(target = "appUser", source = "appUser", qualifiedByName = "appUserId")
    StudySessionDTO toDto(StudySession s);

    @Override
    @Mapping(target = "appUser", ignore = true)
    @Mapping(target = "streakMilestones", ignore = true)
    @Mapping(target = "removeStreakMilestone", ignore = true)
    StudySession toEntity(StudySessionDTO dto);

    @Override
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "appUser", ignore = true)
    @Mapping(target = "streakMilestones", ignore = true)
    @Mapping(target = "removeStreakMilestone", ignore = true)
    void partialUpdate(@MappingTarget StudySession entity, StudySessionDTO dto);

    @Named("appUserId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    AppUserDTO toDtoAppUserId(AppUser appUser);
}
