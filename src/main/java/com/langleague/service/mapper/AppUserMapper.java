package com.langleague.service.mapper;

import com.langleague.domain.AppUser;
import com.langleague.domain.User;
import com.langleague.service.dto.AppUserDTO;
import com.langleague.service.dto.UserDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link AppUser} and its DTO {@link AppUserDTO}.
 */
@Mapper(componentModel = "spring")
public interface AppUserMapper extends EntityMapper<AppUserDTO, AppUser> {
    @Mapping(target = "internalUser", source = "internalUser", qualifiedByName = "userId")
    AppUserDTO toDto(AppUser s);

    @Override
    @Mapping(target = "internalUser", source = "internalUser", qualifiedByName = "userFromId")
    @Mapping(target = "timezone", ignore = true)
    @Mapping(target = "userVocabularies", ignore = true)
    @Mapping(target = "removeUserVocabulary", ignore = true)
    @Mapping(target = "userGrammars", ignore = true)
    @Mapping(target = "removeUserGrammar", ignore = true)
    @Mapping(target = "bookReviews", ignore = true)
    @Mapping(target = "removeBookReview", ignore = true)
    @Mapping(target = "comments", ignore = true)
    @Mapping(target = "removeComment", ignore = true)
    @Mapping(target = "exerciseResults", ignore = true)
    @Mapping(target = "removeExerciseResult", ignore = true)
    @Mapping(target = "chapterProgresses", ignore = true)
    @Mapping(target = "removeChapterProgress", ignore = true)
    @Mapping(target = "userAchievements", ignore = true)
    @Mapping(target = "removeUserAchievement", ignore = true)
    @Mapping(target = "learningStreaks", ignore = true)
    @Mapping(target = "removeLearningStreak", ignore = true)
    @Mapping(target = "studySessions", ignore = true)
    @Mapping(target = "removeStudySession", ignore = true)
    AppUser toEntity(AppUserDTO dto);

    @Override
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "internalUser", ignore = true)
    @Mapping(target = "timezone", ignore = true)
    @Mapping(target = "userVocabularies", ignore = true)
    @Mapping(target = "removeUserVocabulary", ignore = true)
    @Mapping(target = "userGrammars", ignore = true)
    @Mapping(target = "removeUserGrammar", ignore = true)
    @Mapping(target = "bookReviews", ignore = true)
    @Mapping(target = "removeBookReview", ignore = true)
    @Mapping(target = "comments", ignore = true)
    @Mapping(target = "removeComment", ignore = true)
    @Mapping(target = "exerciseResults", ignore = true)
    @Mapping(target = "removeExerciseResult", ignore = true)
    @Mapping(target = "chapterProgresses", ignore = true)
    @Mapping(target = "removeChapterProgress", ignore = true)
    @Mapping(target = "userAchievements", ignore = true)
    @Mapping(target = "removeUserAchievement", ignore = true)
    @Mapping(target = "learningStreaks", ignore = true)
    @Mapping(target = "removeLearningStreak", ignore = true)
    @Mapping(target = "studySessions", ignore = true)
    @Mapping(target = "removeStudySession", ignore = true)
    void partialUpdate(@MappingTarget AppUser entity, AppUserDTO dto);

    @Named("userId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    UserDTO toDtoUserId(User user);

    @Named("userFromId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    User userFromId(UserDTO userDTO);
}
