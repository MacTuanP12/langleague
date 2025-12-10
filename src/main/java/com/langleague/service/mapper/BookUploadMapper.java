package com.langleague.service.mapper;

import com.langleague.domain.AppUser;
import com.langleague.domain.Book;
import com.langleague.domain.BookUpload;
import com.langleague.service.dto.AppUserDTO;
import com.langleague.service.dto.BookDTO;
import com.langleague.service.dto.BookUploadDTO;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;

/**
 * Mapper for the entity {@link BookUpload} and its DTO {@link BookUploadDTO}.
 */
@Mapper(componentModel = "spring")
public interface BookUploadMapper extends EntityMapper<BookUploadDTO, BookUpload> {
    @Mapping(target = "uploadedById", source = "uploadedBy.id")
    @Mapping(target = "uploadedByDisplayName", source = "uploadedBy.displayName")
    @Mapping(target = "createdBookId", source = "createdBook.id")
    @Mapping(target = "createdBookTitle", source = "createdBook.title")
    BookUploadDTO toDto(BookUpload s);

    @Override
    @Mapping(target = "useAI", ignore = true)
    @Mapping(target = "uploadedBy", ignore = true)
    @Mapping(target = "createdBook", ignore = true)
    BookUpload toEntity(BookUploadDTO dto);

    @Override
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "useAI", ignore = true)
    @Mapping(target = "uploadedBy", ignore = true)
    @Mapping(target = "createdBook", ignore = true)
    void partialUpdate(@MappingTarget BookUpload entity, BookUploadDTO dto);

    @Named("uploadedById")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "displayName", source = "displayName")
    AppUserDTO toDtoUploadedById(AppUser appUser);

    @Named("createdBookId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "title", source = "title")
    BookDTO toDtoCreatedBookId(Book book);
}
