package com.langleague.service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.io.Serializable;

/**
 * DTO for User Engagement data (daily breakdown).
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserEngagementDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String date; // YYYY-MM-DD format
    private Integer activeUsers;
    private Integer newUsers;
    private Integer returningUsers;

    public UserEngagementDTO() {}

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Integer getActiveUsers() {
        return activeUsers;
    }

    public void setActiveUsers(Integer activeUsers) {
        this.activeUsers = activeUsers;
    }

    public Integer getNewUsers() {
        return newUsers;
    }

    public void setNewUsers(Integer newUsers) {
        this.newUsers = newUsers;
    }

    public Integer getReturningUsers() {
        return returningUsers;
    }

    public void setReturningUsers(Integer returningUsers) {
        this.returningUsers = returningUsers;
    }

    @Override
    public String toString() {
        return (
            "UserEngagementDTO{" +
            "date='" +
            date +
            '\'' +
            ", activeUsers=" +
            activeUsers +
            ", newUsers=" +
            newUsers +
            ", returningUsers=" +
            returningUsers +
            '}'
        );
    }
}
