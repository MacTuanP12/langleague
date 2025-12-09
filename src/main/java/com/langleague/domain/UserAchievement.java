package com.langleague.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A UserAchievement.
 */
@Entity
@Table(name = "user_achievement")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UserAchievement implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "awarded_to")
    private Instant awardedTo;

    @Column(name = "progress")
    private Double progress;

    @Column(name = "is_unlocked")
    private Boolean isUnlocked = false;

    @Column(name = "unlocked_at")
    private Instant unlockedAt;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "userAchievements" }, allowSetters = true)
    private Achievement achievement;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public UserAchievement id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getAwardedTo() {
        return this.awardedTo;
    }

    public UserAchievement awardedTo(Instant awardedTo) {
        this.setAwardedTo(awardedTo);
        return this;
    }

    public void setAwardedTo(Instant awardedTo) {
        this.awardedTo = awardedTo;
    }

    public AppUser getAppUser() {
        return this.appUser;
    }

    public void setAppUser(AppUser appUser) {
        this.appUser = appUser;
    }

    public UserAchievement appUser(AppUser appUser) {
        this.setAppUser(appUser);
        return this;
    }

    public Achievement getAchievement() {
        return this.achievement;
    }

    public void setAchievement(Achievement achievement) {
        this.achievement = achievement;
    }

    public UserAchievement achievement(Achievement achievement) {
        this.setAchievement(achievement);
        return this;
    }

    public Double getProgress() {
        return this.progress;
    }

    public void setProgress(Double progress) {
        this.progress = progress;
    }

    public Boolean getIsUnlocked() {
        return this.isUnlocked;
    }

    public void setIsUnlocked(Boolean isUnlocked) {
        this.isUnlocked = isUnlocked;
    }

    public Instant getUnlockedAt() {
        return this.unlockedAt;
    }

    public void setUnlockedAt(Instant unlockedAt) {
        this.unlockedAt = unlockedAt;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    // ========================================
    // RICH DOMAIN MODEL: Business Logic
    // ========================================

    /**
     * Update progress and check if achievement should be unlocked.
     *
     * BUSINESS RULES (OOP - Entity có behavior):
     * 1. If already unlocked → do nothing
     * 2. Update progress value
     * 3. Check if target reached → unlock
     * 4. Return true if just unlocked (for celebration)
     *
     * @param currentValue the current progress value
     * @param achievement the achievement rule
     * @return true if just unlocked (để Service bắn pháo hoa!)
     */
    public boolean updateProgress(long currentValue, Achievement achievement) {
        // Business Rule 1: Đã unlock rồi thì thôi
        if (Boolean.TRUE.equals(this.isUnlocked)) {
            return false;
        }

        // Business Rule 2: Cập nhật tiến độ
        this.progress = (double) currentValue;

        // Business Rule 3: Kiểm tra điều kiện unlock
        if (achievement.getTargetValue() != null && currentValue >= achievement.getTargetValue()) {
            this.isUnlocked = true;
            this.unlockedAt = Instant.now();
            this.awardedTo = Instant.now();
            return true; // 🎉 Vừa mới unlock!
        }

        return false; // Chưa đủ điều kiện
    }

    /**
     * Get progress percentage.
     *
     * @return progress as percentage (0-100)
     */
    public double getProgressPercent() {
        if (Boolean.TRUE.equals(this.isUnlocked)) {
            return 100.0;
        }

        if (this.progress == null || this.achievement == null || this.achievement.getTargetValue() == null) {
            return 0.0;
        }

        return Math.min(100.0, (this.progress / this.achievement.getTargetValue()) * 100.0);
    }

    /**
     * Check if achievement is locked (not unlocked yet).
     */
    public boolean isLocked() {
        return !Boolean.TRUE.equals(this.isUnlocked);
    }

    /**
     * Static factory method to create new user achievement.
     */
    public static UserAchievement createNew(AppUser user, Achievement achievement) {
        UserAchievement userAch = new UserAchievement();
        userAch.setAppUser(user);
        userAch.setAchievement(achievement);
        userAch.setProgress(0.0);
        userAch.setIsUnlocked(false);
        return userAch;
    }

    // ========================================
    // End of Business Logic
    // ========================================

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserAchievement)) {
            return false;
        }
        return getId() != null && getId().equals(((UserAchievement) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserAchievement{" +
            "id=" + getId() +
            ", awardedTo='" + getAwardedTo() + "'" +
            "}";
    }
}
