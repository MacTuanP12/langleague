package com.langleague.service.dto;

import java.io.Serializable;

/**
 * A DTO for grammar statistics.
 */
public class GrammarStatisticsDTO implements Serializable {

    private Long totalGrammars;
    private Long memorizedGrammars;

    public GrammarStatisticsDTO() {}

    public GrammarStatisticsDTO(Long totalGrammars, Long memorizedGrammars) {
        this.totalGrammars = totalGrammars;
        this.memorizedGrammars = memorizedGrammars;
    }

    public Long getTotalGrammars() {
        return totalGrammars;
    }

    public void setTotalGrammars(Long totalGrammars) {
        this.totalGrammars = totalGrammars;
    }

    public Long getMemorizedGrammars() {
        return memorizedGrammars;
    }

    public void setMemorizedGrammars(Long memorizedGrammars) {
        this.memorizedGrammars = memorizedGrammars;
    }

    @Override
    public String toString() {
        return "GrammarStatisticsDTO{" + "totalGrammars=" + totalGrammars + ", memorizedGrammars=" + memorizedGrammars + '}';
    }
}
