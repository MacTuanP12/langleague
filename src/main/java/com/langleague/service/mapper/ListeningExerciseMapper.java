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

    @Named("chapterId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ChapterDTO toDtoChapterId(Chapter chapter);
}
