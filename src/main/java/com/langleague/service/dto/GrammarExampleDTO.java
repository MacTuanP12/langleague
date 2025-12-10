package com.langleague.service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.langleague.domain.GrammarExample} entity.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class GrammarExampleDTO implements Serializable {

    private Long id;

    @NotBlank(message = "Example text is required")
    @Size(max = 2000, message = "Example text cannot exceed 2000 characters")
    private String exampleText;

    @Size(max = 2000, message = "Translation cannot exceed 2000 characters")
    private String translation;

    @Size(max = 5000, message = "Explanation cannot exceed 5000 characters")
    private String explanation;

    @NotNull(message = "Grammar is required")
    private GrammarDTO grammar;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getExampleText() {
        return exampleText;
    }

    public void setExampleText(String exampleText) {
        this.exampleText = exampleText;
    }

    public String getTranslation() {
        return translation;
    }

    public void setTranslation(String translation) {
        this.translation = translation;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public GrammarDTO getGrammar() {
        return grammar;
    }

    public void setGrammar(GrammarDTO grammar) {
        this.grammar = grammar;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof GrammarExampleDTO)) {
            return false;
        }

        GrammarExampleDTO grammarExampleDTO = (GrammarExampleDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, grammarExampleDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "GrammarExampleDTO{" +
            "id=" + getId() +
            ", exampleText='" + getExampleText() + "'" +
            ", translation='" + getTranslation() + "'" +
            ", explanation='" + getExplanation() + "'" +
            ", grammar=" + getGrammar() +
            "}";
    }
}
