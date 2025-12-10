package com.langleague.service.mapper;

import com.langleague.domain.AppUser;
import com.langleague.domain.UserVocabulary;
import com.langleague.domain.Word;
import com.langleague.service.dto.AppUserDTO;
import com.langleague.service.dto.UserVocabularyDTO;
import com.langleague.service.dto.WordDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link UserVocabulary} and its DTO {@link UserVocabularyDTO}.
 */
@Mapper(componentModel = "spring")
public interface UserVocabularyMapper extends EntityMapper<UserVocabularyDTO, UserVocabulary> {
    @Mapping(target = "appUser", source = "appUser", qualifiedByName = "appUserId")
    // Lesson mapping removed
    // @Mapping(target = "lesson", source = "lesson", qualifiedByName = "lessonId")
    @Mapping(target = "word", source = "word", qualifiedByName = "wordId")
    UserVocabularyDTO toDto(UserVocabulary s);

    @Override
    @Mapping(target = "appUser", ignore = true)
    @Mapping(target = "word", ignore = true)
    @Mapping(target = "easeFactor", ignore = true)
    @Mapping(target = "intervalDays", ignore = true)
    @Mapping(target = "nextReviewDate", ignore = true)
    UserVocabulary toEntity(UserVocabularyDTO dto);

    @Override
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "appUser", ignore = true)
    @Mapping(target = "word", ignore = true)
    @Mapping(target = "easeFactor", ignore = true)
    @Mapping(target = "intervalDays", ignore = true)
    @Mapping(target = "nextReviewDate", ignore = true)
    void partialUpdate(@MappingTarget UserVocabulary entity, UserVocabularyDTO dto);

    @Named("appUserId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    AppUserDTO toDtoAppUserId(AppUser appUser);

    // Lesson mapper method removed
    // @Named("lessonId")
    // @BeanMapping(ignoreByDefault = true)
    // @Mapping(target = "id", source = "id")
    // LessonDTO toDtoLessonId(Lesson lesson);

    @Named("wordId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "text", source = "text")
    @Mapping(target = "meaning", source = "meaning")
    @Mapping(target = "pronunciation", source = "pronunciation")
    @Mapping(target = "partOfSpeech", source = "partOfSpeech")
    @Mapping(target = "imageUrl", source = "imageUrl")
    WordDTO toDtoWordId(Word word);
}
