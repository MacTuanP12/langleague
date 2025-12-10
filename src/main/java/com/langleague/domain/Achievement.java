package com.langleague.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Achievement.
 */
@Entity
@Table(name = "achievement")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Achievement implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 255)
    @Column(name = "title", length = 255, nullable = false)
    private String title;

    @Lob
    @Column(name = "description")
    private String description;

    @Size(max = 50)
    @Column(name = "criteria_type", length = 50)
    private String criteriaType;

    @Column(name = "target_value")
    private Long targetValue;

    @Size(max = 500)
    @Column(name = "icon_url", length = 500)
    private String iconUrl;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "achievement")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "appUser", "achievement" }, allowSetters = true)
    private Set<UserAchievement> userAchievements = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Achievement id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public Achievement title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return this.description;
    }

    public Achievement description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCriteriaType() {
        return this.criteriaType;
    }

    public Achievement criteriaType(String criteriaType) {
        this.setCriteriaType(criteriaType);
        return this;
    }

    public void setCriteriaType(String criteriaType) {
        this.criteriaType = criteriaType;
    }

    public Long getTargetValue() {
        return this.targetValue;
    }

    public Achievement targetValue(Long targetValue) {
        this.setTargetValue(targetValue);
        return this;
    }

    public void setTargetValue(Long targetValue) {
        this.targetValue = targetValue;
    }

    public String getIconUrl() {
        return this.iconUrl;
    }

    public Achievement iconUrl(String iconUrl) {
        this.setIconUrl(iconUrl);
        return this;
    }

    public void setIconUrl(String iconUrl) {
        this.iconUrl = iconUrl;
    }

    public Set<UserAchievement> getUserAchievements() {
        return this.userAchievements;
    }

    public void setUserAchievements(Set<UserAchievement> userAchievements) {
        if (this.userAchievements != null) {
            this.userAchievements.forEach(i -> i.setAchievement(null));
        }
        if (userAchievements != null) {
            userAchievements.forEach(i -> i.setAchievement(this));
        }
        this.userAchievements = userAchievements;
    }

    public Achievement userAchievements(Set<UserAchievement> userAchievements) {
        this.setUserAchievements(userAchievements);
        return this;
    }

    public Achievement addUserAchievement(UserAchievement userAchievement) {
        this.userAchievements.add(userAchievement);
        userAchievement.setAchievement(this);
        return this;
    }

    public Achievement removeUserAchievement(UserAchievement userAchievement) {
        this.userAchievements.remove(userAchievement);
        userAchievement.setAchievement(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Achievement)) {
            return false;
        }
        return getId() != null && getId().equals(((Achievement) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Achievement{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
