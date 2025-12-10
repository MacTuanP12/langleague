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

    @Override
    @Mapping(target = "chapter", ignore = true)
    @Mapping(target = "options", ignore = true)
    @Mapping(target = "removeOption", ignore = true)
    @Mapping(target = "exerciseResults", ignore = true)
    @Mapping(target = "removeExerciseResult", ignore = true)
    ReadingExercise toEntity(ReadingExerciseDTO dto);

    @Override
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "chapter", ignore = true)
    @Mapping(target = "options", ignore = true)
    @Mapping(target = "removeOption", ignore = true)
    @Mapping(target = "exerciseResults", ignore = true)
    @Mapping(target = "removeExerciseResult", ignore = true)
    void partialUpdate(@MappingTarget ReadingExercise entity, ReadingExerciseDTO dto);

    @Named("chapterId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ChapterDTO toDtoChapterId(Chapter chapter);
}
