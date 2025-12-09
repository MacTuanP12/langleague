package com.langleague.service.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Lob;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.langleague.domain.ListeningOption} entity.
 */
@Schema(description = "Options for Multiple Choice")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ListeningOptionDTO implements Serializable {

    private Long id;

    @Size(max = 10)
    private String label;

    @Lob
    private String content;

    private Boolean isCorrect;

    private Integer orderIndex;

    private ListeningExerciseDTO listeningExercise;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Boolean getIsCorrect() {
        return isCorrect;
    }

    public void setIsCorrect(Boolean isCorrect) {
        this.isCorrect = isCorrect;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }

    public ListeningExerciseDTO getListeningExercise() {
        return listeningExercise;
    }

    public void setListeningExercise(ListeningExerciseDTO listeningExercise) {
        this.listeningExercise = listeningExercise;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ListeningOptionDTO)) {
            return false;
        }

        ListeningOptionDTO listeningOptionDTO = (ListeningOptionDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, listeningOptionDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ListeningOptionDTO{" +
            "id=" + getId() +
            ", label='" + getLabel() + "'" +
            ", content='" + getContent() + "'" +
            ", isCorrect='" + getIsCorrect() + "'" +
            ", orderIndex=" + getOrderIndex() +
            ", listeningExercise=" + getListeningExercise() +
            "}";
    }
}
