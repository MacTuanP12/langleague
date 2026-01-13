package com.langleague.app.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.langleague.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class VocabularyDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(VocabularyDTO.class);
        VocabularyDTO vocabularyDTO1 = new VocabularyDTO();
        vocabularyDTO1.setId(1L);
        VocabularyDTO vocabularyDTO2 = new VocabularyDTO();
        assertThat(vocabularyDTO1).isNotEqualTo(vocabularyDTO2);
        vocabularyDTO2.setId(vocabularyDTO1.getId());
        assertThat(vocabularyDTO1).isEqualTo(vocabularyDTO2);
        vocabularyDTO2.setId(2L);
        assertThat(vocabularyDTO1).isNotEqualTo(vocabularyDTO2);
        vocabularyDTO1.setId(null);
        assertThat(vocabularyDTO1).isNotEqualTo(vocabularyDTO2);
    }
}
