package com.langleague.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

/**
 * Test class for the AdminUserDTO.
 */
class AdminUserDTOTest {

    @Test
    void dtoEqualsVerifier() {
        AdminUserDTO userDTO1 = new AdminUserDTO();
        userDTO1.setId(1L);
        AdminUserDTO userDTO2 = new AdminUserDTO();
        assertThat(userDTO1).isNotEqualTo(userDTO2);
        userDTO2.setId(userDTO1.getId());
        assertThat(userDTO1).isEqualTo(userDTO2);
        userDTO2.setId(2L);
        assertThat(userDTO1).isNotEqualTo(userDTO2);
        userDTO1.setId(null);
        assertThat(userDTO1).isNotEqualTo(userDTO2);
    }
}
