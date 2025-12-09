import axios from 'axios';

const API_URL = '/api/staff/book-uploads';

export interface BookUploadDTO {
  id?: number;
  originalFileName: string;
  fileUrl: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  chatbotResponse?: string;
  errorMessage?: string;
  uploadedAt?: string;
  processedAt?: string;
  retryCount?: number;
  uploadedById?: number;
  uploadedByDisplayName?: string;
  createdBookId?: number;
  createdBookTitle?: string;
}

/**
 * Service for staff book uploads
 */
export const uploadBook = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  return axios.post<BookUploadDTO>(API_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getMyUploads = () => {
  return axios.get<BookUploadDTO[]>(API_URL);
};

export const getUploadById = (id: number) => {
  return axios.get<BookUploadDTO>(`${API_URL}/${id}`);
};

export const retryUpload = (id: number) => {
  return axios.post(`${API_URL}/${id}/retry`);
};

export default {
  uploadBook,
  getMyUploads,
  getUploadById,
  retryUpload,
};
