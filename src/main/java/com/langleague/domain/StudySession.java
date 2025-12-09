package com.langleague.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A StudySession.
 */
@Entity
@Table(name = "study_session")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class StudySession implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "start_at")
    private Instant startAt;

    @Column(name = "end_at")
    private Instant endAt;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "studySession")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "studySession" }, allowSetters = true)
    private Set<StreakMilestone> streakMilestones = new HashSet<>();

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

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public StudySession id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getStartAt() {
        return this.startAt;
    }

    public StudySession startAt(Instant startAt) {
        this.setStartAt(startAt);
        return this;
    }

    public void setStartAt(Instant startAt) {
        this.startAt = startAt;
    }

    public Instant getEndAt() {
        return this.endAt;
    }

    public StudySession endAt(Instant endAt) {
        this.setEndAt(endAt);
        return this;
    }

    public void setEndAt(Instant endAt) {
        this.endAt = endAt;
    }

    public Integer getDurationMinutes() {
        return this.durationMinutes;
    }

    public StudySession durationMinutes(Integer durationMinutes) {
        this.setDurationMinutes(durationMinutes);
        return this;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public Set<StreakMilestone> getStreakMilestones() {
        return this.streakMilestones;
    }

    public void setStreakMilestones(Set<StreakMilestone> streakMilestones) {
        if (this.streakMilestones != null) {
            this.streakMilestones.forEach(i -> i.setStudySession(null));
        }
        if (streakMilestones != null) {
            streakMilestones.forEach(i -> i.setStudySession(this));
        }
        this.streakMilestones = streakMilestones;
    }

    public StudySession streakMilestones(Set<StreakMilestone> streakMilestones) {
        this.setStreakMilestones(streakMilestones);
        return this;
    }

    public StudySession addStreakMilestone(StreakMilestone streakMilestone) {
        this.streakMilestones.add(streakMilestone);
        streakMilestone.setStudySession(this);
        return this;
    }

    public StudySession removeStreakMilestone(StreakMilestone streakMilestone) {
        this.streakMilestones.remove(streakMilestone);
        streakMilestone.setStudySession(null);
        return this;
    }

    public AppUser getAppUser() {
        return this.appUser;
    }

    public void setAppUser(AppUser appUser) {
        this.appUser = appUser;
    }

    public StudySession appUser(AppUser appUser) {
        this.setAppUser(appUser);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof StudySession)) {
            return false;
        }
        return getId() != null && getId().equals(((StudySession) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "StudySession{" +
            "id=" + getId() +
            ", startAt='" + getStartAt() + "'" +
            ", endAt='" + getEndAt() + "'" +
            ", durationMinutes=" + getDurationMinutes() +
            "}";
    }
}
