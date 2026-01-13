package com.langleague.app.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.langleague.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ExerciseOptionDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ExerciseOptionDTO.class);
        ExerciseOptionDTO exerciseOptionDTO1 = new ExerciseOptionDTO();
        exerciseOptionDTO1.setId(1L);
        ExerciseOptionDTO exerciseOptionDTO2 = new ExerciseOptionDTO();
        assertThat(exerciseOptionDTO1).isNotEqualTo(exerciseOptionDTO2);
        exerciseOptionDTO2.setId(exerciseOptionDTO1.getId());
        assertThat(exerciseOptionDTO1).isEqualTo(exerciseOptionDTO2);
        exerciseOptionDTO2.setId(2L);
        assertThat(exerciseOptionDTO1).isNotEqualTo(exerciseOptionDTO2);
        exerciseOptionDTO1.setId(null);
        assertThat(exerciseOptionDTO1).isNotEqualTo(exerciseOptionDTO2);
    }
}
