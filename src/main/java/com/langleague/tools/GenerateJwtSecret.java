package com.langleague.tools;

import java.security.SecureRandom;
import java.util.Base64;

public class GenerateJwtSecret {

    public static void main(String[] args) {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[64]; // 512 bits
        random.nextBytes(bytes);
        String secret = Base64.getEncoder().encodeToString(bytes);
        System.out.println("Generated JWT Secret (Base64, 512-bit):");
        System.out.println(secret);
    }
}
