package com.langleague.service.mapper;

import com.langleague.domain.Chapter;
import com.langleague.domain.WritingExercise;
import com.langleague.service.dto.ChapterDTO;
import com.langleague.service.dto.WritingExerciseDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link WritingExercise} and its DTO {@link WritingExerciseDTO}.
 */
@Mapper(componentModel = "spring")
public interface WritingExerciseMapper extends EntityMapper<WritingExerciseDTO, WritingExercise> {
    @Mapping(target = "chapter", source = "chapter", qualifiedByName = "chapterId")
    WritingExerciseDTO toDto(WritingExercise s);

    @Named("chapterId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ChapterDTO toDtoChapterId(Chapter chapter);
}
