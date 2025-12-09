package com.langleague.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

/**
 * Test class for the User entity.
 */
class UserTest {

    @Test
    void equalsVerifier() {
        User user1 = new User();
        user1.setId(1L);
        user1.setLogin("user1");
        User user2 = new User();
        user2.setId(user1.getId());
        user2.setLogin(user1.getLogin());
        assertThat(user1).isEqualTo(user2);
        user2.setId(2L);
        assertThat(user1).isNotEqualTo(user2);
        user1.setId(null);
        assertThat(user1).isNotEqualTo(user2);
    }
}
