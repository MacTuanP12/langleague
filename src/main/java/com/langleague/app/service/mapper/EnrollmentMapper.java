package com.langleague.app.service.mapper;

import com.langleague.app.domain.Book;
import com.langleague.app.domain.Enrollment;
import com.langleague.app.domain.UserProfile;
import com.langleague.app.service.dto.BookDTO;
import com.langleague.app.service.dto.EnrollmentDTO;
import com.langleague.app.service.dto.UserProfileDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Enrollment} and its DTO {@link EnrollmentDTO}.
 */
@Mapper(componentModel = "spring")
public interface EnrollmentMapper extends EntityMapper<EnrollmentDTO, Enrollment> {
    @Mapping(target = "userProfile", source = "userProfile", qualifiedByName = "userProfileId")
    @Mapping(target = "book", source = "book", qualifiedByName = "bookId")
    EnrollmentDTO toDto(Enrollment s);

    @Named("userProfileId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    UserProfileDTO toDtoUserProfileId(UserProfile userProfile);

    @Named("bookId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "title", source = "title")
    @Mapping(target = "description", source = "description")
    @Mapping(target = "coverImageUrl", source = "coverImageUrl")
    @Mapping(target = "isPublic", source = "isPublic")
    BookDTO toDtoBookId(Book book);

    @Override
    @Mapping(target = "userProfile", source = "userProfile")
    @Mapping(target = "book", source = "book")
    Enrollment toEntity(EnrollmentDTO enrollmentDTO);
}
