package com.langleague.service.mapper;

import com.langleague.domain.StreakIcon;
import com.langleague.service.dto.StreakIconDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link StreakIcon} and its DTO {@link StreakIconDTO}.
 */
@Mapper(componentModel = "spring")
public interface StreakIconMapper extends EntityMapper<StreakIconDTO, StreakIcon> {
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void partialUpdate(@MappingTarget StreakIcon entity, StreakIconDTO dto);
}
