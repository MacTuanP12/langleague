package com.langleague.service.mapper;

import com.langleague.domain.Book;
import com.langleague.service.dto.BookDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Book} and its DTO {@link BookDTO}.
 */
@Mapper(componentModel = "spring")
public interface BookMapper extends EntityMapper<BookDTO, Book> {
    @Override
    @Mapping(target = "chapters", ignore = true)
    @Mapping(target = "removeChapter", ignore = true)
    @Mapping(target = "bookReviews", ignore = true)
    @Mapping(target = "removeBookReview", ignore = true)
    Book toEntity(BookDTO dto);

    @Override
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "chapters", ignore = true)
    @Mapping(target = "removeChapter", ignore = true)
    @Mapping(target = "bookReviews", ignore = true)
    @Mapping(target = "removeBookReview", ignore = true)
    void partialUpdate(@MappingTarget Book entity, BookDTO dto);
}
