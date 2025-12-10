package com.langleague.service.listener;

import com.langleague.domain.ExerciseResult;
import com.langleague.service.AchievementService;
import com.langleague.service.UserBookService;
import com.langleague.service.event.ExerciseCompletedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class GamificationListener {

    private final Logger log = LoggerFactory.getLogger(GamificationListener.class);
    private final AchievementService achievementService;
    private final UserBookService userBookService;

    public GamificationListener(AchievementService achievementService, UserBookService userBookService) {
        this.achievementService = achievementService;
        this.userBookService = userBookService;
    }

    @Async
    @EventListener
    @Transactional
    public void handleExerciseCompleted(ExerciseCompletedEvent event) {
        log.debug("Processing async gamification for user: {}", event.getUserId());

        try {
            // 1. Tính toán thành tích (Achievements)
            achievementService.checkAndAwardAchievements(event.getUserId(), event.getExerciseType(), event.getScore());

            // 2. Cập nhật tiến độ sách (Book Progress)
            if (event.getBookId() != null) {
                userBookService.autoUpdateBookProgress(event.getBookId(), event.getUserId());
            }
        } catch (Exception e) {
            log.error("Error in background gamification task: {}", e.getMessage(), e);
        }
    }
}
