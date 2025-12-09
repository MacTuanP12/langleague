package com.langleague.service.mapper;

import com.langleague.domain.Chapter;
import com.langleague.domain.Grammar;
import com.langleague.service.dto.ChapterDTO;
import com.langleague.service.dto.GrammarDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Grammar} and its DTO {@link GrammarDTO}.
 */
@Mapper(componentModel = "spring")
public interface GrammarMapper extends EntityMapper<GrammarDTO, Grammar> {
    @Mapping(target = "chapter", source = "chapter", qualifiedByName = "chapterId")
    GrammarDTO toDto(Grammar s);

    @Named("chapterId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ChapterDTO toDtoChapterId(Chapter chapter);
}
