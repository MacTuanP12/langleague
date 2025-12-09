package com.langleague.service.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link com.langleague.domain.UserVocabulary} entity.
 */
@Schema(description = "User vocabulary progress (Flashcards)")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UserVocabularyDTO implements Serializable {

    private Long id;

    private Boolean remembered;

    private Boolean isMemorized;

    private Instant lastReviewed;

    private Integer reviewCount;

    private AppUserDTO appUser;

    @NotNull(message = "Word is required")
    private WordDTO word;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getRemembered() {
        return remembered;
    }

    public void setRemembered(Boolean remembered) {
        this.remembered = remembered;
    }

    public Boolean getIsMemorized() {
        return isMemorized;
    }

    public void setIsMemorized(Boolean isMemorized) {
        this.isMemorized = isMemorized;
    }

    public Instant getLastReviewed() {
        return lastReviewed;
    }

    public void setLastReviewed(Instant lastReviewed) {
        this.lastReviewed = lastReviewed;
    }

    public Integer getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(Integer reviewCount) {
        this.reviewCount = reviewCount;
    }

    public AppUserDTO getAppUser() {
        return appUser;
    }

    public void setAppUser(AppUserDTO appUser) {
        this.appUser = appUser;
    }

    public WordDTO getWord() {
        return word;
    }

    public void setWord(WordDTO word) {
        this.word = word;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserVocabularyDTO)) {
            return false;
        }

        UserVocabularyDTO userVocabularyDTO = (UserVocabularyDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, userVocabularyDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserVocabularyDTO{" +
            "id=" + getId() +
            ", remembered='" + getRemembered() + "'" +
            ", isMemorized='" + getIsMemorized() + "'" +
            ", lastReviewed='" + getLastReviewed() + "'" +
            ", reviewCount=" + getReviewCount() +
            ", appUser=" + getAppUser() +
            ", word=" + getWord() +
            "}";
    }
}
