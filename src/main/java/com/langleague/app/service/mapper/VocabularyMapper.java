package com.langleague.app.service.mapper;

import com.langleague.app.domain.Unit;
import com.langleague.app.domain.Vocabulary;
import com.langleague.app.service.dto.VocabularyDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Vocabulary} and its DTO {@link VocabularyDTO}.
 */
@Mapper(componentModel = "spring")
public interface VocabularyMapper extends EntityMapper<VocabularyDTO, Vocabulary> {
    @Mapping(target = "unitId", source = "unit.id")
    @Mapping(target = "unitTitle", source = "unit.title")
    VocabularyDTO toDto(Vocabulary s);

    @Mapping(target = "unit", source = "unitId")
    Vocabulary toEntity(VocabularyDTO vocabularyDTO);

    default Unit fromId(Long id) {
        if (id == null) {
            return null;
        }
        Unit unit = new Unit();
        unit.setId(id);
        return unit;
    }
}
