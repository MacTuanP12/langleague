package com.langleague.service;

import com.langleague.domain.Achievement;
import com.langleague.domain.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.MessageSource;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;
import tech.jhipster.config.JHipsterProperties;

/**
 * Service for sending emails asynchronously.
 * <p>
 * We use the {@link Async} annotation to send emails asynchronously.
 */
@Service
@ConditionalOnProperty(name = "spring.mail.host")
public class MailService {

    private static final Logger LOG = LoggerFactory.getLogger(MailService.class);

    private static final String USER = "user";

    private static final String BASE_URL = "baseUrl";

    private final JHipsterProperties jHipsterProperties;

    private final JavaMailSender javaMailSender;

    private final MessageSource messageSource;

    private final SpringTemplateEngine templateEngine;

    public MailService(
        JHipsterProperties jHipsterProperties,
        @Autowired(required = false) JavaMailSender javaMailSender,
        MessageSource messageSource,
        SpringTemplateEngine templateEngine
    ) {
        this.jHipsterProperties = jHipsterProperties;
        this.javaMailSender = javaMailSender;
        this.messageSource = messageSource;
        this.templateEngine = templateEngine;
    }

    @Async
    public void sendEmail(String to, String subject, String content, boolean isMultipart, boolean isHtml) {
        sendEmailSync(to, subject, content, isMultipart, isHtml);
    }

