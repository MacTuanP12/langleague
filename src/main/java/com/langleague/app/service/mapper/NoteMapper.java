package com.langleague.app.service.mapper;

import com.langleague.app.domain.Note;
import com.langleague.app.domain.Unit;
import com.langleague.app.domain.UserProfile;
import com.langleague.app.service.dto.NoteDTO;
import com.langleague.app.service.dto.UnitDTO;
import com.langleague.app.service.dto.UserProfileDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Note} and its DTO {@link NoteDTO}.
 */
@Mapper(componentModel = "spring")
public interface NoteMapper extends EntityMapper<NoteDTO, Note> {
    @Mapping(target = "userProfile", source = "userProfileId", qualifiedByName = "userProfileId")
    @Mapping(target = "unit", source = "unitId", qualifiedByName = "unitId")
    Note toEntity(NoteDTO noteDTO);

    @Mapping(target = "userProfileId", source = "userProfile.id")
    @Mapping(target = "unitId", source = "unit.id")
    NoteDTO toDto(Note s);

    @Named("userProfileId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    UserProfile toDtoUserProfileId(Long id);

    @Named("unitId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    Unit toDtoUnitId(Long id);
}
