package com.langleague.config;

import java.nio.file.Path;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Base upload directory: ${user.home}/.langleague/uploads/
        Path uploadBaseDir = Path.of(System.getProperty("user.home"), ".langleague", "uploads");

        // Serve avatars: /content/avatars/** and /api/files/download/avatars/**
        Path avatarsDir = uploadBaseDir.resolve("avatars");
        String avatarsPath = "file:" + avatarsDir.toFile().getAbsolutePath() + "/";
        registry.addResourceHandler("/content/avatars/**").addResourceLocations(avatarsPath);
        registry.addResourceHandler("/api/files/download/avatars/**").addResourceLocations(avatarsPath);

        // Serve images: /content/images/** and /api/files/download/images/**
        Path imagesDir = uploadBaseDir.resolve("images");
        String imagesPath = "file:" + imagesDir.toFile().getAbsolutePath() + "/";
        registry.addResourceHandler("/content/images/**").addResourceLocations(imagesPath);
        registry.addResourceHandler("/api/files/download/images/**").addResourceLocations(imagesPath);

        // Serve audio: /content/audio/** and /api/files/download/audio/**
        Path audioDir = uploadBaseDir.resolve("audio");
        String audioPath = "file:" + audioDir.toFile().getAbsolutePath() + "/";
        registry.addResourceHandler("/content/audio/**").addResourceLocations(audioPath);
        registry.addResourceHandler("/api/files/download/audio/**").addResourceLocations(audioPath);

        // Serve documents: /content/documents/** and /api/files/download/documents/**
        Path documentsDir = uploadBaseDir.resolve("documents");
        String documentsPath = "file:" + documentsDir.toFile().getAbsolutePath() + "/";
        registry.addResourceHandler("/content/documents/**").addResourceLocations(documentsPath);
        registry.addResourceHandler("/api/files/download/documents/**").addResourceLocations(documentsPath);
    }
}
