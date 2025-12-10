package com.langleague.service.mapper;

import com.langleague.domain.Book;
import com.langleague.domain.Chapter;
import com.langleague.service.dto.BookDTO;
import com.langleague.service.dto.ChapterDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Chapter} and its DTO {@link ChapterDTO}.
 */
@Mapper(componentModel = "spring")
public interface ChapterMapper extends EntityMapper<ChapterDTO, Chapter> {
    @Mapping(target = "book", source = "book", qualifiedByName = "bookId")
    ChapterDTO toDto(Chapter s);

    @Override
    @Mapping(target = "book", ignore = true)
    @Mapping(target = "words", ignore = true)
    @Mapping(target = "removeWord", ignore = true)
    @Mapping(target = "grammars", ignore = true)
    @Mapping(target = "removeGrammar", ignore = true)
    @Mapping(target = "listeningExercises", ignore = true)
    @Mapping(target = "removeListeningExercise", ignore = true)
    @Mapping(target = "speakingExercises", ignore = true)
    @Mapping(target = "removeSpeakingExercise", ignore = true)
    @Mapping(target = "readingExercises", ignore = true)
    @Mapping(target = "removeReadingExercise", ignore = true)
    @Mapping(target = "writingExercises", ignore = true)
    @Mapping(target = "removeWritingExercise", ignore = true)
    @Mapping(target = "chapterProgresses", ignore = true)
    @Mapping(target = "removeChapterProgress", ignore = true)
    Chapter toEntity(ChapterDTO dto);

    @Override
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "book", ignore = true)
    @Mapping(target = "words", ignore = true)
    @Mapping(target = "removeWord", ignore = true)
    @Mapping(target = "grammars", ignore = true)
    @Mapping(target = "removeGrammar", ignore = true)
    @Mapping(target = "listeningExercises", ignore = true)
    @Mapping(target = "removeListeningExercise", ignore = true)
    @Mapping(target = "speakingExercises", ignore = true)
    @Mapping(target = "removeSpeakingExercise", ignore = true)
    @Mapping(target = "readingExercises", ignore = true)
    @Mapping(target = "removeReadingExercise", ignore = true)
    @Mapping(target = "writingExercises", ignore = true)
    @Mapping(target = "removeWritingExercise", ignore = true)
    @Mapping(target = "chapterProgresses", ignore = true)
    @Mapping(target = "removeChapterProgress", ignore = true)
    void partialUpdate(@MappingTarget Chapter entity, ChapterDTO dto);

    @Named("bookId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    BookDTO toDtoBookId(Book book);
}