    private void sendEmailSync(String to, String subject, String content, boolean isMultipart, boolean isHtml) {
        LOG.debug(
            "Send email[multipart '{}' and html '{}'] to '{}' with subject '{}' and content={}",
            isMultipart,
            isHtml,
            to,
            subject,
            content
        );

        if (javaMailSender == null) {
            LOG.warn("JavaMailSender is not configured. Email to '{}' with subject '{}' was not sent.", to, subject);
            return;
        }

        // Prepare message using a Spring helper
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper message = new MimeMessageHelper(mimeMessage, isMultipart, StandardCharsets.UTF_8.name());
            message.setTo(to);
            message.setFrom(jHipsterProperties.getMail().getFrom());
            message.setSubject(subject);
            message.setText(content, isHtml);
            javaMailSender.send(mimeMessage);
            LOG.debug("Sent email to User '{}'", to);
        } catch (MailException | MessagingException e) {
            LOG.warn("Email could not be sent to user '{}'", to, e);
        }
    }

    @Async
    public void sendEmailFromTemplate(User user, String templateName, String titleKey) {
        sendEmailFromTemplateSync(user, templateName, titleKey);
    }

    private void sendEmailFromTemplateSync(User user, String templateName, String titleKey) {
        if (user.getEmail() == null) {
            LOG.debug("Email doesn't exist for user '{}'", user.getLogin());
            return;
        }
        Locale locale = Locale.forLanguageTag(user.getLangKey());
        Context context = new Context(locale);
        context.setVariable(USER, user);
        context.setVariable(BASE_URL, jHipsterProperties.getMail().getBaseUrl());
        String content = templateEngine.process(templateName, context);
        String subject = messageSource.getMessage(titleKey, null, locale);
        sendEmailSync(user.getEmail(), subject, content, false, true);
    }

    @Async
    public void sendActivationEmail(User user) {
        LOG.debug("Sending activation email to '{}'", user.getEmail());
        sendEmailFromTemplateSync(user, "mail/activationEmail", "email.activation.title");
    }

    @Async
    public void sendCreationEmail(User user) {
        LOG.debug("Sending welcome email to '{}'", user.getEmail());
        sendEmailFromTemplateSync(user, "mail/welcomeEmail", "email.welcome.title");
    }

    @Async
    public void sendPasswordResetMail(User user) {
        LOG.debug("Sending password reset email to '{}'", user.getEmail());
        sendEmailFromTemplateSync(user, "mail/passwordResetEmail", "email.reset.title");
    }

    @Async
    public void sendPasswordChangedNotification(User user) {
        LOG.debug("Sending password change notification to '{}'", user.getEmail());
        sendEmailFromTemplateSync(user, "mail/passwordChangeEmail", "email.password.changed.title");
    }

    /**
     * Send account locked notification (after failed login attempts)
     */
    @Async
    public void sendAccountLockedEmail(User user, int lockDurationMinutes) {
        if (user.getEmail() == null) {
            LOG.debug("Email doesn't exist for user '{}'", user.getLogin());
            return;
        }
        LOG.debug("Sending account locked email to '{}'", user.getEmail());
        Locale locale = Locale.forLanguageTag(user.getLangKey());
        Context context = new Context(locale);
        context.setVariable(USER, user);
        context.setVariable("lockDurationMinutes", lockDurationMinutes);
        context.setVariable(BASE_URL, jHipsterProperties.getMail().getBaseUrl());

        String content = templateEngine.process("mail/accountLockedEmail", context);
        String subject = messageSource.getMessage("email.account.locked.title", null, locale);
        sendEmailSync(user.getEmail(), subject, content, false, true);
    }

    // ==================== LEARNING REMINDERS ====================

    /**
     * Send daily learning reminder
     */
    @Async
    public void sendDailyLearningReminder(User user, int currentStreak) {
        if (user.getEmail() == null) {
            return;
        }
        Locale locale = Locale.forLanguageTag(user.getLangKey());
        Context context = new Context(locale);
        context.setVariable(USER, user);
        context.setVariable("currentStreak", currentStreak);
        context.setVariable(BASE_URL, jHipsterProperties.getMail().getBaseUrl());

        String content = templateEngine.process("mail/dailyReminderEmail", context);
        String subject = messageSource.getMessage("email.reminder.daily.title", null, locale);
        sendEmailSync(user.getEmail(), subject, content, false, true);
        LOG.debug("Sent daily reminder to '{}'", user.getEmail());
    }

    /**
     * Send streak break warning (haven't studied for a day)
     */
    @Async
    public void sendStreakWarningEmail(User user, int currentStreak) {
        if (user.getEmail() == null) {
            return;
        }
        Locale locale = Locale.forLanguageTag(user.getLangKey());
        Context context = new Context(locale);
        context.setVariable(USER, user);
        context.setVariable("currentStreak", currentStreak);
        context.setVariable(BASE_URL, jHipsterProperties.getMail().getBaseUrl());

        String content = templateEngine.process("mail/streakWarningEmail", context);
        String subject = messageSource.getMessage("email.streak.warning.title", null, locale);
        sendEmailSync(user.getEmail(), subject, content, false, true);
        LOG.debug("Sent streak warning to '{}'", user.getEmail());
    }

    // ==================== ACHIEVEMENT EMAILS ====================

    /**
     * Send congratulations email when user earns an achievement
     */
    @Async
    public void sendAchievementEmail(User user, Achievement achievement) {
        if (user.getEmail() == null) {
            return;
        }
        Locale locale = Locale.forLanguageTag(user.getLangKey());
        Context context = new Context(locale);
        context.setVariable(USER, user);
        context.setVariable("achievement", achievement);
        context.setVariable(BASE_URL, jHipsterProperties.getMail().getBaseUrl());

        String content = templateEngine.process("mail/achievementEmail", context);
        String subject = messageSource.getMessage("email.achievement.title", new Object[] { achievement.getTitle() }, locale);
        sendEmailSync(user.getEmail(), subject, content, false, true);
        LOG.debug("Sent achievement email to '{}' for '{}'", user.getEmail(), achievement.getTitle());
    }

    /**
     * Send milestone celebration (e.g., 7-day, 30-day, 100-day streak)
     */
    @Async
    public void sendStreakMilestoneEmail(User user, int milestoneStreak) {
        if (user.getEmail() == null) {
            return;
        }
        Locale locale = Locale.forLanguageTag(user.getLangKey());
        Context context = new Context(locale);
        context.setVariable(USER, user);
        context.setVariable("milestoneStreak", milestoneStreak);
        context.setVariable(BASE_URL, jHipsterProperties.getMail().getBaseUrl());

        String content = templateEngine.process("mail/streakMilestoneEmail", context);
        String subject = messageSource.getMessage("email.streak.milestone.title", new Object[] { milestoneStreak }, locale);
        sendEmailSync(user.getEmail(), subject, content, false, true);
        LOG.debug("Sent streak milestone email to '{}' for {} days", user.getEmail(), milestoneStreak);
    }

    // ==================== LESSON COMPLETION ====================

    /**
     * Send lesson completion summary (weekly/monthly report)
     */
    @Async
    public void sendLearningProgressReport(User user, int lessonsCompleted, int totalMinutes) {
        if (user.getEmail() == null) {
            return;
        }
        Locale locale = Locale.forLanguageTag(user.getLangKey());
        Context context = new Context(locale);
        context.setVariable(USER, user);
        context.setVariable("lessonsCompleted", lessonsCompleted);
        context.setVariable("totalMinutes", totalMinutes);
        context.setVariable(BASE_URL, jHipsterProperties.getMail().getBaseUrl());

        String content = templateEngine.process("mail/progressReportEmail", context);
        String subject = messageSource.getMessage("email.progress.report.title", null, locale);
        sendEmailSync(user.getEmail(), subject, content, false, true);
        LOG.debug("Sent progress report to '{}'", user.getEmail());
    }

    // ==================== ADMIN NOTIFICATIONS ====================

    /**
     * Send notification from admin to users
     */
    @Async
    public void sendAdminNotification(User user, String title, String message) {
        if (user.getEmail() == null) {
            return;
        }
        Locale locale = Locale.forLanguageTag(user.getLangKey());
        Context context = new Context(locale);
        context.setVariable(USER, user);
        context.setVariable("notificationTitle", title);
        context.setVariable("notificationMessage", message);
        context.setVariable(BASE_URL, jHipsterProperties.getMail().getBaseUrl());

        String content = templateEngine.process("mail/adminNotificationEmail", context);
        sendEmailSync(user.getEmail(), title, content, false, true);
        LOG.debug("Sent admin notification to '{}'", user.getEmail());
    }

    /**
     * Send new lesson available notification
     */
    @Async
    public void sendNewLessonNotification(User user, String lessonTitle, String bookTitle) {
        if (user.getEmail() == null) {
            return;
        }
        Locale locale = Locale.forLanguageTag(user.getLangKey());
        Context context = new Context(locale);
        context.setVariable(USER, user);
        context.setVariable("lessonTitle", lessonTitle);
        context.setVariable("bookTitle", bookTitle);
        context.setVariable(BASE_URL, jHipsterProperties.getMail().getBaseUrl());

        String content = templateEngine.process("mail/newLessonEmail", context);
        String subject = messageSource.getMessage("email.new.lesson.title", null, locale);
        sendEmailSync(user.getEmail(), subject, content, false, true);
        LOG.debug("Sent new lesson notification to '{}'", user.getEmail());
    }
}
