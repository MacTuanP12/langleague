package com.langleague.service.mapper;

import com.langleague.domain.AppUser;
import com.langleague.domain.Comment;
import com.langleague.service.dto.AppUserDTO;
import com.langleague.service.dto.CommentDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Comment} and its DTO {@link CommentDTO}.
 */
@Mapper(componentModel = "spring")
public interface CommentMapper extends EntityMapper<CommentDTO, Comment> {
    @Mapping(target = "appUser", source = "appUser", qualifiedByName = "appUserId")
    // Lesson mapping removed
    // @Mapping(target = "lesson", source = "lesson", qualifiedByName = "lessonId")
    CommentDTO toDto(Comment s);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "appUser", ignore = true)
    // @Mapping(target = "lesson", ignore = true)
    void partialUpdate(@MappingTarget Comment entity, CommentDTO dto);

    @Named("appUserId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    AppUserDTO toDtoAppUserId(AppUser appUser);
    // Lesson mapper method removed
    // @Named("lessonId")
    // @BeanMapping(ignoreByDefault = true)
    // @Mapping(target = "id", source = "id")
    // LessonDTO toDtoLessonId(Lesson lesson);
}
