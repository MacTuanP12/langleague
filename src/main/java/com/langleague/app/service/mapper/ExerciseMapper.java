package com.langleague.app.service.mapper;

import com.langleague.app.domain.Exercise;
import com.langleague.app.domain.ExerciseOption;
import com.langleague.app.domain.Unit;
import com.langleague.app.service.dto.ExerciseDTO;
import com.langleague.app.service.dto.ExerciseOptionDTO;
import java.util.List;
import java.util.Set;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Exercise} and its DTO {@link ExerciseDTO}.
 */
@Mapper(componentModel = "spring")
public interface ExerciseMapper extends EntityMapper<ExerciseDTO, Exercise> {
    @Mapping(target = "unitId", source = "unit.id")
    @Mapping(target = "unitTitle", source = "unit.title")
    @Mapping(target = "options", source = "options", qualifiedByName = "optionsWithoutExercise")
    ExerciseDTO toDto(Exercise s);

    @Named("optionsWithoutExercise")
    default List<ExerciseOptionDTO> mapOptionsWithoutExercise(Set<ExerciseOption> options) {
        if (options == null) {
            return null;
        }
        return options
            .stream()
            .map(option -> {
                ExerciseOptionDTO dto = new ExerciseOptionDTO();
                dto.setId(option.getId());
                dto.setOptionText(option.getOptionText());
                dto.setIsCorrect(option.getIsCorrect());
                dto.setOrderIndex(option.getOrderIndex());
                // Do NOT set the exercise field to avoid circular reference
                return dto;
            })
            .sorted((a, b) -> {
                if (a.getOrderIndex() == null) return 1;
                if (b.getOrderIndex() == null) return -1;
                return a.getOrderIndex().compareTo(b.getOrderIndex());
            })
            .toList();
    }

    @Override
    @Mapping(target = "options", ignore = true)
    @Mapping(target = "removeOptions", ignore = true)
    @Mapping(target = "unit", source = "unitId")
    Exercise toEntity(ExerciseDTO exerciseDTO);

    default Unit fromId(Long id) {
        if (id == null) {
            return null;
        }
        Unit unit = new Unit();
        unit.setId(id);
        return unit;
    }
}
