import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { IBook } from '../model/models';

const API_URL = '/api/books';
const USE_MOCK = false;
const MOCK_BOOKS: IBook[] = [
  {
    id: 1,
    title: '82년생 김지영',
    level: 'INTERMEDIATE',
    description: 'Câu chuyện về Kim Ji-young, một phụ nữ Hàn Quốc sinh năm 1982, phản ánh những vấn đề xã hội về giới tính.',
    thumbnail: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    author: '조남주 (Cho Nam-joo)',
    publisher: 'Minumsa',
    publishYear: 2016,
    source: 'Korean Literature',
    totalPages: 192,
    pdfUrl: '/books/82-kim-jiyoung.pdf',
    totalChapters: 12,
    processingStatus: 'COMPLETED',
    createdDate: '2024-01-15',
  },
  {
    id: 2,
    title: '미움받을 용기',
    level: 'BEGINNER',
    description: 'Dựa trên tâm lý học Adler, cuốn sách khuyến khích bạn có dũng khí sống cuộc đời của chính mình.',
    thumbnail: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
    author: '기시미 이치로 (Kishimi Ichiro)',
    publisher: 'Inkworld',
    publishYear: 2014,
    source: 'Philosophy',
    totalPages: 336,
    pdfUrl: '/books/courage-to-be-disliked.pdf',
    totalChapters: 15,
    processingStatus: 'COMPLETED',
    createdDate: '2024-02-20',
  },
  {
    id: 3,
    title: '아몬드',
    level: 'ADVANCED',
    description: 'Câu chuyện về cậu bé Yunjae không thể cảm nhận cảm xúc và hành trình tìm kiếm sự đồng cảm.',
    thumbnail: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400',
    author: '손원평 (Son Won-pyung)',
    publisher: 'Changbi',
    publishYear: 2017,
    source: 'Korean Fiction',
    totalPages: 267,
    pdfUrl: '/books/almond.pdf',
    totalChapters: 8,
    processingStatus: 'COMPLETED',
    createdDate: '2024-03-10',
  },
  {
    id: 4,
    title: '채식주의자',
    level: 'ADVANCED',
    description: 'Tiểu thuyết về một phụ nữ quyết định trở thành người ăn chay và những hậu quả mà nó mang lại.',
    thumbnail: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    author: '한강 (Han Kang)',
    publisher: 'Changbi',
    publishYear: 2007,
    source: 'Korean Literature',
    totalPages: 192,
    pdfUrl: '/books/vegetarian.pdf',
    totalChapters: 10,
    processingStatus: 'COMPLETED',
    createdDate: '2024-01-20',
  },
  {
    id: 5,
    title: '달러구트 꿈 백화점',
    level: 'BEGINNER',
    description: 'Cửa hàng bách hóa nơi bạn có thể mua những giấc mơ. Câu chuyện kỳ diệu và ấm áp về ước mơ.',
    thumbnail: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
    author: '이미예 (Lee Mi-ye)',
    publisher: 'Penguin',
    publishYear: 2020,
    source: 'Fantasy',
    totalPages: 308,
    pdfUrl: '/books/dollar-store-dreams.pdf',
    totalChapters: 18,
    processingStatus: 'COMPLETED',
    createdDate: '2024-02-15',
  },
  {
    id: 6,
    title: '트렌드 코리아 2024',
    level: 'INTERMEDIATE',
    description: 'Phân tích xu hướng tiêu dùng và văn hóa Hàn Quốc năm 2024, giúp hiểu rõ xã hội hiện đại.',
    thumbnail: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
    author: '김난도 외 (Kim Nan-do et al.)',
    publisher: 'Miraebook',
    publishYear: 2023,
    source: 'Non-fiction',
    totalPages: 488,
    pdfUrl: '/books/trend-korea-2024.pdf',
    totalChapters: 20,
    processingStatus: 'COMPLETED',
    createdDate: '2024-03-01',
  },
];

// Plain async function for direct usage (e.g., in dashboard)
export const getBooksApi = async (page = 0, size = 20): Promise<any> => {
  const response = await axios.get<any>(API_URL, {
    params: { page, size },
  });
  return response.data;
};

