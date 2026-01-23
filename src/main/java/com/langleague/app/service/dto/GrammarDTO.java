package com.langleague.app.service.dto;

import jakarta.persistence.Lob;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.langleague.app.domain.Grammar} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class GrammarDTO implements Serializable {

    private Long id;

    @NotNull
    @NotBlank
    @Size(min = 1, max = 200)
    private String title;

    @Lob
    private String contentMarkdown;

    @Lob
    private String exampleUsage;

    @NotNull
    @Min(0)
    private Integer orderIndex;

    private Long unitId;

    private String unitTitle;

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

    public String getContentMarkdown() {
        return contentMarkdown;
    }

    public void setContentMarkdown(String contentMarkdown) {
        this.contentMarkdown = contentMarkdown;
    }

    public String getExampleUsage() {
        return exampleUsage;
    }

    public void setExampleUsage(String exampleUsage) {
        this.exampleUsage = exampleUsage;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }

    public Long getUnitId() {
        return unitId;
    }

    public void setUnitId(Long unitId) {
        this.unitId = unitId;
    }

    public String getUnitTitle() {
        return unitTitle;
    }

    public void setUnitTitle(String unitTitle) {
        this.unitTitle = unitTitle;
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
            ", contentMarkdown='" + getContentMarkdown() + "'" +
            ", exampleUsage='" + getExampleUsage() + "'" +
            ", orderIndex=" + getOrderIndex() +
            ", unitId=" + getUnitId() +
            ", unitTitle='" + getUnitTitle() + "'" +
            "}";
    }
}
