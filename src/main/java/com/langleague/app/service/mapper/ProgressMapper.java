package com.langleague.app.service.mapper;

import com.langleague.app.domain.Progress;
import com.langleague.app.domain.Unit;
import com.langleague.app.service.dto.ProgressDTO;
import com.langleague.app.service.dto.UnitDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Progress} and its DTO {@link ProgressDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface ProgressMapper extends EntityMapper<ProgressDTO, Progress> {
    @Mapping(target = "userProfileId", source = "userProfile.id")
    @Mapping(target = "unitId", source = "unit.id")
    @Mapping(target = "unit", source = "unit", qualifiedByName = "unitWithBook")
    ProgressDTO toDto(Progress s);

    @Mapping(target = "userProfile.id", source = "userProfileId")
    @Mapping(target = "unit.id", source = "unitId")
    Progress toEntity(ProgressDTO progressDTO);

    @Named("unitWithBook")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "title", source = "title")
    @Mapping(target = "orderIndex", source = "orderIndex")
    @Mapping(target = "bookId", source = "book.id")
    @Mapping(target = "bookTitle", source = "book.title")
    UnitDTO toDtoUnitWithBook(Unit unit);
}
