package com.langleague.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link com.langleague.domain.ChapterProgress} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ChapterProgressDTO implements Serializable {

    private Long id;

    private Integer percent;

    private Instant lastAccessed;

    private Boolean completed;

    private AppUserDTO appUser;

    private ChapterDTO chapter;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getPercent() {
        return percent;
    }

    public void setPercent(Integer percent) {
        this.percent = percent;
    }

    public Instant getLastAccessed() {
        return lastAccessed;
    }

    public void setLastAccessed(Instant lastAccessed) {
        this.lastAccessed = lastAccessed;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    public AppUserDTO getAppUser() {
        return appUser;
    }

    public void setAppUser(AppUserDTO appUser) {
        this.appUser = appUser;
    }

    public ChapterDTO getChapter() {
        return chapter;
    }

    public void setChapter(ChapterDTO chapter) {
        this.chapter = chapter;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ChapterProgressDTO)) {
            return false;
        }

        ChapterProgressDTO chapterProgressDTO = (ChapterProgressDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, chapterProgressDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ChapterProgressDTO{" +
            "id=" + getId() +
            ", percent=" + getPercent() +
            ", lastAccessed='" + getLastAccessed() + "'" +
            ", completed='" + getCompleted() + "'" +
            ", appUser=" + getAppUser() +
            ", chapter=" + getChapter() +
            "}";
    }
}
