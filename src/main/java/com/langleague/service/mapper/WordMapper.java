package com.langleague.service.mapper;

import com.langleague.domain.Chapter;
import com.langleague.domain.Word;
import com.langleague.service.dto.ChapterDTO;
import com.langleague.service.dto.WordDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Word} and its DTO {@link WordDTO}.
 */
@Mapper(componentModel = "spring")
public interface WordMapper extends EntityMapper<WordDTO, Word> {
    @Mapping(target = "chapter", source = "chapter", qualifiedByName = "chapterId")
    WordDTO toDto(Word s);

    @Named("chapterId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ChapterDTO toDtoChapterId(Chapter chapter);
}
