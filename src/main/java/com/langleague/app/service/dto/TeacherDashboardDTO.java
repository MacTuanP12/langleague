package com.langleague.app.service.dto;

import java.io.Serializable;
import java.util.List;

public class TeacherDashboardDTO implements Serializable {

    private long totalBooks;
    private long totalStudents;
    private double averageScore;
    private List<BookStatDTO> bookStats;

    public long getTotalBooks() {
        return totalBooks;
    }

    public void setTotalBooks(long totalBooks) {
        this.totalBooks = totalBooks;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public double getAverageScore() {
        return averageScore;
    }

    public void setAverageScore(double averageScore) {
        this.averageScore = averageScore;
    }

    public List<BookStatDTO> getBookStats() {
        return bookStats;
    }

    public void setBookStats(List<BookStatDTO> bookStats) {
        this.bookStats = bookStats;
    }

    public static class BookStatDTO implements Serializable {

        private String bookTitle;
        private long enrollmentCount;

        public BookStatDTO(String bookTitle, long enrollmentCount) {
            this.bookTitle = bookTitle;
            this.enrollmentCount = enrollmentCount;
        }

        public String getBookTitle() {
            return bookTitle;
        }

        public void setBookTitle(String bookTitle) {
            this.bookTitle = bookTitle;
        }

        public long getEnrollmentCount() {
            return enrollmentCount;
        }

        public void setEnrollmentCount(long enrollmentCount) {
            this.enrollmentCount = enrollmentCount;
        }
    }
}
