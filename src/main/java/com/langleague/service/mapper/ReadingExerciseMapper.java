package com.langleague.service.mapper;

import com.langleague.domain.Chapter;
import com.langleague.domain.ReadingExercise;
import com.langleague.service.dto.ChapterDTO;
import com.langleague.service.dto.ReadingExerciseDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link ReadingExercise} and its DTO {@link ReadingExerciseDTO}.
 */
@Mapper(componentModel = "spring")
public interface ReadingExerciseMapper extends EntityMapper<ReadingExerciseDTO, ReadingExercise> {
    @Mapping(target = "chapter", source = "chapter", qualifiedByName = "chapterId")
    ReadingExerciseDTO toDto(ReadingExercise s);

    @Named("chapterId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ChapterDTO toDtoChapterId(Chapter chapter);
}
