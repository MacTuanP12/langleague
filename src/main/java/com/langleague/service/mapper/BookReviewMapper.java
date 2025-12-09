package com.langleague.service.mapper;

import com.langleague.domain.AppUser;
import com.langleague.domain.Book;
import com.langleague.domain.BookReview;
import com.langleague.service.dto.AppUserDTO;
import com.langleague.service.dto.BookDTO;
import com.langleague.service.dto.BookReviewDTO;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

/**
 * Mapper for the entity {@link BookReview} and its DTO {@link BookReviewDTO}.
 */
@Mapper(componentModel = "spring")
public interface BookReviewMapper extends EntityMapper<BookReviewDTO, BookReview> {
    @Mapping(target = "appUser", source = "appUser", qualifiedByName = "appUserId")
    @Mapping(target = "book", source = "book", qualifiedByName = "bookId")
    BookReviewDTO toDto(BookReview s);

    @Named("appUserId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    AppUserDTO toDtoAppUserId(AppUser appUser);

    @Named("bookId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    BookDTO toDtoBookId(Book book);
}
