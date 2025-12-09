package com.langleague.service.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link com.langleague.domain.UserGrammar} entity.
 */
@Schema(description = "User grammar progress")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UserGrammarDTO implements Serializable {

    private Long id;

    private Boolean remembered;

    private Boolean isMemorized;

    private Instant lastReviewed;

    private Integer reviewCount;

    private AppUserDTO appUser;

    @NotNull(message = "Grammar is required")
    private GrammarDTO grammar;

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

    public GrammarDTO getGrammar() {
        return grammar;
    }

    public void setGrammar(GrammarDTO grammar) {
        this.grammar = grammar;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserGrammarDTO)) {
            return false;
        }

        UserGrammarDTO userGrammarDTO = (UserGrammarDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, userGrammarDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserGrammarDTO{" +
            "id=" + getId() +
            ", remembered='" + getRemembered() + "'" +
            ", isMemorized='" + getIsMemorized() + "'" +
            ", lastReviewed='" + getLastReviewed() + "'" +
            ", reviewCount=" + getReviewCount() +
            ", appUser=" + getAppUser() +
            ", grammar=" + getGrammar() +
            "}";
    }
}
