package com.langleague.web.rest;

import com.langleague.security.CaptchaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class CaptchaResource {

    private final CaptchaService captchaService;

    public CaptchaResource(CaptchaService captchaService) {
        this.captchaService = captchaService;
    }

    // Lấy captcha mới
    @GetMapping("/captcha")
    public ResponseEntity<CaptchaService.Captcha> getCaptcha() {
        return ResponseEntity.ok(captchaService.generateCaptcha());
    }

    // Verify captcha
    @PostMapping("/captcha/verify")
    public ResponseEntity<Boolean> verifyCaptcha(@RequestParam String captchaId, @RequestParam String answer) {
        boolean valid = captchaService.verifyCaptcha(captchaId, answer);
        return ResponseEntity.ok(valid);
    }
}
