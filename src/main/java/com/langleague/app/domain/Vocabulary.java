package com.langleague.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Vocabulary.
 */
@Entity
@Table(name = "vocabulary")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Vocabulary implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @NotBlank
    @Size(min = 1, max = 200)
    @Column(name = "word", nullable = false, length = 200)
    private String word;

    @Size(max = 200)
    @Column(name = "phonetic", length = 200)
    private String phonetic;

    @NotNull
    @NotBlank
    @Column(name = "meaning", nullable = false, columnDefinition = "TEXT")
    private String meaning;

    @Lob
    @Column(name = "example")
    private String example;

    @Size(max = 500)
    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @NotNull
    @Min(0)
    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "vocabularies", "grammars", "exercises", "progresses", "book" }, allowSetters = true)
    private Unit unit;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Vocabulary id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getWord() {
        return this.word;
    }

    public Vocabulary word(String word) {
        this.setWord(word);
        return this;
    }

    public void setWord(String word) {
        this.word = word;
    }

    public String getPhonetic() {
        return this.phonetic;
    }

    public Vocabulary phonetic(String phonetic) {
        this.setPhonetic(phonetic);
        return this;
    }

    public void setPhonetic(String phonetic) {
        this.phonetic = phonetic;
    }

    public String getMeaning() {
        return this.meaning;
    }

    public Vocabulary meaning(String meaning) {
        this.setMeaning(meaning);
        return this;
    }

    public void setMeaning(String meaning) {
        this.meaning = meaning;
    }

    public String getExample() {
        return this.example;
    }

    public Vocabulary example(String example) {
        this.setExample(example);
        return this;
    }

    public void setExample(String example) {
        this.example = example;
    }

    public String getImageUrl() {
        return this.imageUrl;
    }

    public Vocabulary imageUrl(String imageUrl) {
        this.setImageUrl(imageUrl);
        return this;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Integer getOrderIndex() {
        return this.orderIndex;
    }

    public Vocabulary orderIndex(Integer orderIndex) {
        this.setOrderIndex(orderIndex);
        return this;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }

    public Unit getUnit() {
        return this.unit;
    }

    public void setUnit(Unit unit) {
        this.unit = unit;
    }

    public Vocabulary unit(Unit unit) {
        this.setUnit(unit);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Vocabulary)) {
            return false;
        }
        return getId() != null && getId().equals(((Vocabulary) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Vocabulary{" +
            "id=" + getId() +
            ", word='" + getWord() + "'" +
            ", phonetic='" + getPhonetic() + "'" +
            ", meaning='" + getMeaning() + "'" +
            ", example='" + getExample() + "'" +
            ", imageUrl='" + getImageUrl() + "'" +
            ", orderIndex=" + getOrderIndex() +
            "}";
    }
}
