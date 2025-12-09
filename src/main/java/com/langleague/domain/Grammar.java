package com.langleague.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.langleague.domain.enumeration.Level;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Grammar.
 */
@Entity
@Table(name = "grammar")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Grammar implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 255)
    @Column(name = "title", length = 255, nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(name = "level")
    private Level level;

    @Lob
    @Column(name = "description")
    private String description;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "grammar")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "grammar" }, allowSetters = true)
    private Set<GrammarExample> grammarExamples = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "grammar")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "appUser", "grammar" }, allowSetters = true)
    private Set<UserGrammar> userGrammars = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(
        value = {
            "words",
            "grammars",
            "listeningExercises",
            "speakingExercises",
            "readingExercises",
            "writingExercises",
            "chapterProgresses",
            "book",
        },
        allowSetters = true
    )
    private Chapter chapter;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Grammar id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public Grammar title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Level getLevel() {
        return this.level;
    }

    public Grammar level(Level level) {
        this.setLevel(level);
        return this;
    }

    public void setLevel(Level level) {
        this.level = level;
    }

    public String getDescription() {
        return this.description;
    }

    public Grammar description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<GrammarExample> getGrammarExamples() {
        return this.grammarExamples;
    }

    public void setGrammarExamples(Set<GrammarExample> grammarExamples) {
        if (this.grammarExamples != null) {
            this.grammarExamples.forEach(i -> i.setGrammar(null));
        }
        if (grammarExamples != null) {
            grammarExamples.forEach(i -> i.setGrammar(this));
        }
        this.grammarExamples = grammarExamples;
    }

    public Grammar grammarExamples(Set<GrammarExample> grammarExamples) {
        this.setGrammarExamples(grammarExamples);
        return this;
    }

    public Grammar addGrammarExample(GrammarExample grammarExample) {
        this.grammarExamples.add(grammarExample);
        grammarExample.setGrammar(this);
        return this;
    }

    public Grammar removeGrammarExample(GrammarExample grammarExample) {
        this.grammarExamples.remove(grammarExample);
        grammarExample.setGrammar(null);
        return this;
    }

    public Set<UserGrammar> getUserGrammars() {
        return this.userGrammars;
    }

    public void setUserGrammars(Set<UserGrammar> userGrammars) {
        if (this.userGrammars != null) {
            this.userGrammars.forEach(i -> i.setGrammar(null));
        }
        if (userGrammars != null) {
            userGrammars.forEach(i -> i.setGrammar(this));
        }
        this.userGrammars = userGrammars;
    }

    public Grammar userGrammars(Set<UserGrammar> userGrammars) {
        this.setUserGrammars(userGrammars);
        return this;
    }

    public Grammar addUserGrammar(UserGrammar userGrammar) {
        this.userGrammars.add(userGrammar);
        userGrammar.setGrammar(this);
        return this;
    }

    public Grammar removeUserGrammar(UserGrammar userGrammar) {
        this.userGrammars.remove(userGrammar);
        userGrammar.setGrammar(null);
        return this;
    }

    public Chapter getChapter() {
        return this.chapter;
    }

    public void setChapter(Chapter chapter) {
        this.chapter = chapter;
    }

    public Grammar chapter(Chapter chapter) {
        this.setChapter(chapter);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Grammar)) {
            return false;
        }
        return getId() != null && getId().equals(((Grammar) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Grammar{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", level='" + getLevel() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
