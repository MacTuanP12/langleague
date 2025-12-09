package com.langleague.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.langleague.domain.enumeration.UploadStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * Entity for tracking book upload and processing status
 */
@Entity
@Table(name = "book_upload")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class BookUpload implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 500)
    @Column(name = "original_file_name", length = 500, nullable = false)
    private String originalFileName;

    @NotNull
    @Size(max = 1000)
    @Column(name = "file_url", length = 1000, nullable = false)
    private String fileUrl;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private UploadStatus status = UploadStatus.PENDING;

    @Lob
    @Column(name = "chatbot_response")
    private String chatbotResponse;

    @Lob
    @Column(name = "error_message")
    private String errorMessage;

    @Column(name = "uploaded_at", nullable = false)
    private Instant uploadedAt = Instant.now();

    @Column(name = "processed_at")
    private Instant processedAt;

    @Column(name = "retry_count")
    private Integer retryCount = 0;

    @Column(name = "use_ai")
    private Boolean useAI = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "internalUser", "userVocabularies", "userGrammars" }, allowSetters = true)
    private AppUser uploadedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "chapters", "bookReviews" }, allowSetters = true)
    private Book createdBook;

    // Getters and Setters

    public Long getId() {
        return this.id;
    }

    public BookUpload id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOriginalFileName() {
        return this.originalFileName;
    }

    public BookUpload originalFileName(String originalFileName) {
        this.setOriginalFileName(originalFileName);
        return this;
    }

    public void setOriginalFileName(String originalFileName) {
        this.originalFileName = originalFileName;
    }

    public String getFileUrl() {
        return this.fileUrl;
    }

    public BookUpload fileUrl(String fileUrl) {
        this.setFileUrl(fileUrl);
        return this;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public UploadStatus getStatus() {
        return this.status;
    }

    public BookUpload status(UploadStatus status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(UploadStatus status) {
        this.status = status;
    }

    public String getChatbotResponse() {
        return this.chatbotResponse;
    }

    public BookUpload chatbotResponse(String chatbotResponse) {
        this.setChatbotResponse(chatbotResponse);
        return this;
    }

    public void setChatbotResponse(String chatbotResponse) {
        this.chatbotResponse = chatbotResponse;
    }

    public String getErrorMessage() {
        return this.errorMessage;
    }

    public BookUpload errorMessage(String errorMessage) {
        this.setErrorMessage(errorMessage);
        return this;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public Instant getUploadedAt() {
        return this.uploadedAt;
    }

    public BookUpload uploadedAt(Instant uploadedAt) {
        this.setUploadedAt(uploadedAt);
        return this;
    }

    public void setUploadedAt(Instant uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    public Instant getProcessedAt() {
        return this.processedAt;
    }

    public BookUpload processedAt(Instant processedAt) {
        this.setProcessedAt(processedAt);
        return this;
    }

    public void setProcessedAt(Instant processedAt) {
        this.processedAt = processedAt;
    }

    public Integer getRetryCount() {
        return this.retryCount;
    }

    public BookUpload retryCount(Integer retryCount) {
        this.setRetryCount(retryCount);
        return this;
    }

    public void setRetryCount(Integer retryCount) {
        this.retryCount = retryCount;
    }

    public Boolean getUseAI() {
        return this.useAI;
    }

    public BookUpload useAI(Boolean useAI) {
        this.setUseAI(useAI);
        return this;
    }

    public void setUseAI(Boolean useAI) {
        this.useAI = useAI;
    }

    public AppUser getUploadedBy() {
        return this.uploadedBy;
    }

    public void setUploadedBy(AppUser appUser) {
        this.uploadedBy = appUser;
    }

    public BookUpload uploadedBy(AppUser appUser) {
        this.setUploadedBy(appUser);
        return this;
    }

    public Book getCreatedBook() {
        return this.createdBook;
    }

    public void setCreatedBook(Book book) {
        this.createdBook = book;
    }

    public BookUpload createdBook(Book book) {
        this.setCreatedBook(book);
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof BookUpload)) {
            return false;
        }
        return getId() != null && getId().equals(((BookUpload) o).getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return (
            "BookUpload{" +
            "id=" +
            getId() +
            ", originalFileName='" +
            getOriginalFileName() +
            "'" +
            ", fileUrl='" +
            getFileUrl() +
            "'" +
            ", status='" +
            getStatus() +
            "'" +
            ", uploadedAt='" +
            getUploadedAt() +
            "'" +
            ", processedAt='" +
            getProcessedAt() +
            "'" +
            ", retryCount=" +
            getRetryCount() +
            "}"
        );
    }
}
