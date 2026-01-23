package com.langleague.app.service.mapper;

import com.langleague.app.domain.Grammar;
import com.langleague.app.domain.Unit;
import com.langleague.app.service.dto.GrammarDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Grammar} and its DTO {@link GrammarDTO}.
 */
@Mapper(componentModel = "spring")
public interface GrammarMapper extends EntityMapper<GrammarDTO, Grammar> {
    @Mapping(target = "unitId", source = "unit.id")
    @Mapping(target = "unitTitle", source = "unit.title")
    GrammarDTO toDto(Grammar s);

    @Mapping(target = "unit", source = "unitId")
    Grammar toEntity(GrammarDTO grammarDTO);

    default Unit fromId(Long id) {
        if (id == null) {
            return null;
        }
        Unit unit = new Unit();
        unit.setId(id);
        return unit;
    }
}
