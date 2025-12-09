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
 * A Chapter.
 */
@Entity
@Table(name = "chapter")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Chapter implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 255)
    @Column(name = "title", length = 255, nullable = false)
    private String title;

    @NotNull
    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "chapter")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "wordExamples", "userVocabularies", "chapter" }, allowSetters = true)
    private Set<Word> words = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "chapter")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "grammarExamples", "userGrammars", "chapter" }, allowSetters = true)
    private Set<Grammar> grammars = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "chapter")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "options", "exerciseResults", "chapter" }, allowSetters = true)
    private Set<ListeningExercise> listeningExercises = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "chapter")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "exerciseResults", "chapter" }, allowSetters = true)
    private Set<SpeakingExercise> speakingExercises = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "chapter")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "options", "exerciseResults", "chapter" }, allowSetters = true)
    private Set<ReadingExercise> readingExercises = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "chapter")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "exerciseResults", "chapter" }, allowSetters = true)
    private Set<WritingExercise> writingExercises = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "chapter")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "appUser", "chapter" }, allowSetters = true)
    private Set<ChapterProgress> chapterProgresses = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "chapters", "bookReviews" }, allowSetters = true)
    private Book book;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Chapter id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public Chapter title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getOrderIndex() {
        return this.orderIndex;
    }

    public Chapter orderIndex(Integer orderIndex) {
        this.setOrderIndex(orderIndex);
        return this;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }

    public Set<Word> getWords() {
        return this.words;
    }

    public void setWords(Set<Word> words) {
        if (this.words != null) {
            this.words.forEach(i -> i.setChapter(null));
        }
        if (words != null) {
            words.forEach(i -> i.setChapter(this));
        }
        this.words = words;
    }

    public Chapter words(Set<Word> words) {
        this.setWords(words);
        return this;
    }

    public Chapter addWord(Word word) {
        this.words.add(word);
        word.setChapter(this);
        return this;
    }

    public Chapter removeWord(Word word) {
        this.words.remove(word);
        word.setChapter(null);
        return this;
    }

    public Set<Grammar> getGrammars() {
        return this.grammars;
    }

    public void setGrammars(Set<Grammar> grammars) {
        if (this.grammars != null) {
            this.grammars.forEach(i -> i.setChapter(null));
        }
        if (grammars != null) {
            grammars.forEach(i -> i.setChapter(this));
        }
        this.grammars = grammars;
    }

    public Chapter grammars(Set<Grammar> grammars) {
        this.setGrammars(grammars);
        return this;
    }

    public Chapter addGrammar(Grammar grammar) {
        this.grammars.add(grammar);
        grammar.setChapter(this);
        return this;
    }

    public Chapter removeGrammar(Grammar grammar) {
        this.grammars.remove(grammar);
        grammar.setChapter(null);
        return this;
    }

    public Set<ListeningExercise> getListeningExercises() {
        return this.listeningExercises;
    }

    public void setListeningExercises(Set<ListeningExercise> listeningExercises) {
        if (this.listeningExercises != null) {
            this.listeningExercises.forEach(i -> i.setChapter(null));
        }
        if (listeningExercises != null) {
            listeningExercises.forEach(i -> i.setChapter(this));
        }
        this.listeningExercises = listeningExercises;
    }

    public Chapter listeningExercises(Set<ListeningExercise> listeningExercises) {
        this.setListeningExercises(listeningExercises);
        return this;
    }

    public Chapter addListeningExercise(ListeningExercise listeningExercise) {
        this.listeningExercises.add(listeningExercise);
        listeningExercise.setChapter(this);
        return this;
    }

    public Chapter removeListeningExercise(ListeningExercise listeningExercise) {
        this.listeningExercises.remove(listeningExercise);
        listeningExercise.setChapter(null);
        return this;
    }

    public Set<SpeakingExercise> getSpeakingExercises() {
        return this.speakingExercises;
    }

    public void setSpeakingExercises(Set<SpeakingExercise> speakingExercises) {
        if (this.speakingExercises != null) {
            this.speakingExercises.forEach(i -> i.setChapter(null));
        }
        if (speakingExercises != null) {
            speakingExercises.forEach(i -> i.setChapter(this));
        }
        this.speakingExercises = speakingExercises;
    }

    public Chapter speakingExercises(Set<SpeakingExercise> speakingExercises) {
        this.setSpeakingExercises(speakingExercises);
        return this;
    }

    public Chapter addSpeakingExercise(SpeakingExercise speakingExercise) {
        this.speakingExercises.add(speakingExercise);
        speakingExercise.setChapter(this);
        return this;
    }

    public Chapter removeSpeakingExercise(SpeakingExercise speakingExercise) {
        this.speakingExercises.remove(speakingExercise);
        speakingExercise.setChapter(null);
        return this;
    }

    public Set<ReadingExercise> getReadingExercises() {
        return this.readingExercises;
    }

    public void setReadingExercises(Set<ReadingExercise> readingExercises) {
        if (this.readingExercises != null) {
            this.readingExercises.forEach(i -> i.setChapter(null));
        }
        if (readingExercises != null) {
            readingExercises.forEach(i -> i.setChapter(this));
        }
        this.readingExercises = readingExercises;
    }

    public Chapter readingExercises(Set<ReadingExercise> readingExercises) {
        this.setReadingExercises(readingExercises);
        return this;
    }

    public Chapter addReadingExercise(ReadingExercise readingExercise) {
        this.readingExercises.add(readingExercise);
        readingExercise.setChapter(this);
        return this;
    }

    public Chapter removeReadingExercise(ReadingExercise readingExercise) {
        this.readingExercises.remove(readingExercise);
        readingExercise.setChapter(null);
        return this;
    }

    public Set<WritingExercise> getWritingExercises() {
        return this.writingExercises;
    }

    public void setWritingExercises(Set<WritingExercise> writingExercises) {
        if (this.writingExercises != null) {
            this.writingExercises.forEach(i -> i.setChapter(null));
        }
        if (writingExercises != null) {
            writingExercises.forEach(i -> i.setChapter(this));
        }
        this.writingExercises = writingExercises;
    }

    public Chapter writingExercises(Set<WritingExercise> writingExercises) {
        this.setWritingExercises(writingExercises);
        return this;
    }

    public Chapter addWritingExercise(WritingExercise writingExercise) {
        this.writingExercises.add(writingExercise);
        writingExercise.setChapter(this);
        return this;
    }

    public Chapter removeWritingExercise(WritingExercise writingExercise) {
        this.writingExercises.remove(writingExercise);
        writingExercise.setChapter(null);
        return this;
    }

    public Set<ChapterProgress> getChapterProgresses() {
        return this.chapterProgresses;
    }

    public void setChapterProgresses(Set<ChapterProgress> chapterProgresses) {
        if (this.chapterProgresses != null) {
            this.chapterProgresses.forEach(i -> i.setChapter(null));
        }
        if (chapterProgresses != null) {
            chapterProgresses.forEach(i -> i.setChapter(this));
        }
        this.chapterProgresses = chapterProgresses;
    }

    public Chapter chapterProgresses(Set<ChapterProgress> chapterProgresses) {
        this.setChapterProgresses(chapterProgresses);
        return this;
    }

    public Chapter addChapterProgress(ChapterProgress chapterProgress) {
        this.chapterProgresses.add(chapterProgress);
        chapterProgress.setChapter(this);
        return this;
    }

    public Chapter removeChapterProgress(ChapterProgress chapterProgress) {
        this.chapterProgresses.remove(chapterProgress);
        chapterProgress.setChapter(null);
        return this;
    }

    public Book getBook() {
        return this.book;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public Chapter book(Book book) {
        this.setBook(book);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Chapter)) {
            return false;
        }
        return getId() != null && getId().equals(((Chapter) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Chapter{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", orderIndex=" + getOrderIndex() +
            "}";
    }
}
