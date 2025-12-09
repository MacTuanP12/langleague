package com.langleague.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import com.langleague.domain.User;
import com.langleague.service.dto.UserDTO;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

/**
 * Test class for the UserMapper.
 * Tests the named mapping methods used by MapStruct mappers.
 */
class UserMapperTest {

    private static final String DEFAULT_LOGIN = "johndoe";
    private static final Long DEFAULT_ID = 1L;

    private UserMapper userMapper;
    private User user;

    @BeforeEach
    public void init() {
        userMapper = new UserMapper();
        user = new User();
        user.setId(DEFAULT_ID);
        user.setLogin(DEFAULT_LOGIN);
        user.setPassword("password");
        user.setActivated(true);
        user.setEmail("johndoe@localhost");
        user.setFirstName("john");
        user.setLastName("doe");
        user.setImageUrl("image_url");
        user.setLangKey("en");
    }

    @Test
    void toDtoIdShouldMapOnlyIdField() {
        UserDTO userDTO = userMapper.toDtoId(user);

        assertThat(userDTO).isNotNull();
        assertThat(userDTO.getId()).isEqualTo(DEFAULT_ID);
        assertThat(userDTO.getLogin()).isNull();
    }

    @Test
    void toDtoIdWithNullShouldReturnNull() {
        UserDTO userDTO = userMapper.toDtoId(null);

        assertThat(userDTO).isNull();
    }

    @Test
    void toDtoIdSetShouldMapMultipleUsers() {
        User user2 = new User();
        user2.setId(2L);
        user2.setLogin("janedoe");

        Set<User> users = new HashSet<>();
        users.add(user);
        users.add(user2);

        Set<UserDTO> userDTOs = userMapper.toDtoIdSet(users);

        assertThat(userDTOs).isNotEmpty().hasSize(2);
        assertThat(userDTOs).extracting(UserDTO::getId).containsExactlyInAnyOrder(1L, 2L);
    }

    @Test
    void toDtoIdSetWithNullShouldReturnEmptySet() {
        Set<UserDTO> userDTOs = userMapper.toDtoIdSet(null);

        assertThat(userDTOs).isNotNull().isEmpty();
    }

    @Test
    void toDtoLoginShouldMapIdAndLoginFields() {
        UserDTO userDTO = userMapper.toDtoLogin(user);

        assertThat(userDTO).isNotNull();
        assertThat(userDTO.getId()).isEqualTo(DEFAULT_ID);
        assertThat(userDTO.getLogin()).isEqualTo(DEFAULT_LOGIN);
    }

    @Test
    void toDtoLoginWithNullShouldReturnNull() {
        UserDTO userDTO = userMapper.toDtoLogin(null);

        assertThat(userDTO).isNull();
    }

    @Test
    void toDtoLoginSetShouldMapMultipleUsers() {
        User user2 = new User();
        user2.setId(2L);
        user2.setLogin("janedoe");

        Set<User> users = new HashSet<>();
        users.add(user);
        users.add(user2);

        Set<UserDTO> userDTOs = userMapper.toDtoLoginSet(users);

        assertThat(userDTOs).isNotEmpty().hasSize(2);
        assertThat(userDTOs).extracting(UserDTO::getId).containsExactlyInAnyOrder(1L, 2L);
        assertThat(userDTOs).extracting(UserDTO::getLogin).containsExactlyInAnyOrder(DEFAULT_LOGIN, "janedoe");
    }

    @Test
    void toDtoLoginSetWithNullShouldReturnEmptySet() {
        Set<UserDTO> userDTOs = userMapper.toDtoLoginSet(null);

        assertThat(userDTOs).isNotNull().isEmpty();
    }

    @Test
    void userFromIdShouldCreateUserWithId() {
        User user = userMapper.userFromId(DEFAULT_ID);

        assertThat(user).isNotNull();
        assertThat(user.getId()).isEqualTo(DEFAULT_ID);
    }

    @Test
    void userFromIdWithNullShouldReturnNull() {
        User user = userMapper.userFromId(null);

        assertThat(user).isNull();
    }
}
