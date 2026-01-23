package com.langleague.app.service.mapper;

import com.langleague.app.domain.Exercise;
import com.langleague.app.domain.ExerciseOption;
import com.langleague.app.service.dto.ExerciseDTO;
import com.langleague.app.service.dto.ExerciseOptionDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link ExerciseOption} and its DTO {@link ExerciseOptionDTO}.
 */
@Mapper(componentModel = "spring")
public interface ExerciseOptionMapper extends EntityMapper<ExerciseOptionDTO, ExerciseOption> {
    @Mapping(target = "exercise", source = "exercise", qualifiedByName = "exerciseId")
    ExerciseOptionDTO toDto(ExerciseOption s);

    @Named("exerciseId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ExerciseDTO toDtoExerciseId(Exercise exercise);

    @Override
    @Mapping(target = "exercise", source = "exercise", qualifiedByName = "exerciseIdToEntity")
    ExerciseOption toEntity(ExerciseOptionDTO exerciseOptionDTO);

    @Named("exerciseIdToEntity")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    Exercise toEntityExerciseId(ExerciseDTO exerciseDTO);
}
