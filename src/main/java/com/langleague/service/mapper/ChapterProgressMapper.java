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
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;

/**
 * Mapper for the entity {@link ChapterProgress} and its DTO {@link ChapterProgressDTO}.
 */
@Mapper(componentModel = "spring")
public interface ChapterProgressMapper extends EntityMapper<ChapterProgressDTO, ChapterProgress> {
    @Mapping(target = "appUser", source = "appUser", qualifiedByName = "appUserId")
    @Mapping(target = "chapter", source = "chapter", qualifiedByName = "chapterId")
    ChapterProgressDTO toDto(ChapterProgress s);

    @Override
    @Mapping(target = "appUser", ignore = true)
    @Mapping(target = "chapter", ignore = true)
    ChapterProgress toEntity(ChapterProgressDTO dto);

    @Override
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "appUser", ignore = true)
    @Mapping(target = "chapter", ignore = true)
    void partialUpdate(@MappingTarget ChapterProgress entity, ChapterProgressDTO dto);

    @Named("appUserId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    AppUserDTO toDtoAppUserId(AppUser appUser);

    @Named("chapterId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ChapterDTO toDtoChapterId(Chapter chapter);
}
