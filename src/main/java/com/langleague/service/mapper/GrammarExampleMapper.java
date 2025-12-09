package com.langleague.service.mapper;

import com.langleague.domain.Grammar;
import com.langleague.domain.GrammarExample;
import com.langleague.service.dto.GrammarDTO;
import com.langleague.service.dto.GrammarExampleDTO;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

/**
 * Mapper for the entity {@link GrammarExample} and its DTO {@link GrammarExampleDTO}.
 */
@Mapper(componentModel = "spring")
public interface GrammarExampleMapper extends EntityMapper<GrammarExampleDTO, GrammarExample> {
    @Mapping(target = "grammar", source = "grammar", qualifiedByName = "grammarId")
    GrammarExampleDTO toDto(GrammarExample s);

    @Named("grammarId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    GrammarDTO toDtoGrammarId(Grammar grammar);
}
