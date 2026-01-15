package com.langleague.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.langleague.app.domain.enumeration.ExerciseType;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Exercise.
 */
@Entity
@Table(name = "exercise")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Exercise implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Lob
    @Column(name = "exercise_text", nullable = false)
    private String exerciseText;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "exercise_type", nullable = false)
    private ExerciseType exerciseType;

    @Lob
    @Column(name = "correct_answer_raw")
    private String correctAnswerRaw;

    @Size(max = 500)
    @Column(name = "audio_url", length = 500)
    private String audioUrl;

    @Size(max = 500)
    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @NotNull
    @Min(0)
    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "exercise")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "exercise" }, allowSetters = true)
    private Set<ExerciseOption> options = new HashSet<>();

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "vocabularies", "grammars", "exercises", "progresses", "book" }, allowSetters = true)
    private Unit unit;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Exercise id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getExerciseText() {
        return this.exerciseText;
    }

    public Exercise exerciseText(String exerciseText) {
        this.setExerciseText(exerciseText);
        return this;
    }

    public void setExerciseText(String exerciseText) {
        this.exerciseText = exerciseText;
    }

    public ExerciseType getExerciseType() {
        return this.exerciseType;
    }

    public Exercise exerciseType(ExerciseType exerciseType) {
        this.setExerciseType(exerciseType);
        return this;
    }

    public void setExerciseType(ExerciseType exerciseType) {
        this.exerciseType = exerciseType;
    }

    public String getCorrectAnswerRaw() {
        return this.correctAnswerRaw;
    }

    public Exercise correctAnswerRaw(String correctAnswerRaw) {
        this.setCorrectAnswerRaw(correctAnswerRaw);
        return this;
    }

    public void setCorrectAnswerRaw(String correctAnswerRaw) {
        this.correctAnswerRaw = correctAnswerRaw;
    }

    public String getAudioUrl() {
        return this.audioUrl;
    }

    public Exercise audioUrl(String audioUrl) {
        this.setAudioUrl(audioUrl);
        return this;
    }

    public void setAudioUrl(String audioUrl) {
        this.audioUrl = audioUrl;
    }

    public String getImageUrl() {
        return this.imageUrl;
    }

    public Exercise imageUrl(String imageUrl) {
        this.setImageUrl(imageUrl);
        return this;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Integer getOrderIndex() {
        return this.orderIndex;
    }

    public Exercise orderIndex(Integer orderIndex) {
        this.setOrderIndex(orderIndex);
        return this;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }

    public Set<ExerciseOption> getOptions() {
        return this.options;
    }

    public void setOptions(Set<ExerciseOption> exerciseOptions) {
        if (this.options != null) {
            this.options.forEach(i -> i.setExercise(null));
        }
        if (exerciseOptions != null) {
            exerciseOptions.forEach(i -> i.setExercise(this));
        }
        this.options = exerciseOptions;
    }

    public Exercise options(Set<ExerciseOption> exerciseOptions) {
        this.setOptions(exerciseOptions);
        return this;
    }

    public Exercise addOptions(ExerciseOption exerciseOption) {
        this.options.add(exerciseOption);
        exerciseOption.setExercise(this);
        return this;
    }

    public Exercise removeOptions(ExerciseOption exerciseOption) {
        this.options.remove(exerciseOption);
        exerciseOption.setExercise(null);
        return this;
    }

    public Unit getUnit() {
        return this.unit;
    }

    public void setUnit(Unit unit) {
        this.unit = unit;
    }

    public Exercise unit(Unit unit) {
        this.setUnit(unit);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Exercise)) {
            return false;
        }
        return getId() != null && getId().equals(((Exercise) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Exercise{" +
            "id=" + getId() +
            ", exerciseText='" + getExerciseText() + "'" +
            ", exerciseType='" + getExerciseType() + "'" +
            ", correctAnswerRaw='" + getCorrectAnswerRaw() + "'" +
            ", audioUrl='" + getAudioUrl() + "'" +
            ", imageUrl='" + getImageUrl() + "'" +
            ", orderIndex=" + getOrderIndex() +
            "}";
    }
}
