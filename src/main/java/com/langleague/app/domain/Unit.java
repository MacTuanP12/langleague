package com.langleague.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Unit.
 */
@Entity
@Table(name = "unit")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Unit implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @NotBlank
    @Size(min = 1, max = 200)
    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @NotNull
    @Min(0)
    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    @Lob
    @Column(name = "summary")
    private String summary;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "unit")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "unit" }, allowSetters = true)
    private Set<Vocabulary> vocabularies = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "unit")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "unit" }, allowSetters = true)
    private Set<Grammar> grammars = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "unit")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "options", "unit" }, allowSetters = true)
    private Set<Exercise> exercises = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "unit")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "userProfile", "unit" }, allowSetters = true)
    private Set<Progress> progresses = new HashSet<>();

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "enrollments", "units", "teacherProfile" }, allowSetters = true)
    private Book book;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Unit id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public Unit title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getOrderIndex() {
        return this.orderIndex;
    }

    public Unit orderIndex(Integer orderIndex) {
        this.setOrderIndex(orderIndex);
        return this;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }

    public String getSummary() {
        return this.summary;
    }

    public Unit summary(String summary) {
        this.setSummary(summary);
        return this;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public Set<Vocabulary> getVocabularies() {
        return this.vocabularies;
    }

    public void setVocabularies(Set<Vocabulary> vocabularies) {
        if (this.vocabularies != null) {
            this.vocabularies.forEach(i -> i.setUnit(null));
        }
        if (vocabularies != null) {
            vocabularies.forEach(i -> i.setUnit(this));
        }
        this.vocabularies = vocabularies;
    }

    public Unit vocabularies(Set<Vocabulary> vocabularies) {
        this.setVocabularies(vocabularies);
        return this;
    }

    public Unit addVocabularies(Vocabulary vocabulary) {
        this.vocabularies.add(vocabulary);
        vocabulary.setUnit(this);
        return this;
    }

    public Unit removeVocabularies(Vocabulary vocabulary) {
        this.vocabularies.remove(vocabulary);
        vocabulary.setUnit(null);
        return this;
    }

    public Set<Grammar> getGrammars() {
        return this.grammars;
    }

    public void setGrammars(Set<Grammar> grammars) {
        if (this.grammars != null) {
            this.grammars.forEach(i -> i.setUnit(null));
        }
        if (grammars != null) {
            grammars.forEach(i -> i.setUnit(this));
        }
        this.grammars = grammars;
    }

    public Unit grammars(Set<Grammar> grammars) {
        this.setGrammars(grammars);
        return this;
    }

    public Unit addGrammars(Grammar grammar) {
        this.grammars.add(grammar);
        grammar.setUnit(this);
        return this;
    }

    public Unit removeGrammars(Grammar grammar) {
        this.grammars.remove(grammar);
        grammar.setUnit(null);
        return this;
    }

    public Set<Exercise> getExercises() {
        return this.exercises;
    }

    public void setExercises(Set<Exercise> exercises) {
        if (this.exercises != null) {
            this.exercises.forEach(i -> i.setUnit(null));
        }
        if (exercises != null) {
            exercises.forEach(i -> i.setUnit(this));
        }
        this.exercises = exercises;
    }

    public Unit exercises(Set<Exercise> exercises) {
        this.setExercises(exercises);
        return this;
    }

    public Unit addExercises(Exercise exercise) {
        this.exercises.add(exercise);
        exercise.setUnit(this);
        return this;
    }

    public Unit removeExercises(Exercise exercise) {
        this.exercises.remove(exercise);
        exercise.setUnit(null);
        return this;
    }

    public Set<Progress> getProgresses() {
        return this.progresses;
    }

    public void setProgresses(Set<Progress> progresses) {
        if (this.progresses != null) {
            this.progresses.forEach(i -> i.setUnit(null));
        }
        if (progresses != null) {
            progresses.forEach(i -> i.setUnit(this));
        }
        this.progresses = progresses;
    }

    public Unit progresses(Set<Progress> progresses) {
        this.setProgresses(progresses);
        return this;
    }

    public Unit addProgresses(Progress progress) {
        this.progresses.add(progress);
        progress.setUnit(this);
        return this;
    }

    public Unit removeProgresses(Progress progress) {
        this.progresses.remove(progress);
        progress.setUnit(null);
        return this;
    }

    public Book getBook() {
        return this.book;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public Unit book(Book book) {
        this.setBook(book);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Unit)) {
            return false;
        }
        return getId() != null && getId().equals(((Unit) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Unit{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", orderIndex=" + getOrderIndex() +
            ", summary='" + getSummary() + "'" +
            "}";
    }
}
