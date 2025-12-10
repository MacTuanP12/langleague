package com.langleague.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A LearningStreak.
 */
@Entity
@Table(name = "learning_streak")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class LearningStreak implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "current_streak")
    private Integer currentStreak;

    @Column(name = "longest_streak")
    private Integer longestStreak;

    @Column(name = "last_study_date")
    private Instant lastStudyDate;

    // Note: iconUrl removed - use StreakIconRepository.findCurrentIconForStreak() for dynamic query
    // This avoids data duplication and ensures icons are always up-to-date

    @Version
    @Column(name = "version")
    private Long version;

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

    public LearningStreak id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getCurrentStreak() {
        return this.currentStreak;
    }

    public LearningStreak currentStreak(Integer currentStreak) {
        this.setCurrentStreak(currentStreak);
        return this;
    }

    public void setCurrentStreak(Integer currentStreak) {
        this.currentStreak = currentStreak;
    }

    public Integer getLongestStreak() {
        return this.longestStreak;
    }

    public LearningStreak longestStreak(Integer longestStreak) {
        this.setLongestStreak(longestStreak);
        return this;
    }

    public void setLongestStreak(Integer longestStreak) {
        this.longestStreak = longestStreak;
    }

    public Instant getLastStudyDate() {
        return this.lastStudyDate;
    }

    public LearningStreak lastStudyDate(Instant lastStudyDate) {
        this.setLastStudyDate(lastStudyDate);
        return this;
    }

    public void setLastStudyDate(Instant lastStudyDate) {
        this.lastStudyDate = lastStudyDate;
    }

    public Long getVersion() {
        return this.version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }

    public AppUser getAppUser() {
        return this.appUser;
    }

    public void setAppUser(AppUser appUser) {
        this.appUser = appUser;
    }

    public LearningStreak appUser(AppUser appUser) {
        this.setAppUser(appUser);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    // ========================================
    // RICH DOMAIN MODEL: Business Logic
    // ========================================

    /**
     * Record a study activity and update streak accordingly.
     *
     * BUSINESS RULES:
     * 1. First activity: Set streak to 1
     * 2. Consecutive day (gap = 1 day): Increment streak
     * 3. Gap > 1 day: Reset streak to 1
     * 4. Same day: Ignore (already recorded)
     * 5. Auto-update longest streak if needed
     *
     * This method encapsulates all business logic in one place.
     * Service layer just calls: streak.recordActivity(LocalDate.now(), timezone);
     *
     * @param activityDate the date of the activity
     * @param timezone the user's timezone
     * @return true if streak was updated, false if same day (already recorded)
     */
    public boolean recordActivity(LocalDate activityDate, ZoneId timezone) {
        // Get last study date in user's timezone
        LocalDate lastDate = this.lastStudyDate != null ? this.lastStudyDate.atZone(timezone).toLocalDate() : null;

        // Business Rule 4: Same day - already recorded
        if (lastDate != null && lastDate.equals(activityDate)) {
            return false; // No change
        }

        // Business Rule 1: First activity
        if (lastDate == null) {
            this.currentStreak = 1;
        } else {
            long daysBetween = ChronoUnit.DAYS.between(lastDate, activityDate);

            if (daysBetween == 1) {
                // Business Rule 2: Consecutive day - increment
                this.currentStreak = (this.currentStreak != null ? this.currentStreak : 0) + 1;
            } else if (daysBetween > 1) {
                // Business Rule 3: Gap > 1 day - reset
                this.currentStreak = 1;
            }
            // daysBetween == 0 should not happen (caught above)
        }

        // Update last study date
        this.lastStudyDate = activityDate.atStartOfDay(timezone).toInstant();

        // Business Rule 5: Auto-update longest streak
        if (this.currentStreak > (this.longestStreak != null ? this.longestStreak : 0)) {
            this.longestStreak = this.currentStreak;
        }

        return true; // Streak was updated
    }

    /**
     * Check if user has studied today.
     *
     * @param timezone the user's timezone
     * @return true if studied today
     */
    public boolean hasStudiedToday(ZoneId timezone) {
        if (this.lastStudyDate == null) {
            return false;
        }

        LocalDate lastDate = this.lastStudyDate.atZone(timezone).toLocalDate();
        LocalDate today = LocalDate.now(timezone);

        return lastDate.equals(today);
    }

    /**
     * Check if streak is active (studied yesterday or today).
     *
     * @param timezone the user's timezone
     * @return true if streak is still active
     */
    public boolean isStreakActive(ZoneId timezone) {
        if (this.lastStudyDate == null) {
            return false;
        }

        LocalDate lastDate = this.lastStudyDate.atZone(timezone).toLocalDate();
        LocalDate today = LocalDate.now(timezone);
        long daysSinceLastStudy = ChronoUnit.DAYS.between(lastDate, today);

        return daysSinceLastStudy <= 1; // Active if studied today or yesterday
    }

    /**
     * Check if this is a new personal record.
     *
     * @return true if current streak equals longest streak (new record)
     */
    public boolean isNewRecord() {
        return this.currentStreak != null && this.longestStreak != null && this.currentStreak.equals(this.longestStreak);
    }

    /**
     * Initialize a new streak for a user.
     * Static factory method for creating new streaks.
     *
     * @param appUser the user
     * @return a new LearningStreak instance
     */
    public static LearningStreak createNewStreak(AppUser appUser) {
        LearningStreak streak = new LearningStreak();
        streak.setAppUser(appUser);
        streak.setCurrentStreak(0);
        streak.setLongestStreak(0);
        return streak;
    }

    // ========================================
    // End of Business Logic
    // ========================================

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof LearningStreak)) {
            return false;
        }
        return getId() != null && getId().equals(((LearningStreak) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "LearningStreak{" +
            "id=" + getId() +
            ", currentStreak=" + getCurrentStreak() +
            ", longestStreak=" + getLongestStreak() +
            ", lastStudyDate='" + getLastStudyDate() + "'" +
            "}";
    }
}
