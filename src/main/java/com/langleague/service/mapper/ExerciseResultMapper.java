package com.langleague.service.mapper;

import com.langleague.domain.*;
import com.langleague.service.dto.*;
import com.langleague.service.dto.WritingExerciseDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link ExerciseResult} and its DTO {@link ExerciseResultDTO}.
 */
@Mapper(componentModel = "spring")
public interface ExerciseResultMapper extends EntityMapper<ExerciseResultDTO, ExerciseResult> {
    @Mapping(target = "appUser", source = "appUser", qualifiedByName = "appUserId")
    @Mapping(target = "listeningExercise", source = "listeningExercise", qualifiedByName = "listeningExerciseId")
    @Mapping(target = "speakingExercise", source = "speakingExercise", qualifiedByName = "speakingExerciseId")
    @Mapping(target = "readingExercise", source = "readingExercise", qualifiedByName = "readingExerciseId")
    @Mapping(target = "writingExercise", source = "writingExercise", qualifiedByName = "writingExerciseId")
    ExerciseResultDTO toDto(ExerciseResult s);

    @Override
    @Mapping(target = "appUser", ignore = true)
    @Mapping(target = "listeningExercise", ignore = true)
    @Mapping(target = "speakingExercise", ignore = true)
    @Mapping(target = "readingExercise", ignore = true)
    @Mapping(target = "writingExercise", ignore = true)
    ExerciseResult toEntity(ExerciseResultDTO dto);

    @Override
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "appUser", ignore = true)
    @Mapping(target = "listeningExercise", ignore = true)
    @Mapping(target = "speakingExercise", ignore = true)
    @Mapping(target = "readingExercise", ignore = true)
    @Mapping(target = "writingExercise", ignore = true)
    void partialUpdate(@MappingTarget ExerciseResult entity, ExerciseResultDTO dto);

    @Named("appUserId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    AppUserDTO toDtoAppUserId(AppUser appUser);

    @Named("listeningExerciseId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ListeningExerciseDTO toDtoListeningExerciseId(ListeningExercise listeningExercise);

    @Named("speakingExerciseId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    SpeakingExerciseDTO toDtoSpeakingExerciseId(SpeakingExercise speakingExercise);

    @Named("readingExerciseId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ReadingExerciseDTO toDtoReadingExerciseId(ReadingExercise readingExercise);

    @Named("writingExerciseId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    WritingExerciseDTO toDtoWritingExerciseId(WritingExercise writingExercise);
}
