package com.langleague.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.langleague.domain.StreakMilestone} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class StreakMilestoneDTO implements Serializable {

    private Long id;

    private Integer milestoneDays;

    @Size(max = 255)
    private String rewardName;

    private StudySessionDTO studySession;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getMilestoneDays() {
        return milestoneDays;
    }

    public void setMilestoneDays(Integer milestoneDays) {
        this.milestoneDays = milestoneDays;
    }

    public String getRewardName() {
        return rewardName;
    }

    public void setRewardName(String rewardName) {
        this.rewardName = rewardName;
    }

    public StudySessionDTO getStudySession() {
        return studySession;
    }

    public void setStudySession(StudySessionDTO studySession) {
        this.studySession = studySession;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof StreakMilestoneDTO)) {
            return false;
        }

        StreakMilestoneDTO streakMilestoneDTO = (StreakMilestoneDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, streakMilestoneDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "StreakMilestoneDTO{" +
            "id=" + getId() +
            ", milestoneDays=" + getMilestoneDays() +
            ", rewardName='" + getRewardName() + "'" +
            ", studySession=" + getStudySession() +
            "}";
    }
}
