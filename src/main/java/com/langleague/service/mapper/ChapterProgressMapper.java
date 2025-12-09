package com.langleague.service.mapper;

import com.langleague.domain.AppUser;
import com.langleague.domain.Chapter;
import com.langleague.domain.ChapterProgress;
import com.langleague.service.dto.AppUserDTO;
import com.langleague.service.dto.ChapterDTO;
import com.langleague.service.dto.ChapterProgressDTO;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

/**
 * Mapper for the entity {@link ChapterProgress} and its DTO {@link ChapterProgressDTO}.
 */
@Mapper(componentModel = "spring")
public interface ChapterProgressMapper extends EntityMapper<ChapterProgressDTO, ChapterProgress> {
    @Mapping(target = "appUser", source = "appUser", qualifiedByName = "appUserId")
    @Mapping(target = "chapter", source = "chapter", qualifiedByName = "chapterId")
    ChapterProgressDTO toDto(ChapterProgress s);

    @Named("appUserId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    AppUserDTO toDtoAppUserId(AppUser appUser);

    @Named("chapterId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ChapterDTO toDtoChapterId(Chapter chapter);
}
