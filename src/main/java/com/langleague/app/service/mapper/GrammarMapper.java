package com.langleague.app.service.mapper;

import com.langleague.app.domain.Grammar;
import com.langleague.app.domain.Unit;
import com.langleague.app.service.dto.GrammarDTO;
import com.langleague.app.service.dto.UnitDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Grammar} and its DTO {@link GrammarDTO}.
 */
@Mapper(componentModel = "spring")
public interface GrammarMapper extends EntityMapper<GrammarDTO, Grammar> {
    @Mapping(target = "unit", source = "unit", qualifiedByName = "unitId")
    GrammarDTO toDto(Grammar s);

    @Named("unitId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    UnitDTO toDtoUnitId(Unit unit);

    @Override
    @Mapping(target = "unit", source = "unit")
    Grammar toEntity(GrammarDTO grammarDTO);
}
