package com.langleague.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * Vocabulary Definitions
 */
@Entity
@Table(name = "word")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Word implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 255)
    @Column(name = "text", length = 255, nullable = false)
    private String text;

    @Lob
    @Column(name = "meaning")
    private String meaning;

    @Size(max = 255)
    @Column(name = "pronunciation", length = 255)
    private String pronunciation;

    @Size(max = 50)
    @Column(name = "part_of_speech", length = 50)
    private String partOfSpeech;

    @Size(max = 512)
    @Column(name = "image_url", length = 512)
    private String imageUrl;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "word")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "word" }, allowSetters = true)
    private Set<WordExample> wordExamples = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "word")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "appUser", "word" }, allowSetters = true)
    private Set<UserVocabulary> userVocabularies = new HashSet<>();

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

    public Word id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return this.text;
    }

    public Word text(String text) {
        this.setText(text);
        return this;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getMeaning() {
        return this.meaning;
    }

    public Word meaning(String meaning) {
        this.setMeaning(meaning);
        return this;
    }

    public void setMeaning(String meaning) {
        this.meaning = meaning;
    }

    public String getPronunciation() {
        return this.pronunciation;
    }

    public Word pronunciation(String pronunciation) {
        this.setPronunciation(pronunciation);
        return this;
    }

    public void setPronunciation(String pronunciation) {
        this.pronunciation = pronunciation;
    }

    public String getPartOfSpeech() {
        return this.partOfSpeech;
    }

    public Word partOfSpeech(String partOfSpeech) {
        this.setPartOfSpeech(partOfSpeech);
        return this;
    }

    public void setPartOfSpeech(String partOfSpeech) {
        this.partOfSpeech = partOfSpeech;
    }

    public String getImageUrl() {
        return this.imageUrl;
    }

    public Word imageUrl(String imageUrl) {
        this.setImageUrl(imageUrl);
        return this;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Set<WordExample> getWordExamples() {
        return this.wordExamples;
    }

    public void setWordExamples(Set<WordExample> wordExamples) {
        if (this.wordExamples != null) {
            this.wordExamples.forEach(i -> i.setWord(null));
        }
        if (wordExamples != null) {
            wordExamples.forEach(i -> i.setWord(this));
        }
        this.wordExamples = wordExamples;
    }

    public Word wordExamples(Set<WordExample> wordExamples) {
        this.setWordExamples(wordExamples);
        return this;
    }

    public Word addWordExample(WordExample wordExample) {
        this.wordExamples.add(wordExample);
        wordExample.setWord(this);
        return this;
    }

    public Word removeWordExample(WordExample wordExample) {
        this.wordExamples.remove(wordExample);
        wordExample.setWord(null);
        return this;
    }

    public Set<UserVocabulary> getUserVocabularies() {
        return this.userVocabularies;
    }

    public void setUserVocabularies(Set<UserVocabulary> userVocabularies) {
        if (this.userVocabularies != null) {
            this.userVocabularies.forEach(i -> i.setWord(null));
        }
        if (userVocabularies != null) {
            userVocabularies.forEach(i -> i.setWord(this));
        }
        this.userVocabularies = userVocabularies;
    }

    public Word userVocabularies(Set<UserVocabulary> userVocabularies) {
        this.setUserVocabularies(userVocabularies);
        return this;
    }

    public Word addUserVocabulary(UserVocabulary userVocabulary) {
        this.userVocabularies.add(userVocabulary);
        userVocabulary.setWord(this);
        return this;
    }

    public Word removeUserVocabulary(UserVocabulary userVocabulary) {
        this.userVocabularies.remove(userVocabulary);
        userVocabulary.setWord(null);
        return this;
    }

    public Chapter getChapter() {
        return this.chapter;
    }

    public void setChapter(Chapter chapter) {
        this.chapter = chapter;
    }

    public Word chapter(Chapter chapter) {
        this.setChapter(chapter);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Word)) {
            return false;
        }
        return getId() != null && getId().equals(((Word) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Word{" +
            "id=" + getId() +
            ", text='" + getText() + "'" +
            ", meaning='" + getMeaning() + "'" +
            ", pronunciation='" + getPronunciation() + "'" +
            ", partOfSpeech='" + getPartOfSpeech() + "'" +
            ", imageUrl='" + getImageUrl() + "'" +
            "}";
    }
}
