package com.langleague.app.web.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletResponseWrapper;
import java.io.IOException;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Filter to set correct Content-Type header for audio files.
 * This prevents browsers from downloading audio files instead of playing them inline.
 */
@Component
@Order(1)
public class AudioContentTypeFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {
        String path = request.getRequestURI();

        // Only process audio file requests
        if (path != null && path.startsWith("/content/uploads/")) {
            String filename = path.toLowerCase();
            String contentType = getAudioContentType(filename);

            if (contentType != null) {
                // Wrap response to override Content-Type
                HttpServletResponseWrapper wrappedResponse = new HttpServletResponseWrapper(response) {
                    @Override
                    public void setContentType(String type) {
                        // Override with correct audio Content-Type
                        super.setContentType(contentType);
                    }
                };

                // Set Content-Type header explicitly
                response.setContentType(contentType);
                // Add Accept-Ranges header for better audio streaming support
                response.setHeader("Accept-Ranges", "bytes");
                // Prevent download by setting Content-Disposition to inline
                response.setHeader("Content-Disposition", "inline");

                filterChain.doFilter(request, wrappedResponse);
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Determine Content-Type based on file extension
     */
    private String getAudioContentType(String filename) {
        if (filename.endsWith(".mp3")) {
            return "audio/mpeg";
        } else if (filename.endsWith(".wav")) {
            return "audio/wav";
        } else if (filename.endsWith(".ogg")) {
            return "audio/ogg";
        } else if (filename.endsWith(".m4a")) {
            return "audio/mp4";
        } else if (filename.endsWith(".aac")) {
            return "audio/aac";
        } else if (filename.endsWith(".wma")) {
            return "audio/x-ms-wma";
        } else if (filename.endsWith(".flac")) {
            return "audio/flac";
        }
        return null; // Not an audio file, let default handling proceed
    }
}
