package com.langleague.app.service;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.Base64;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import javax.imageio.ImageIO;
import org.springframework.stereotype.Service;

/**
 * Captcha service: generate and verify simple captcha images
 */
@Service
public class CaptchaService {

    // Cache for captchaId -> captchaText, expires in 3 minutes
    private final Cache<String, String> captchaCache = Caffeine.newBuilder()
        .expireAfterWrite(3, TimeUnit.MINUTES)
        .maximumSize(1000)
        .build();

    private static final String CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    // Generate new captcha (id + base64 image)
    public Captcha generateCaptcha() {
        String text = generateRandomText(6);
        String id = UUID.randomUUID().toString();
        captchaCache.put(id, text);

        String image = createImageBase64(text);
        return new Captcha(id, image);
    }

    // Verify captcha value and invalidate it
    public boolean verifyCaptcha(String captchaId, String answer) {
        if (captchaId == null || answer == null) {
            return false;
        }
        String real = captchaCache.getIfPresent(captchaId);
        boolean valid = real != null && real.equalsIgnoreCase(answer);
        if (valid) {
            captchaCache.invalidate(captchaId);
        }
        return valid;
    }

    // Generate random text
    private String generateRandomText(int length) {
        Random rand = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) {
            sb.append(CHARS.charAt(rand.nextInt(CHARS.length())));
        }
        return sb.toString();
    }

    // Create Base64 PNG image with improved styling
    private String createImageBase64(String text) {
        try {
            int width = 200, height = 60;
            BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
            Graphics2D g2 = image.createGraphics();

            // Enable anti-aliasing for smoother text
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

            // Background
            g2.setColor(Color.WHITE);
            g2.fillRect(0, 0, width, height);

            Random rand = new Random();

            // Add noise lines
            for (int i = 0; i < 5; i++) {
                g2.setColor(new Color(rand.nextInt(150) + 100, rand.nextInt(150) + 100, rand.nextInt(150) + 100));
                g2.drawLine(rand.nextInt(width), rand.nextInt(height), rand.nextInt(width), rand.nextInt(height));
            }

            // Draw each character with random rotation and position
            g2.setFont(new Font("Arial", Font.BOLD, 36));
            int charWidth = width / text.length();

            for (int i = 0; i < text.length(); i++) {
                // Random color for each character (dark colors)
                g2.setColor(new Color(rand.nextInt(100), rand.nextInt(100), rand.nextInt(100)));

                // Random rotation angle (-30 to 30 degrees)
                double angle = ((rand.nextDouble() - 0.5) * Math.PI) / 3;

                // Position
                int x = charWidth * i + 15;
                int y = 40 + rand.nextInt(10) - 5; // Random vertical offset

                // Apply rotation
                g2.rotate(angle, x, y);
                g2.drawString(String.valueOf(text.charAt(i)), x, y);
                g2.rotate(-angle, x, y); // Reset rotation
            }

            g2.dispose();

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(image, "png", baos);
            return "data:image/png;base64," + Base64.getEncoder().encodeToString(baos.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Cannot generate captcha image", e);
        }
    }

    // Simple DTO for captcha
    public record Captcha(String captchaId, String captchaImage) {}
}
