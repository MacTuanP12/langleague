package com.langleague.service.dto;

import com.langleague.domain.enumeration.Level;
import jakarta.persistence.Lob;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.langleague.domain.Grammar} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class GrammarDTO implements Serializable {

    private Long id;

    @NotNull
    @Size(max = 255)
    private String title;

    private Level level;

    @Lob
    private String description;

    private ChapterDTO chapter;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Level getLevel() {
        return level;
    }

    public void setLevel(Level level) {
        this.level = level;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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
        if (!(o instanceof GrammarDTO)) {
            return false;
        }

        GrammarDTO grammarDTO = (GrammarDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, grammarDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "GrammarDTO{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", level='" + getLevel() + "'" +
            ", description='" + getDescription() + "'" +
            ", chapter=" + getChapter() +
            "}";
    }
}
