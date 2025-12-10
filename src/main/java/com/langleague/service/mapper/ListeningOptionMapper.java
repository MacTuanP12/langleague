package com.langleague.service.mapper;

import com.langleague.domain.ListeningExercise;
import com.langleague.domain.ListeningOption;
import com.langleague.service.dto.ListeningExerciseDTO;
import com.langleague.service.dto.ListeningOptionDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link ListeningOption} and its DTO {@link ListeningOptionDTO}.
 */
@Mapper(componentModel = "spring")
public interface ListeningOptionMapper extends EntityMapper<ListeningOptionDTO, ListeningOption> {
    @Mapping(target = "listeningExercise", source = "listeningExercise", qualifiedByName = "listeningExerciseId")
    ListeningOptionDTO toDto(ListeningOption s);

    @Override
    @Mapping(target = "listeningExercise", ignore = true)
    ListeningOption toEntity(ListeningOptionDTO dto);

    @Override
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "listeningExercise", ignore = true)
    void partialUpdate(@MappingTarget ListeningOption entity, ListeningOptionDTO dto);

    @Named("listeningExerciseId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ListeningExerciseDTO toDtoListeningExerciseId(ListeningExercise listeningExercise);
}
