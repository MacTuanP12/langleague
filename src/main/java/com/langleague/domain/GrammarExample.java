package com.langleague.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A GrammarExample.
 */
@Entity
@Table(name = "grammar_example")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class GrammarExample implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Lob
    @Column(name = "example_text")
    private String exampleText;

    @Lob
    @Column(name = "translation")
    private String translation;

    @Lob
    @Column(name = "explanation")
    private String explanation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "grammarExamples", "userGrammars", "chapter" }, allowSetters = true)
    private Grammar grammar;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public GrammarExample id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getExampleText() {
        return this.exampleText;
    }

    public GrammarExample exampleText(String exampleText) {
        this.setExampleText(exampleText);
        return this;
    }

    public void setExampleText(String exampleText) {
        this.exampleText = exampleText;
    }

    public String getTranslation() {
        return this.translation;
    }

    public GrammarExample translation(String translation) {
        this.setTranslation(translation);
        return this;
    }

    public void setTranslation(String translation) {
        this.translation = translation;
    }

    public String getExplanation() {
        return this.explanation;
    }

    public GrammarExample explanation(String explanation) {
        this.setExplanation(explanation);
        return this;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public Grammar getGrammar() {
        return this.grammar;
    }

    public void setGrammar(Grammar grammar) {
        this.grammar = grammar;
    }

    public GrammarExample grammar(Grammar grammar) {
        this.setGrammar(grammar);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof GrammarExample)) {
            return false;
        }
        return getId() != null && getId().equals(((GrammarExample) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "GrammarExample{" +
            "id=" + getId() +
            ", exampleText='" + getExampleText() + "'" +
            ", translation='" + getTranslation() + "'" +
            ", explanation='" + getExplanation() + "'" +
            "}";
    }
}
