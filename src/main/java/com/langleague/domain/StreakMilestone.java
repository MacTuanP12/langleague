package com.langleague.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A StreakMilestone.
 */
@Entity
@Table(name = "streak_milestone")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class StreakMilestone implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "milestone_days")
    private Integer milestoneDays;

    @Size(max = 255)
    @Column(name = "reward_name", length = 255)
    private String rewardName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "streakMilestones", "appUser" }, allowSetters = true)
    private StudySession studySession;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public StreakMilestone id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getMilestoneDays() {
        return this.milestoneDays;
    }

    public StreakMilestone milestoneDays(Integer milestoneDays) {
        this.setMilestoneDays(milestoneDays);
        return this;
    }

    public void setMilestoneDays(Integer milestoneDays) {
        this.milestoneDays = milestoneDays;
    }

    public String getRewardName() {
        return this.rewardName;
    }

    public StreakMilestone rewardName(String rewardName) {
        this.setRewardName(rewardName);
        return this;
    }

    public void setRewardName(String rewardName) {
        this.rewardName = rewardName;
    }

    public StudySession getStudySession() {
        return this.studySession;
    }

    public void setStudySession(StudySession studySession) {
        this.studySession = studySession;
    }

    public StreakMilestone studySession(StudySession studySession) {
        this.setStudySession(studySession);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof StreakMilestone)) {
            return false;
        }
        return getId() != null && getId().equals(((StreakMilestone) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "StreakMilestone{" +
            "id=" + getId() +
            ", milestoneDays=" + getMilestoneDays() +
            ", rewardName='" + getRewardName() + "'" +
            "}";
    }
}
