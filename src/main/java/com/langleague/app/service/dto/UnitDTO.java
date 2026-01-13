package com.langleague.app.service.dto;

import jakarta.persistence.Lob;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.langleague.app.domain.Unit} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UnitDTO implements Serializable {

    private Long id;

    @NotNull
    private String title;

    @NotNull
    private Integer orderIndex;

    @Lob
    private String summary;

    @NotNull
    private BookDTO book;

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

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public BookDTO getBook() {
        return book;
    }

    public void setBook(BookDTO book) {
        this.book = book;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UnitDTO)) {
            return false;
        }

        UnitDTO unitDTO = (UnitDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, unitDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UnitDTO{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", orderIndex=" + getOrderIndex() +
            ", summary='" + getSummary() + "'" +
            ", book=" + getBook() +
            "}";
    }
}
