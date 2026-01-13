package com.langleague.app.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.langleague.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class GrammarDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(GrammarDTO.class);
        GrammarDTO grammarDTO1 = new GrammarDTO();
        grammarDTO1.setId(1L);
        GrammarDTO grammarDTO2 = new GrammarDTO();
        assertThat(grammarDTO1).isNotEqualTo(grammarDTO2);
        grammarDTO2.setId(grammarDTO1.getId());
        assertThat(grammarDTO1).isEqualTo(grammarDTO2);
        grammarDTO2.setId(2L);
        assertThat(grammarDTO1).isNotEqualTo(grammarDTO2);
        grammarDTO1.setId(null);
        assertThat(grammarDTO1).isNotEqualTo(grammarDTO2);
    }
}
