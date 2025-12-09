package com.langleague.service.mapper;

import com.langleague.domain.*;
import com.langleague.service.dto.*;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Chapter} and its detailed DTO {@link ChapterDetailDTO}.
 */
@Mapper(
    componentModel = "spring",
    uses = {
        BookMapper.class,
        WordMapper.class,
        GrammarMapper.class,
        ListeningExerciseMapper.class,
        ReadingExerciseMapper.class,
        WritingExerciseMapper.class,
        SpeakingExerciseMapper.class,
    }
)
public interface ChapterDetailMapper {
    @Mapping(target = "book", source = "book")
    @Mapping(target = "words", source = "words")
    @Mapping(target = "grammars", source = "grammars")
    @Mapping(target = "listeningExercises", source = "listeningExercises")
    @Mapping(target = "readingExercises", source = "readingExercises")
    @Mapping(target = "writingExercises", source = "writingExercises")
    @Mapping(target = "speakingExercises", source = "speakingExercises")
    ChapterDetailDTO toDto(Chapter chapter);
}
