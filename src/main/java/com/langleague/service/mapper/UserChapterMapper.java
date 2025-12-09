package com.langleague.service.mapper;

import com.langleague.domain.AppUser;
import com.langleague.domain.Chapter;
import com.langleague.domain.UserChapter;
import com.langleague.service.dto.AppUserDTO;
import com.langleague.service.dto.ChapterDTO;
import com.langleague.service.dto.UserChapterDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link UserChapter} and its DTO {@link UserChapterDTO}.
 */
@Mapper(componentModel = "spring")
public interface UserChapterMapper extends EntityMapper<UserChapterDTO, UserChapter> {
    @Mapping(target = "appUser", source = "appUser", qualifiedByName = "appUserId")
    @Mapping(target = "chapter", source = "chapter", qualifiedByName = "chapterId")
    UserChapterDTO toDto(UserChapter s);

    @Named("appUserId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    AppUserDTO toDtoAppUserId(AppUser appUser);

    @Named("chapterId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "title", source = "title")
    ChapterDTO toDtoChapterId(Chapter chapter);
}
