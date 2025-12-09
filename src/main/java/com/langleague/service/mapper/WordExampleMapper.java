package com.langleague.service.mapper;

import com.langleague.domain.Word;
import com.langleague.domain.WordExample;
import com.langleague.service.dto.WordDTO;
import com.langleague.service.dto.WordExampleDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link WordExample} and its DTO {@link WordExampleDTO}.
 */
@Mapper(componentModel = "spring")
public interface WordExampleMapper extends EntityMapper<WordExampleDTO, WordExample> {
    @Mapping(target = "word", source = "word", qualifiedByName = "wordId")
    WordExampleDTO toDto(WordExample s);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "word", ignore = true)
    void partialUpdate(@MappingTarget WordExample entity, WordExampleDTO dto);

    @Named("wordId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    WordDTO toDtoWordId(Word word);
}