export const getBooks = createAsyncThunk('book/fetch_entity_list', async (params?: { page?: number; size?: number; sort?: string }) => {
  if (USE_MOCK) {
    return MOCK_BOOKS;
  }
  try {
    const requestUrl = `${API_URL}${params ? `?page=${params.page || 0}&size=${params.size || 100}&sort=${params.sort || 'id,asc'}` : ''}`;
    const response = await axios.get<IBook[]>(requestUrl);
    return response.data;
  } catch (error: any) {
    // Fallback to mock if backend not ready or unauthorized
    const status = error?.response?.status;
    if (status === 500 || status === 401 || error?.code === 'ERR_BAD_RESPONSE') {
      console.warn('Books API not ready or unauthorized, using mock data');
      return MOCK_BOOKS;
    }
    throw error;
  }
});

export const getBook = createAsyncThunk('book/fetch_entity', async (id: number) => {
  if (USE_MOCK) {
    return MOCK_BOOKS.find(b => b.id === id) || MOCK_BOOKS[0];
  }
  try {
    const response = await axios.get<IBook>(`${API_URL}/${id}`);
    return response.data;
  } catch (error: any) {
    // Fallback to mock if backend not ready or unauthorized
    const status = error?.response?.status;
    if (status === 500 || status === 401 || error?.code === 'ERR_BAD_RESPONSE') {
      console.warn('Book API not ready or unauthorized, using mock data');
      return MOCK_BOOKS.find(b => b.id === id) || MOCK_BOOKS[0];
    }
    throw error;
  }
});

export const createBook = createAsyncThunk('book/create_entity', async (book: IBook) => {
  const response = await axios.post<IBook>(API_URL, book);
  return response.data;
});

export const updateBook = createAsyncThunk('book/update_entity', async ({ id, book }: { id: number; book: IBook }) => {
  const response = await axios.put<IBook>(`${API_URL}/${id}`, book);
  return response.data;
});

export const deleteBook = createAsyncThunk('book/delete_entity', async (params: { id: number; force?: boolean } | number) => {
  const id = typeof params === 'number' ? params : params.id;
  const force = typeof params === 'object' ? params.force : false;

  const url = force ? `${API_URL}/${id}?force=true` : `${API_URL}/${id}`;
  await axios.delete(url);
  return { id };
});

// Upload PDF for book creation (Staff)
export const uploadBookPDF = createAsyncThunk('book/upload_pdf', async ({ formData }: { formData: FormData }) => {
  const response = await axios.post<IBook>(`${API_URL}/upload-pdf`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
});

// Trigger AI processing for book
export const processBookWithAI = createAsyncThunk('book/process_ai', async (bookId: number) => {
  const response = await axios.post(`${API_URL}/${bookId}/process`);
  return response.data;
});

// Get chapters for a specific book - Matches GET /api/books/{id}/chapters
export const getBookChapters = createAsyncThunk('book/fetch_chapters', async (bookId: number) => {
  try {
    const response = await axios.get<any[]>(`${API_URL}/${bookId}/chapters`);
    return response.data;
  } catch (error: any) {
    // Fallback to empty if backend not ready
    if (error?.response?.status === 500 || error?.code === 'ERR_BAD_RESPONSE') {
      console.warn('Book chapters API not ready, returning empty');
      return [];
    }
    throw error;
  }
});

// Search books - Matches GET /api/books/search
export const searchBooks = createAsyncThunk('book/search', async (params: { keyword?: string; page?: number; size?: number }) => {
  try {
    const response = await axios.get<IBook[]>(`${API_URL}/search`, {
      params: {
        keyword: params.keyword,
        page: params.page || 0,
        size: params.size || 20,
      },
    });
    return response.data;
  } catch (error: any) {
    const status = error?.response?.status;
    if (status === 500 || status === 401 || error?.code === 'ERR_BAD_RESPONSE') {
      console.warn('Search API not ready or unauthorized, filtering mock data');
      const keyword = params.keyword?.toLowerCase() || '';
      return MOCK_BOOKS.filter(
        b =>
          b.title.toLowerCase().includes(keyword) ||
          b.author?.toLowerCase().includes(keyword) ||
          b.description?.toLowerCase().includes(keyword),
      );
    }
    throw error;
  }
});

// Get books by level - Matches GET /api/books/by-level/{level}
export const getBooksByLevel = createAsyncThunk('book/fetch_by_level', async (level: string) => {
  try {
    const response = await axios.get<IBook[]>(`${API_URL}/by-level/${level}`);
    return response.data;
  } catch (error: any) {
    const status = error?.response?.status;
    if (status === 500 || status === 401 || error?.code === 'ERR_BAD_RESPONSE') {
      console.warn('Books by level API not ready or unauthorized, filtering mock data');
      return MOCK_BOOKS.filter(b => b.level === level);
    }
    throw error;
  }
});

// Get books by status
export const getBooksByStatus = createAsyncThunk('book/fetch_by_status', async (status: string) => {
  const response = await axios.get(`${API_URL}/by-status/${status}`);
  return response.data;
});

// ==================== NEW API ENDPOINTS ====================

// Get active books - Matches GET /api/books/active
export const getActiveBooks = createAsyncThunk('book/fetch_active', async (params?: { page?: number; size?: number }) => {
  try {
    const response = await axios.get<any>(`${API_URL}/active`, {
      params: {
        page: params?.page || 0,
        size: params?.size || 20,
      },
    });
    return response.data;
  } catch (error: any) {
    // Handle both 500 errors and 401 (unauthenticated) with mock data for better UX
    const status = error?.response?.status;
    if (status === 500 || status === 401 || error?.code === 'ERR_BAD_RESPONSE') {
      console.warn('Active books API not ready or unauthorized, using mock data');
      return { content: MOCK_BOOKS, totalElements: MOCK_BOOKS.length };
    }
    throw error;
  }
});

// Get book details (full) - Matches GET /api/books/{id}/details
export const getBookDetails = createAsyncThunk('book/fetch_details', async (id: number) => {
  try {
    const response = await axios.get<any>(`${API_URL}/${id}/details`);
    return response.data;
  } catch (error: any) {
    const status = error?.response?.status;
    if (status === 500 || status === 401 || error?.code === 'ERR_BAD_RESPONSE') {
      console.warn('Book details API not ready or unauthorized, using basic book data');
      return MOCK_BOOKS.find(b => b.id === id) || MOCK_BOOKS[0];
    }
    throw error;
  }
});

// Get book recommendations - Matches GET /api/books/recommendations?levels=A1,A2
export const getBookRecommendations = createAsyncThunk('book/fetch_recommendations', async (levels: string[]) => {
  try {
    const response = await axios.get<IBook[]>(`${API_URL}/recommendations`, {
      params: {
        levels: levels.join(','),
      },
    });
    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 500 || error?.code === 'ERR_BAD_RESPONSE') {
      console.warn('Recommendations API not ready, filtering mock data');
      return MOCK_BOOKS.filter(b => levels.includes(b.level || ''));
    }
    throw error;
  }
});

