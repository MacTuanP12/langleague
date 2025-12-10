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

    @Override
    @Mapping(target = "chapter", ignore = true)
    @Mapping(target = "wordExamples", ignore = true)
    @Mapping(target = "removeWordExample", ignore = true)
    @Mapping(target = "userVocabularies", ignore = true)
    @Mapping(target = "removeUserVocabulary", ignore = true)
    Word toEntity(WordDTO dto);

    @Override
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "chapter", ignore = true)
    @Mapping(target = "wordExamples", ignore = true)
    @Mapping(target = "removeWordExample", ignore = true)
    @Mapping(target = "userVocabularies", ignore = true)
    @Mapping(target = "removeUserVocabulary", ignore = true)
    void partialUpdate(@MappingTarget Word entity, WordDTO dto);

    @Named("chapterId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ChapterDTO toDtoChapterId(Chapter chapter);
}
