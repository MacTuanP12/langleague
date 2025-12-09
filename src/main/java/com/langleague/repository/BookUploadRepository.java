package com.langleague.repository;

import com.langleague.domain.BookUpload;
import com.langleague.domain.enumeration.UploadStatus;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the BookUpload entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BookUploadRepository extends JpaRepository<BookUpload, Long> {
    List<BookUpload> findByUploadedBy_IdOrderByUploadedAtDesc(Long userId);

    List<BookUpload> findByStatusOrderByUploadedAtDesc(UploadStatus status);

    List<BookUpload> findByStatusAndRetryCountLessThan(UploadStatus status, Integer maxRetries);

    @Query("SELECT bu FROM BookUpload bu WHERE bu.uploadedBy.id = :userId AND bu.status = :status")
    List<BookUpload> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") UploadStatus status);
}
