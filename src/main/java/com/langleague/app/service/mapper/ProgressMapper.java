package com.langleague.app.service.mapper;

import com.langleague.app.domain.Progress;
import com.langleague.app.domain.Unit;
import com.langleague.app.domain.UserProfile;
import com.langleague.app.service.dto.ProgressDTO;
import com.langleague.app.service.dto.UnitDTO;
import com.langleague.app.service.dto.UserProfileDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Progress} and its DTO {@link ProgressDTO}.
 */
@Mapper(componentModel = "spring")
public interface ProgressMapper extends EntityMapper<ProgressDTO, Progress> {
    @Mapping(target = "userProfile", source = "userProfile", qualifiedByName = "userProfileId")
    @Mapping(target = "unit", source = "unit", qualifiedByName = "unitId")
    ProgressDTO toDto(Progress s);

    @Named("userProfileId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    UserProfileDTO toDtoUserProfileId(UserProfile userProfile);

    @Named("unitId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    UnitDTO toDtoUnitId(Unit unit);

    @Override
    @Mapping(target = "userProfile", source = "userProfile")
    @Mapping(target = "unit", source = "unit")
    Progress toEntity(ProgressDTO progressDTO);
}
