package com.langleague.service.mapper;

import com.langleague.domain.AppUser;
import com.langleague.domain.Grammar;
import com.langleague.domain.UserGrammar;
import com.langleague.service.dto.AppUserDTO;
import com.langleague.service.dto.GrammarDTO;
import com.langleague.service.dto.UserGrammarDTO;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

/**
 * Mapper for the entity {@link UserGrammar} and its DTO {@link UserGrammarDTO}.
 */
@Mapper(componentModel = "spring")
public interface UserGrammarMapper extends EntityMapper<UserGrammarDTO, UserGrammar> {
    @Mapping(target = "appUser", source = "appUser", qualifiedByName = "appUserId")
    @Mapping(target = "grammar", source = "grammar", qualifiedByName = "grammarId")
    UserGrammarDTO toDto(UserGrammar s);

    @Named("appUserId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    AppUserDTO toDtoAppUserId(AppUser appUser);

    @Named("grammarId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    GrammarDTO toDtoGrammarId(Grammar grammar);
}
