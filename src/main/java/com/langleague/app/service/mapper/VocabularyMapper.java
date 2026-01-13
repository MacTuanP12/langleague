package com.langleague.app.service.mapper;

import com.langleague.app.domain.Unit;
import com.langleague.app.domain.Vocabulary;
import com.langleague.app.service.dto.UnitDTO;
import com.langleague.app.service.dto.VocabularyDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Vocabulary} and its DTO {@link VocabularyDTO}.
 */
@Mapper(componentModel = "spring")
public interface VocabularyMapper extends EntityMapper<VocabularyDTO, Vocabulary> {
    @Mapping(target = "unit", source = "unit", qualifiedByName = "unitId")
    VocabularyDTO toDto(Vocabulary s);

    @Named("unitId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    UnitDTO toDtoUnitId(Unit unit);

    @Override
    @Mapping(target = "unit", source = "unit")
    Vocabulary toEntity(VocabularyDTO vocabularyDTO);
}
