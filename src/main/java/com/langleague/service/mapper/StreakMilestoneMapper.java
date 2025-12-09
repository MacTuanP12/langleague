package com.langleague.service.mapper;

import com.langleague.domain.StreakMilestone;
import com.langleague.domain.StudySession;
import com.langleague.service.dto.StreakMilestoneDTO;
import com.langleague.service.dto.StudySessionDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link StreakMilestone} and its DTO {@link StreakMilestoneDTO}.
 */
@Mapper(componentModel = "spring")
public interface StreakMilestoneMapper extends EntityMapper<StreakMilestoneDTO, StreakMilestone> {
    @Mapping(target = "studySession", source = "studySession", qualifiedByName = "studySessionId")
    StreakMilestoneDTO toDto(StreakMilestone s);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "studySession", ignore = true)
    void partialUpdate(@MappingTarget StreakMilestone entity, StreakMilestoneDTO dto);

    @Named("studySessionId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    StudySessionDTO toDtoStudySessionId(StudySession studySession);
}
