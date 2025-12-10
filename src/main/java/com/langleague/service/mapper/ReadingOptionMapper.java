package com.langleague.service.mapper;

import com.langleague.domain.ReadingExercise;
import com.langleague.domain.ReadingOption;
import com.langleague.service.dto.ReadingExerciseDTO;
import com.langleague.service.dto.ReadingOptionDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link ReadingOption} and its DTO {@link ReadingOptionDTO}.
 */
@Mapper(componentModel = "spring")
public interface ReadingOptionMapper extends EntityMapper<ReadingOptionDTO, ReadingOption> {
    @Mapping(target = "readingExercise", source = "readingExercise", qualifiedByName = "readingExerciseId")
    ReadingOptionDTO toDto(ReadingOption s);

    @Override
    @Mapping(target = "readingExercise", ignore = true)
    ReadingOption toEntity(ReadingOptionDTO dto);

    @Override
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "readingExercise", ignore = true)
    void partialUpdate(@MappingTarget ReadingOption entity, ReadingOptionDTO dto);

    @Named("readingExerciseId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ReadingExerciseDTO toDtoReadingExerciseId(ReadingExercise readingExercise);
}
