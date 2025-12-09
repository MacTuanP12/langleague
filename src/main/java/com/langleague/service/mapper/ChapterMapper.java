package com.langleague.service.mapper;

import com.langleague.domain.Book;
import com.langleague.domain.Chapter;
import com.langleague.service.dto.BookDTO;
import com.langleague.service.dto.ChapterDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Chapter} and its DTO {@link ChapterDTO}.
 */
@Mapper(componentModel = "spring")
public interface ChapterMapper extends EntityMapper<ChapterDTO, Chapter> {
    @Mapping(target = "book", source = "book", qualifiedByName = "bookId")
    ChapterDTO toDto(Chapter s);

    @Named("bookId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    BookDTO toDtoBookId(Book book);
}
