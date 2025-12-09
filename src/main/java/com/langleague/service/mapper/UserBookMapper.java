package com.langleague.service.mapper;

import com.langleague.domain.AppUser;
import com.langleague.domain.Book;
import com.langleague.domain.UserBook;
import com.langleague.service.dto.AppUserDTO;
import com.langleague.service.dto.BookDTO;
import com.langleague.service.dto.UserBookDTO;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

/**
 * Mapper for the entity {@link UserBook} and its DTO {@link UserBookDTO}.
 */
@Mapper(componentModel = "spring")
public interface UserBookMapper extends EntityMapper<UserBookDTO, UserBook> {
    @Mapping(target = "appUserId", source = "appUser.id")
    @Mapping(target = "appUserDisplayName", source = "appUser.displayName")
    @Mapping(target = "bookId", source = "book.id")
    @Mapping(target = "bookTitle", source = "book.title")
    @Mapping(target = "bookThumbnail", source = "book.thumbnail")
    @Mapping(target = "bookLevel", source = "book.level")
    @Mapping(target = "bookDescription", source = "book.description")
    UserBookDTO toDto(UserBook s);

    @Named("appUserId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "displayName", source = "displayName")
    AppUserDTO toDtoAppUserId(AppUser appUser);

    @Named("bookId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "title", source = "title")
    @Mapping(target = "thumbnail", source = "thumbnail")
    @Mapping(target = "level", source = "level")
    @Mapping(target = "description", source = "description")
    BookDTO toDtoBookId(Book book);
}
