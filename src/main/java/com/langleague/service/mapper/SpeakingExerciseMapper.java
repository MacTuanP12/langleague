package com.langleague.service.mapper;

import com.langleague.domain.Chapter;
import com.langleague.domain.SpeakingExercise;
import com.langleague.service.dto.ChapterDTO;
import com.langleague.service.dto.SpeakingExerciseDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link SpeakingExercise} and its DTO {@link SpeakingExerciseDTO}.
 */
@Mapper(componentModel = "spring")
public interface SpeakingExerciseMapper extends EntityMapper<SpeakingExerciseDTO, SpeakingExercise> {
    @Mapping(target = "chapter", source = "chapter", qualifiedByName = "chapterId")
    SpeakingExerciseDTO toDto(SpeakingExercise s);

    @Named("chapterId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ChapterDTO toDtoChapterId(Chapter chapter);
}
