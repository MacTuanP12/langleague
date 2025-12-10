package com.langleague.service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.io.Serializable;
import java.util.List;

/**
 * DTO for Business Analytics Dashboard.
 * Contains all key business metrics: DAU/MAU, Retention, Engagement, etc.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BusinessAnalyticsDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    // Active Users Metrics
    private Integer dau; // Daily Active Users
    private Integer wau; // Weekly Active Users
    private Integer mau; // Monthly Active Users

    // Retention Metrics
    private Double retentionDay1;
    private Double retentionDay7;
    private Double retentionDay30;

    // Engagement Metrics
    private Double avgSessionDuration; // in minutes
    private Double completionRate; // percentage
    private Double churnRate; // percentage

    // Revenue Metrics (optional, for future use)
    private Double totalRevenue;
    private Double revenueTrend; // percentage change

    // Detailed Data
    private List<UserEngagementDTO> userEngagementData;
    private List<ChapterPerformanceDTO> chapterPerformance;

    // Constructors
    public BusinessAnalyticsDTO() {}

    // Getters and Setters
    public Integer getDau() {
        return dau;
    }

    public void setDau(Integer dau) {
        this.dau = dau;
    }

    public Integer getWau() {
        return wau;
    }

    public void setWau(Integer wau) {
        this.wau = wau;
    }

    public Integer getMau() {
        return mau;
    }

    public void setMau(Integer mau) {
        this.mau = mau;
    }

    public Double getRetentionDay1() {
        return retentionDay1;
    }

    public void setRetentionDay1(Double retentionDay1) {
        this.retentionDay1 = retentionDay1;
    }

    public Double getRetentionDay7() {
        return retentionDay7;
    }

    public void setRetentionDay7(Double retentionDay7) {
        this.retentionDay7 = retentionDay7;
    }

    public Double getRetentionDay30() {
        return retentionDay30;
    }

    public void setRetentionDay30(Double retentionDay30) {
        this.retentionDay30 = retentionDay30;
    }

    public Double getAvgSessionDuration() {
        return avgSessionDuration;
    }

    public void setAvgSessionDuration(Double avgSessionDuration) {
        this.avgSessionDuration = avgSessionDuration;
    }

    public Double getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(Double completionRate) {
        this.completionRate = completionRate;
    }

    public Double getChurnRate() {
        return churnRate;
    }

    public void setChurnRate(Double churnRate) {
        this.churnRate = churnRate;
    }

    public Double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(Double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public Double getRevenueTrend() {
        return revenueTrend;
    }

    public void setRevenueTrend(Double revenueTrend) {
        this.revenueTrend = revenueTrend;
    }

    public List<UserEngagementDTO> getUserEngagementData() {
        return userEngagementData;
    }

    public void setUserEngagementData(List<UserEngagementDTO> userEngagementData) {
        this.userEngagementData = userEngagementData;
    }

    public List<ChapterPerformanceDTO> getChapterPerformance() {
        return chapterPerformance;
    }

    public void setChapterPerformance(List<ChapterPerformanceDTO> chapterPerformance) {
        this.chapterPerformance = chapterPerformance;
    }

    @Override
    public String toString() {
        return (
            "BusinessAnalyticsDTO{" +
            "dau=" +
            dau +
            ", wau=" +
            wau +
            ", mau=" +
            mau +
            ", retentionDay1=" +
            retentionDay1 +
            ", retentionDay7=" +
            retentionDay7 +
            ", retentionDay30=" +
            retentionDay30 +
            ", avgSessionDuration=" +
            avgSessionDuration +
            ", completionRate=" +
            completionRate +
            ", churnRate=" +
            churnRate +
            '}'
        );
    }
}
