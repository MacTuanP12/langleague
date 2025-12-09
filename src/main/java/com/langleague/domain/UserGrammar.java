package com.langleague.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * User grammar progress
 */
@Entity
@Table(name = "user_grammar")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UserGrammar implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "remembered")
    private Boolean remembered;

    @Column(name = "is_memorized")
    private Boolean isMemorized;

    @Column(name = "last_reviewed")
    private Instant lastReviewed;

    @Column(name = "review_count")
    private Integer reviewCount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(
        value = {
            "internalUser",
            "userVocabularies",
            "userGrammars",
            "bookReviews",
            "comments",
            "exerciseResults",
            "chapterProgresses",
            "userAchievements",
            "learningStreaks",
            "studySessions",
        },
        allowSetters = true
    )
    private AppUser appUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "grammarExamples", "userGrammars", "chapter" }, allowSetters = true)
    private Grammar grammar;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public UserGrammar id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getRemembered() {
        return this.remembered;
    }

    public UserGrammar remembered(Boolean remembered) {
        this.setRemembered(remembered);
        return this;
    }

    public void setRemembered(Boolean remembered) {
        this.remembered = remembered;
    }

    public Boolean getIsMemorized() {
        return this.isMemorized;
    }

    public UserGrammar isMemorized(Boolean isMemorized) {
        this.setIsMemorized(isMemorized);
        return this;
    }

    public void setIsMemorized(Boolean isMemorized) {
        this.isMemorized = isMemorized;
    }

    public Instant getLastReviewed() {
        return this.lastReviewed;
    }

    public UserGrammar lastReviewed(Instant lastReviewed) {
        this.setLastReviewed(lastReviewed);
        return this;
    }

    public void setLastReviewed(Instant lastReviewed) {
        this.lastReviewed = lastReviewed;
    }

    public Integer getReviewCount() {
        return this.reviewCount;
    }

    public UserGrammar reviewCount(Integer reviewCount) {
        this.setReviewCount(reviewCount);
        return this;
    }

    public void setReviewCount(Integer reviewCount) {
        this.reviewCount = reviewCount;
    }

    public AppUser getAppUser() {
        return this.appUser;
    }

    public void setAppUser(AppUser appUser) {
        this.appUser = appUser;
    }

    public UserGrammar appUser(AppUser appUser) {
        this.setAppUser(appUser);
        return this;
    }

    public Grammar getGrammar() {
        return this.grammar;
    }

    public void setGrammar(Grammar grammar) {
        this.grammar = grammar;
    }

    public UserGrammar grammar(Grammar grammar) {
        this.setGrammar(grammar);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserGrammar)) {
            return false;
        }
        return getId() != null && getId().equals(((UserGrammar) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserGrammar{" +
            "id=" + getId() +
            ", remembered='" + getRemembered() + "'" +
            ", isMemorized='" + getIsMemorized() + "'" +
            ", lastReviewed='" + getLastReviewed() + "'" +
            ", reviewCount=" + getReviewCount() +
            "}";
    }
}
