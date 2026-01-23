package com.langleague.app.service.mapper;

import com.langleague.app.domain.Book;
import com.langleague.app.domain.UserProfile;
import com.langleague.app.service.dto.BookDTO;
import com.langleague.app.service.dto.UserProfileDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Book} and its DTO {@link BookDTO}.
 */
@Mapper(componentModel = "spring", uses = { UserMapper.class })
public interface BookMapper extends EntityMapper<BookDTO, Book> {
    @Mapping(target = "teacherProfile", source = "teacherProfile", qualifiedByName = "userProfileId")
    BookDTO toDto(Book s);

    @Named("userProfileId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "user", source = "user")
    UserProfileDTO toDtoUserProfileId(UserProfile userProfile);

    @Named("bookBasic")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "title", source = "title")
    BookDTO toDtoBookBasic(Book book);

    @Override
    @Mapping(target = "enrollments", ignore = true)
    @Mapping(target = "removeEnrollments", ignore = true)
    @Mapping(target = "units", ignore = true)
    @Mapping(target = "removeUnits", ignore = true)
    @Mapping(target = "teacherProfile", source = "teacherProfile")
    Book toEntity(BookDTO bookDTO);
}
