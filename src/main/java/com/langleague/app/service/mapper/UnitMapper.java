package com.langleague.app.service.mapper;

import com.langleague.app.domain.Book;
import com.langleague.app.domain.Unit;
import com.langleague.app.service.dto.BookDTO;
import com.langleague.app.service.dto.UnitDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Unit} and its DTO {@link UnitDTO}.
 */
@Mapper(componentModel = "spring")
public interface UnitMapper extends EntityMapper<UnitDTO, Unit> {
    @Mapping(target = "book", source = "book", qualifiedByName = "bookId")
    UnitDTO toDto(Unit s);

    @Named("bookId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    BookDTO toDtoBookId(Book book);

    @Override
    @Mapping(target = "vocabularies", ignore = true)
    @Mapping(target = "removeVocabularies", ignore = true)
    @Mapping(target = "grammars", ignore = true)
    @Mapping(target = "removeGrammars", ignore = true)
    @Mapping(target = "exercises", ignore = true)
    @Mapping(target = "removeExercises", ignore = true)
    @Mapping(target = "progresses", ignore = true)
    @Mapping(target = "removeProgresses", ignore = true)
    @Mapping(target = "book", source = "book")
    Unit toEntity(UnitDTO unitDTO);
}
