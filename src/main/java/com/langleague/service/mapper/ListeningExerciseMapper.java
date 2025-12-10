package com.langleague.service.mapper;

import com.langleague.domain.Chapter;
import com.langleague.domain.ListeningExercise;
import com.langleague.service.dto.ChapterDTO;
import com.langleague.service.dto.ListeningExerciseDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link ListeningExercise} and its DTO {@link ListeningExerciseDTO}.
 */
@Mapper(componentModel = "spring")
public interface ListeningExerciseMapper extends EntityMapper<ListeningExerciseDTO, ListeningExercise> {
    @Mapping(target = "chapter", source = "chapter", qualifiedByName = "chapterId")
    ListeningExerciseDTO toDto(ListeningExercise s);

    @Override
    @Mapping(target = "chapter", ignore = true)
    @Mapping(target = "options", ignore = true)
    @Mapping(target = "removeOption", ignore = true)
    @Mapping(target = "exerciseResults", ignore = true)
    @Mapping(target = "removeExerciseResult", ignore = true)
    ListeningExercise toEntity(ListeningExerciseDTO dto);

    @Override
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "chapter", ignore = true)
    @Mapping(target = "options", ignore = true)
    @Mapping(target = "removeOption", ignore = true)
    @Mapping(target = "exerciseResults", ignore = true)
    @Mapping(target = "removeExerciseResult", ignore = true)
    void partialUpdate(@MappingTarget ListeningExercise entity, ListeningExerciseDTO dto);

    @Named("chapterId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ChapterDTO toDtoChapterId(Chapter chapter);
}
