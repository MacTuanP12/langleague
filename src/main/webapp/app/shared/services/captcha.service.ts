import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = '/api/captcha';

// ==================== DTOs ====================

export interface CaptchaDTO {
  captchaId?: string;
  captchaImage?: string; // Base64 encoded image
  expiresAt?: string;
}

export interface CaptchaVerifyRequest {
  captchaId: string;
  captchaValue: string;
}

export interface CaptchaVerifyResponse {
  valid: boolean;
  message?: string;
}

// ==================== APIs ====================

// Get new captcha - Matches GET /api/captcha
export const getCaptcha = createAsyncThunk('captcha/fetch', async () => {
  try {
    const response = await axios.get<CaptchaDTO>(API_URL);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching captcha:', error);
    // Return mock captcha if backend not available
    return {
      captchaId: 'mock-' + Date.now(),
      captchaImage:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    };
  }
});

// Verify captcha - Matches POST /api/captcha/verify
export const verifyCaptcha = createAsyncThunk('captcha/verify', async (request: CaptchaVerifyRequest) => {
  try {
    const response = await axios.post<CaptchaVerifyResponse>(`${API_URL}/verify`, request);
    return response.data;
  } catch (error: any) {
    console.error('Error verifying captcha:', error);
    throw error;
  }
});

// ==================== HELPER FUNCTIONS ====================

// Plain async functions for direct usage
export const getCaptchaApi = async (): Promise<CaptchaDTO> => {
  try {
    const response = await axios.get<CaptchaDTO>(API_URL);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching captcha:', error);
    // Return mock captcha if backend not available
    return {
      captchaId: 'mock-' + Date.now(),
      captchaImage:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    };
  }
};

export const verifyCaptchaApi = async (request: CaptchaVerifyRequest): Promise<CaptchaVerifyResponse> => {
  const response = await axios.post<CaptchaVerifyResponse>(`${API_URL}/verify`, request);
  return response.data;
};
