package com.langleague.service.mapper;

import com.langleague.domain.Grammar;
import com.langleague.domain.GrammarExample;
import com.langleague.service.dto.GrammarDTO;
import com.langleague.service.dto.GrammarExampleDTO;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;

/**
 * Mapper for the entity {@link GrammarExample} and its DTO {@link GrammarExampleDTO}.
 */
@Mapper(componentModel = "spring")
public interface GrammarExampleMapper extends EntityMapper<GrammarExampleDTO, GrammarExample> {
    @Mapping(target = "grammar", source = "grammar", qualifiedByName = "grammarId")
    GrammarExampleDTO toDto(GrammarExample s);

    @Override
    @Mapping(target = "grammar", ignore = true)
    GrammarExample toEntity(GrammarExampleDTO dto);

    @Override
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "grammar", ignore = true)
    void partialUpdate(@MappingTarget GrammarExample entity, GrammarExampleDTO dto);

    @Named("grammarId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    GrammarDTO toDtoGrammarId(Grammar grammar);
}
