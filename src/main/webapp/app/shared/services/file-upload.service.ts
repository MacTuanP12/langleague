import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = '/api/files';

// ==================== DTOs ====================

export interface FileUploadResponse {
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  contentType?: string;
  uploadedAt?: string;
}

// ==================== APIs ====================

// Upload single file - Matches POST /api/files/upload
export const uploadFile = createAsyncThunk('file/upload', async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post<FileUploadResponse>(`${API_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
});

// Upload multiple files - Matches POST /api/files/upload-multiple
export const uploadMultipleFiles = createAsyncThunk('file/upload_multiple', async (files: File[]) => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });

  const response = await axios.post<FileUploadResponse[]>(`${API_URL}/upload-multiple`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
});

// Upload image - Matches POST /api/files/upload-image
export const uploadImage = createAsyncThunk('file/upload_image', async (file: File) => {
  const formData = new FormData();
  formData.append('file', file); // Changed from 'image' to 'file' to match backend parameter

  const response = await axios.post<FileUploadResponse>(`${API_URL}/upload-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
});

// Upload audio - Matches POST /api/files/upload-audio
export const uploadAudio = createAsyncThunk('file/upload_audio', async (file: File) => {
  const formData = new FormData();
  formData.append('audio', file);

  const response = await axios.post<FileUploadResponse>(`${API_URL}/upload-audio`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
});

// Upload PDF - Matches POST /api/files/upload-pdf
export const uploadPDF = createAsyncThunk('file/upload_pdf', async (file: File) => {
  const formData = new FormData();
  formData.append('pdf', file);

  const response = await axios.post<FileUploadResponse>(`${API_URL}/upload-pdf`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
});

// Delete file - Matches DELETE /api/files/{filename}
export const deleteFile = createAsyncThunk('file/delete', async (filename: string) => {
  await axios.delete(`${API_URL}/${filename}`);
  return { filename };
});

// ==================== HELPER FUNCTIONS ====================

// Plain async functions for direct usage
export const uploadFileApi = async (file: File): Promise<FileUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post<FileUploadResponse>(`${API_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const uploadImageApi = async (file: File): Promise<FileUploadResponse> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await axios.post<FileUploadResponse>(`${API_URL}/upload-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const uploadAudioApi = async (file: File): Promise<FileUploadResponse> => {
  const formData = new FormData();
  formData.append('audio', file);

  const response = await axios.post<FileUploadResponse>(`${API_URL}/upload-audio`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const uploadPDFApi = async (file: File): Promise<FileUploadResponse> => {
  const formData = new FormData();
  formData.append('pdf', file);

  const response = await axios.post<FileUploadResponse>(`${API_URL}/upload-pdf`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteFileApi = async (filename: string): Promise<void> => {
  await axios.delete(`${API_URL}/${filename}`);
};

// Upload with progress callback
export const uploadFileWithProgress = async (file: File, onProgress?: (progressEvent: any) => void): Promise<FileUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post<FileUploadResponse>(`${API_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: onProgress,
  });
  return response.data;
};

export const uploadImageWithProgress = async (file: File, onProgress?: (progressEvent: any) => void): Promise<FileUploadResponse> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await axios.post<FileUploadResponse>(`${API_URL}/upload-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: onProgress,
  });
  return response.data;
};
