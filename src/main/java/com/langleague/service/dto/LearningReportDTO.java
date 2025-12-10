package com.langleague.service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.io.Serializable;
import java.time.Instant;
import java.util.Map;

/**
 * DTO for learning reports and statistics.
 * Use cases: UC 26, 33, 41, 51-53
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LearningReportDTO implements Serializable {

    private String userLogin;
    private Instant generatedAt;

    // Progress statistics
    private Integer totalBooksStarted;
    private Integer totalBooksCompleted;
    private Integer totalChaptersStarted;
    private Integer totalChaptersCompleted;
    private Double averageProgress;

    // Study time statistics
    private Integer totalStudyMinutes;
    private Integer totalStudySessions;
    private Integer averageSessionMinutes;

    // Activity statistics
    private Map<String, Integer> dailyActivityMap;
    private Integer todayVisits;
    private Integer totalVisits;
    private Integer uniqueUsers;
    private Integer activeUsers;

    // Admin statistics
    private Integer totalUsers;
    private Integer newUsers;

    public LearningReportDTO() {}

    // Getters and Setters
    public String getUserLogin() {
        return userLogin;
    }

    public void setUserLogin(String userLogin) {
        this.userLogin = userLogin;
    }

    public Instant getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(Instant generatedAt) {
        this.generatedAt = generatedAt;
    }

    public Integer getTotalBooksStarted() {
        return totalBooksStarted;
    }

    public void setTotalBooksStarted(Integer totalBooksStarted) {
        this.totalBooksStarted = totalBooksStarted;
    }

    public Integer getTotalBooksCompleted() {
        return totalBooksCompleted;
    }

    public void setTotalBooksCompleted(Integer totalBooksCompleted) {
        this.totalBooksCompleted = totalBooksCompleted;
    }

    public Integer getTotalChaptersStarted() {
        return totalChaptersStarted;
    }

    public void setTotalChaptersStarted(Integer totalChaptersStarted) {
        this.totalChaptersStarted = totalChaptersStarted;
    }

    public Integer getTotalChaptersCompleted() {
        return totalChaptersCompleted;
    }

    public void setTotalChaptersCompleted(Integer totalChaptersCompleted) {
        this.totalChaptersCompleted = totalChaptersCompleted;
    }

    public Double getAverageProgress() {
        return averageProgress;
    }

    public void setAverageProgress(Double averageProgress) {
        this.averageProgress = averageProgress;
    }

    public Integer getTotalStudyMinutes() {
        return totalStudyMinutes;
    }

    public void setTotalStudyMinutes(Integer totalStudyMinutes) {
        this.totalStudyMinutes = totalStudyMinutes;
    }

    public Integer getTotalStudySessions() {
        return totalStudySessions;
    }

    public void setTotalStudySessions(Integer totalStudySessions) {
        this.totalStudySessions = totalStudySessions;
    }

    public Integer getAverageSessionMinutes() {
        return averageSessionMinutes;
    }

    public void setAverageSessionMinutes(Integer averageSessionMinutes) {
        this.averageSessionMinutes = averageSessionMinutes;
    }

    public Map<String, Integer> getDailyActivityMap() {
        return dailyActivityMap;
    }

    public void setDailyActivityMap(Map<String, Integer> dailyActivityMap) {
        this.dailyActivityMap = dailyActivityMap;
    }

    public Integer getTodayVisits() {
        return todayVisits;
    }

    public void setTodayVisits(Integer todayVisits) {
        this.todayVisits = todayVisits;
    }

    public Integer getTotalVisits() {
        return totalVisits;
    }

    public void setTotalVisits(Integer totalVisits) {
        this.totalVisits = totalVisits;
    }

    public Integer getUniqueUsers() {
        return uniqueUsers;
    }

    public void setUniqueUsers(Integer uniqueUsers) {
        this.uniqueUsers = uniqueUsers;
    }

    public Integer getActiveUsers() {
        return activeUsers;
    }

    public void setActiveUsers(Integer activeUsers) {
        this.activeUsers = activeUsers;
    }

    public Integer getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Integer totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Integer getNewUsers() {
        return newUsers;
    }

    public void setNewUsers(Integer newUsers) {
        this.newUsers = newUsers;
    }

    @Override
    public String toString() {
        return (
            "LearningReportDTO{" +
            "userLogin='" +
            userLogin +
            '\'' +
            ", generatedAt=" +
            generatedAt +
            ", totalBooksStarted=" +
            totalBooksStarted +
            ", totalBooksCompleted=" +
            totalBooksCompleted +
            ", totalChaptersStarted=" +
            totalChaptersStarted +
            ", totalChaptersCompleted=" +
            totalChaptersCompleted +
            ", averageProgress=" +
            averageProgress +
            ", totalStudyMinutes=" +
            totalStudyMinutes +
            ", totalStudySessions=" +
            totalStudySessions +
            '}'
        );
    }
}
