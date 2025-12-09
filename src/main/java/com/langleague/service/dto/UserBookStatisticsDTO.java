package com.langleague.service.dto;

import java.io.Serializable;

/**
 * A DTO for user book statistics.
 */
public class UserBookStatisticsDTO implements Serializable {

    private Long totalBooks;
    private Long booksInProgress;
    private Long booksCompleted;
    private Long favoriteBooks;

    public UserBookStatisticsDTO() {}

    public UserBookStatisticsDTO(Long totalBooks, Long booksInProgress, Long booksCompleted, Long favoriteBooks) {
        this.totalBooks = totalBooks;
        this.booksInProgress = booksInProgress;
        this.booksCompleted = booksCompleted;
        this.favoriteBooks = favoriteBooks;
    }

    public Long getTotalBooks() {
        return totalBooks;
    }

    public void setTotalBooks(Long totalBooks) {
        this.totalBooks = totalBooks;
    }

    public Long getBooksInProgress() {
        return booksInProgress;
    }

    public void setBooksInProgress(Long booksInProgress) {
        this.booksInProgress = booksInProgress;
    }

    public Long getBooksCompleted() {
        return booksCompleted;
    }

    public void setBooksCompleted(Long booksCompleted) {
        this.booksCompleted = booksCompleted;
    }

    public Long getFavoriteBooks() {
        return favoriteBooks;
    }

    public void setFavoriteBooks(Long favoriteBooks) {
        this.favoriteBooks = favoriteBooks;
    }

    @Override
    public String toString() {
        return (
            "UserBookStatisticsDTO{" +
            "totalBooks=" +
            totalBooks +
            ", booksInProgress=" +
            booksInProgress +
            ", booksCompleted=" +
            booksCompleted +
            ", favoriteBooks=" +
            favoriteBooks +
            '}'
        );
    }
}
