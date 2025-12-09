package com.langleague.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A StreakIcon.
 */
@Entity
@Table(name = "streak_icon")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class StreakIcon implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Size(max = 50)
    @Column(name = "level", length = 50)
    private String level;

    @Column(name = "min_days")
    private Integer minDays;

    @Size(max = 256)
    @Column(name = "icon_path", length = 256)
    private String iconPath;

    @Size(max = 255)
    @Column(name = "description", length = 255)
    private String description;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public StreakIcon id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLevel() {
        return this.level;
    }

    public StreakIcon level(String level) {
        this.setLevel(level);
        return this;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public Integer getMinDays() {
        return this.minDays;
    }

    public StreakIcon minDays(Integer minDays) {
        this.setMinDays(minDays);
        return this;
    }

    public void setMinDays(Integer minDays) {
        this.minDays = minDays;
    }

    public String getIconPath() {
        return this.iconPath;
    }

    public StreakIcon iconPath(String iconPath) {
        this.setIconPath(iconPath);
        return this;
    }

    public void setIconPath(String iconPath) {
        this.iconPath = iconPath;
    }

    public String getDescription() {
        return this.description;
    }

    public StreakIcon description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof StreakIcon)) {
            return false;
        }
        return getId() != null && getId().equals(((StreakIcon) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "StreakIcon{" +
            "id=" + getId() +
            ", level='" + getLevel() + "'" +
            ", minDays=" + getMinDays() +
            ", iconPath='" + getIconPath() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