// Check if book title exists - Matches GET /api/books/check-title?title=...
export const checkBookTitle = createAsyncThunk('book/check_title', async (title: string) => {
  try {
    const response = await axios.get<{ exists: boolean }>(`${API_URL}/check-title`, {
      params: { title },
    });
    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 500 || error?.code === 'ERR_BAD_RESPONSE') {
      // Mock implementation
      return { exists: MOCK_BOOKS.some(b => b.title === title) };
    }
    throw error;
  }
});

// Partial update book - Matches PATCH /api/books/{id}
export const patchBook = createAsyncThunk('book/patch_entity', async ({ id, updates }: { id: number; updates: Partial<IBook> }) => {
  const response = await axios.patch<IBook>(`${API_URL}/${id}`, updates);
  return response.data;
});

// Restore soft-deleted book - Matches PUT /api/books/{id}/restore
export const restoreBook = createAsyncThunk('book/restore', async (id: number) => {
  const response = await axios.put<IBook>(`${API_URL}/${id}/restore`);
  return response.data;
});

// Get book statistics by level - Matches GET /api/books/statistics/count-by-level?level=A1
export const getBookStatisticsByLevel = createAsyncThunk('book/statistics_by_level', async (level?: string) => {
  try {
    const response = await axios.get<{ [key: string]: number }>(`${API_URL}/statistics/count-by-level`, {
      params: level ? { level } : {},
    });
    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 500 || error?.code === 'ERR_BAD_RESPONSE') {
      // Mock implementation
      const stats: { [key: string]: number } = {};
      MOCK_BOOKS.forEach(b => {
        const lvl = b.level || 'UNKNOWN';
        stats[lvl] = (stats[lvl] || 0) + 1;
      });
      return level ? { [level]: stats[level] || 0 } : stats;
    }
    throw error;
  }
});

// Hard delete book (Admin only) - Matches DELETE /api/books/{id}/hard?force=true
export const hardDeleteBook = createAsyncThunk('book/hard_delete', async ({ id, force = true }: { id: number; force?: boolean }) => {
  await axios.delete(`${API_URL}/${id}/hard`, {
    params: { force },
  });
  return { id };
});
