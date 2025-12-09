package com.langleague.config;

import java.time.Duration;
import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;
import org.hibernate.cache.jcache.ConfigSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.boot.info.BuildProperties;
import org.springframework.boot.info.GitProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.*;
import tech.jhipster.config.JHipsterProperties;
import tech.jhipster.config.cache.PrefixedKeyGenerator;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private GitProperties gitProperties;
    private BuildProperties buildProperties;
    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        JHipsterProperties.Cache.Ehcache ehcache = jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration = Eh107Configuration.fromEhcacheCacheConfiguration(
            CacheConfigurationBuilder.newCacheConfigurationBuilder(
                Object.class,
                Object.class,
                ResourcePoolsBuilder.heap(ehcache.getMaxEntries())
            )
                .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                .build()
        );
    }

    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(javax.cache.CacheManager cacheManager) {
        return hibernateProperties -> hibernateProperties.put(ConfigSettings.CACHE_MANAGER, cacheManager);
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            createCache(cm, com.langleague.repository.UserRepository.USERS_BY_LOGIN_CACHE);
            createCache(cm, com.langleague.repository.UserRepository.USERS_BY_EMAIL_CACHE);
            createCache(cm, "appUserByLogin"); // Custom cache for AppUser lookups
            createCache(cm, com.langleague.domain.User.class.getName());
            createCache(cm, com.langleague.domain.Authority.class.getName());
            createCache(cm, com.langleague.domain.User.class.getName() + ".authorities");
            createCache(cm, com.langleague.domain.AppUser.class.getName());
            createCache(cm, com.langleague.domain.AppUser.class.getName() + ".comments");
            createCache(cm, com.langleague.domain.AppUser.class.getName() + ".exerciseResults");
            createCache(cm, com.langleague.domain.AppUser.class.getName() + ".userProgresses");
            createCache(cm, com.langleague.domain.AppUser.class.getName() + ".userVocabularies");
            createCache(cm, com.langleague.domain.AppUser.class.getName() + ".userAchievements");
            createCache(cm, com.langleague.domain.AppUser.class.getName() + ".learningStreaks");
            createCache(cm, com.langleague.domain.AppUser.class.getName() + ".studySessions");
            createCache(cm, com.langleague.domain.Book.class.getName());
            createCache(cm, com.langleague.domain.Book.class.getName() + ".chapters");
            createCache(cm, com.langleague.domain.Chapter.class.getName());
            createCache(cm, com.langleague.domain.Word.class.getName());
            createCache(cm, com.langleague.domain.Word.class.getName() + ".wordExamples");
            createCache(cm, com.langleague.domain.Word.class.getName() + ".userVocabularies");
            createCache(cm, com.langleague.domain.WordExample.class.getName());

            createCache(cm, com.langleague.domain.ListeningExercise.class.getName());
            createCache(cm, com.langleague.domain.SpeakingExercise.class.getName());
            createCache(cm, com.langleague.domain.ReadingExercise.class.getName());
            createCache(cm, com.langleague.domain.WritingExercise.class.getName());

            createCache(cm, com.langleague.domain.Comment.class.getName());
            createCache(cm, com.langleague.domain.ExerciseResult.class.getName());

            createCache(cm, com.langleague.domain.UserVocabulary.class.getName());
            createCache(cm, com.langleague.domain.Achievement.class.getName());
            createCache(cm, com.langleague.domain.Achievement.class.getName() + ".userAchievements");
            createCache(cm, com.langleague.domain.UserAchievement.class.getName());
            createCache(cm, com.langleague.domain.LearningStreak.class.getName());
            createCache(cm, com.langleague.domain.StudySession.class.getName());
            createCache(cm, com.langleague.domain.StudySession.class.getName() + ".streakMilestones");
            createCache(cm, com.langleague.domain.StreakIcon.class.getName());
            createCache(cm, com.langleague.domain.StreakMilestone.class.getName());

            // Custom caches for service layer
            createCache(cm, "books");
            createCache(cm, "booksByLevel");
            createCache(cm, com.langleague.domain.UserBook.class.getName());
            createCache(cm, com.langleague.domain.ChapterProgress.class.getName());
            createCache(cm, com.langleague.domain.ReadingOption.class.getName());
            createCache(cm, com.langleague.domain.BookReview.class.getName());

            // Additional caches for entity collections (fix HHH90001006 warnings)
            createCache(cm, com.langleague.domain.Chapter.class.getName() + ".chapterProgresses");
            createCache(cm, com.langleague.domain.Chapter.class.getName() + ".words");
            createCache(cm, com.langleague.domain.Book.class.getName() + ".bookReviews");
            createCache(cm, com.langleague.domain.ListeningExercise.class.getName() + ".exerciseResults");
            createCache(cm, com.langleague.domain.ListeningExercise.class.getName() + ".options");
            createCache(cm, com.langleague.domain.Chapter.class.getName() + ".listeningExercises");
            createCache(cm, com.langleague.domain.ListeningOption.class.getName());
            createCache(cm, com.langleague.domain.Chapter.class.getName() + ".grammars");
            createCache(cm, com.langleague.domain.ReadingExercise.class.getName() + ".exerciseResults");
            createCache(cm, com.langleague.domain.AppUser.class.getName() + ".chapterProgresses");
            createCache(cm, com.langleague.domain.Grammar.class.getName() + ".userGrammars");
            createCache(cm, com.langleague.domain.ReadingExercise.class.getName() + ".options");
            createCache(cm, com.langleague.domain.UserChapter.class.getName());
            createCache(cm, com.langleague.domain.AppUser.class.getName() + ".bookReviews");
            createCache(cm, com.langleague.domain.Grammar.class.getName());
            createCache(cm, com.langleague.domain.Chapter.class.getName() + ".writingExercises");
            createCache(cm, com.langleague.domain.BookUpload.class.getName());
            createCache(cm, com.langleague.domain.Chapter.class.getName() + ".speakingExercises");
            createCache(cm, com.langleague.domain.Grammar.class.getName() + ".grammarExamples");
            createCache(cm, com.langleague.domain.SpeakingExercise.class.getName() + ".exerciseResults");
            createCache(cm, com.langleague.domain.Notification.class.getName());
            createCache(cm, com.langleague.domain.GrammarExample.class.getName());
            createCache(cm, com.langleague.domain.UserGrammar.class.getName());
            createCache(cm, com.langleague.domain.Chapter.class.getName() + ".readingExercises");
            createCache(cm, com.langleague.domain.WritingExercise.class.getName() + ".exerciseResults");
            createCache(cm, com.langleague.domain.AppUser.class.getName() + ".userGrammars");
            // jhipster-needle-ehcache-add-entry
        };
    }

    private void createCache(javax.cache.CacheManager cm, String cacheName) {
        javax.cache.Cache<Object, Object> cache = cm.getCache(cacheName);
        if (cache != null) {
            cache.clear();
        } else {
            cm.createCache(cacheName, jcacheConfiguration);
        }
    }

    @Autowired(required = false)
    public void setGitProperties(GitProperties gitProperties) {
        this.gitProperties = gitProperties;
    }

    @Autowired(required = false)
    public void setBuildProperties(BuildProperties buildProperties) {
        this.buildProperties = buildProperties;
    }

    @Bean
    public KeyGenerator keyGenerator() {
        return new PrefixedKeyGenerator(this.gitProperties, this.buildProperties);
    }
}
