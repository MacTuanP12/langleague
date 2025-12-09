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
 * A Book.
 */
@Entity
@Table(name = "book")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Book implements Serializable {

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
    @Enumerated(EnumType.STRING)
    @Column(name = "level", nullable = false)
    private Level level;

    @Lob
    @Size(max = 5000, message = "Description cannot exceed 5000 characters")
    @Column(name = "description", length = 5000)
    private String description;

    @Size(max = 500)
    @Pattern(
        regexp = "^(https?://.*\\.(jpg|jpeg|png|gif|webp|svg)|/uploads/.*)",
        message = "Thumbnail must be a valid image URL or upload path"
    )
    @Column(name = "thumbnail", length = 500)
    private String thumbnail;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "average_rating")
    private Double averageRating = 0.0;

    @Column(name = "total_reviews")
    private Long totalReviews = 0L;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "book")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
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
    private Set<Chapter> chapters = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "book")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "appUser", "book" }, allowSetters = true)
    private Set<BookReview> bookReviews = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Book id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public Book title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Level getLevel() {
        return this.level;
    }

    public Book level(Level level) {
        this.setLevel(level);
        return this;
    }

    public void setLevel(Level level) {
        this.level = level;
    }

    public String getDescription() {
        return this.description;
    }

    public Book description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getThumbnail() {
        return this.thumbnail;
    }

    public Book thumbnail(String thumbnail) {
        this.setThumbnail(thumbnail);
        return this;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public Boolean getIsActive() {
        return this.isActive;
    }

    public Book isActive(Boolean isActive) {
        this.setIsActive(isActive);
        return this;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Double getAverageRating() {
        return this.averageRating;
    }

    public Book averageRating(Double averageRating) {
        this.setAverageRating(averageRating);
        return this;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public Long getTotalReviews() {
        return this.totalReviews;
    }

    public Book totalReviews(Long totalReviews) {
        this.setTotalReviews(totalReviews);
        return this;
    }

    public void setTotalReviews(Long totalReviews) {
        this.totalReviews = totalReviews;
    }

    public Set<Chapter> getChapters() {
        return this.chapters;
    }

    public void setChapters(Set<Chapter> chapters) {
        if (this.chapters != null) {
            this.chapters.forEach(i -> i.setBook(null));
        }
        if (chapters != null) {
            chapters.forEach(i -> i.setBook(this));
        }
        this.chapters = chapters;
    }

    public Book chapters(Set<Chapter> chapters) {
        this.setChapters(chapters);
        return this;
    }

    public Book addChapter(Chapter chapter) {
        this.chapters.add(chapter);
        chapter.setBook(this);
        return this;
    }

    public Book removeChapter(Chapter chapter) {
        this.chapters.remove(chapter);
        chapter.setBook(null);
        return this;
    }

    public Set<BookReview> getBookReviews() {
        return this.bookReviews;
    }

    public void setBookReviews(Set<BookReview> bookReviews) {
        if (this.bookReviews != null) {
            this.bookReviews.forEach(i -> i.setBook(null));
        }
        if (bookReviews != null) {
            bookReviews.forEach(i -> i.setBook(this));
        }
        this.bookReviews = bookReviews;
    }

    public Book bookReviews(Set<BookReview> bookReviews) {
        this.setBookReviews(bookReviews);
        return this;
    }

    public Book addBookReview(BookReview bookReview) {
        this.bookReviews.add(bookReview);
        bookReview.setBook(this);
        return this;
    }

    public Book removeBookReview(BookReview bookReview) {
        this.bookReviews.remove(bookReview);
        bookReview.setBook(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Book)) {
            return false;
        }
        return getId() != null && getId().equals(((Book) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Book{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", level='" + getLevel() + "'" +
            ", description='" + getDescription() + "'" +
            ", thumbnail='" + getThumbnail() + "'" +
            "}";
    }
}
