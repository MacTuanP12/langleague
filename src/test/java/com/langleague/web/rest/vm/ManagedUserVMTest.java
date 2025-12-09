package com.langleague.web.rest.vm;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

/**
 * Test class for the ManagedUserVM view model.
 */
class ManagedUserVMTest {

    @Test
    void equalsVerifier() {
        ManagedUserVM managedUserVM1 = new ManagedUserVM();
        managedUserVM1.setId(1L);
        ManagedUserVM managedUserVM2 = new ManagedUserVM();
        managedUserVM2.setId(managedUserVM1.getId());
        assertThat(managedUserVM1).isEqualTo(managedUserVM2);
        managedUserVM2.setId(2L);
        assertThat(managedUserVM1).isNotEqualTo(managedUserVM2);
        managedUserVM1.setId(null);
        assertThat(managedUserVM1).isNotEqualTo(managedUserVM2);
    }
}
