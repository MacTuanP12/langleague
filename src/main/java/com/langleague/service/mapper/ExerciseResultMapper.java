package com.langleague.service.mapper;

import com.langleague.domain.*;
import com.langleague.service.dto.*;
import com.langleague.service.dto.WritingExerciseDTO;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

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
