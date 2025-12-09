import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { IChapter, IWord, IGrammar, IListeningExercise, ISpeakingExercise, IReadingExercise, IWritingExercise } from '../model/models';

const API_URL = '/api/chapters';
const USE_MOCK = false;
const MOCK_CHAPTERS: IChapter[] = [
  {
    id: 1,
    bookId: 1,
    title: '첫 만남 - Cuộc gặp đầu tiên',
    orderIndex: 1,
    description: 'Kim Ji-young gặp người đàn ông của đời mình lần đầu tiên',
    pageStart: 1,
    pageEnd: 15,
    totalWords: 45,
    totalGrammars: 8,
    totalExercises: 12,
  },
  {
    id: 2,
    bookId: 1,
    title: '직장 생활 - Cuộc sống công sở',
    orderIndex: 2,
    description: 'Những thử thách trong môi trường làm việc',
    pageStart: 16,
    pageEnd: 32,
    totalWords: 52,
    totalGrammars: 10,
    totalExercises: 15,
  },
  {
    id: 3,
    bookId: 1,
    title: '결혼과 가족 - Hôn nhân và gia đình',
    orderIndex: 3,
    description: 'Cuộc sống sau khi kết hôn và những kỳ vọng xã hội',
    pageStart: 33,
    pageEnd: 50,
    totalWords: 48,
    totalGrammars: 9,
    totalExercises: 14,
  },
  {
    id: 4,
    bookId: 2,
    title: '용기란 무엇인가 - Dũng khí là gì',
    orderIndex: 1,
    description: 'Giới thiệu khái niệm dũng khí trong tâm lý học Adler',
    pageStart: 1,
    pageEnd: 20,
    totalWords: 38,
    totalGrammars: 7,
    totalExercises: 10,
  },
  {
    id: 5,
    bookId: 2,
    title: '타인의 시선 - Ánh mắt người khác',
    orderIndex: 2,
    description: 'Học cách không bị ảnh hưởng bởi đánh giá của người khác',
    pageStart: 21,
    pageEnd: 45,
    totalWords: 42,
    totalGrammars: 8,
    totalExercises: 11,
  },
  {
    id: 6,
    bookId: 3,
    title: '감정이 없는 소년 - Cậu bé không cảm xúc',
    orderIndex: 1,
    description: 'Giới thiệu Yunjae và hội chứng amygdala',
    pageStart: 1,
    pageEnd: 25,
    totalWords: 55,
    totalGrammars: 12,
    totalExercises: 16,
  },
];

const MOCK_WORDS: IWord[] = [
  { id: 1, chapterId: 1, text: '만남', meaning: 'cuộc gặp, sự gặp gỡ', pronunciation: 'man-nam', partOfSpeech: 'danh từ', orderIndex: 1 },
  { id: 2, chapterId: 1, text: '첫사랑', meaning: 'tình yêu đầu', pronunciation: 'cheot-sa-rang', partOfSpeech: 'danh từ', orderIndex: 2 },
  {
    id: 3,
    chapterId: 1,
    text: '설레다',
    meaning: 'hồi hộp, rung động',
    pronunciation: 'seol-le-da',
    partOfSpeech: 'động từ',
    orderIndex: 3,
  },
  { id: 4, chapterId: 1, text: '인상', meaning: 'ấn tượng', pronunciation: 'in-sang', partOfSpeech: 'danh từ', orderIndex: 4 },
  {
    id: 5,
    chapterId: 2,
    text: '직장',
    meaning: 'nơi làm việc, công ty',
    pronunciation: 'jik-jang',
    partOfSpeech: 'danh từ',
    orderIndex: 1,
  },
  { id: 6, chapterId: 2, text: '동료', meaning: 'đồng nghiệp', pronunciation: 'dong-ryo', partOfSpeech: 'danh từ', orderIndex: 2 },
  { id: 7, chapterId: 2, text: '승진', meaning: 'thăng chức', pronunciation: 'seung-jin', partOfSpeech: 'danh từ', orderIndex: 3 },
];

const MOCK_GRAMMARS: IGrammar[] = [
  {
    id: 1,
    chapterId: 1,
    title: '-았/었어요 (Thì quá khứ)',
    pattern: 'Động từ + 았/었어요',
    meaning: 'Diễn tả hành động đã xảy ra trong quá khứ',
    explanation: 'Dùng 았어요 sau nguyên âm sáng (ㅏ, ㅗ), dùng 었어요 sau nguyên âm tối',
    orderIndex: 1,
  },
  {
    id: 2,
    chapterId: 1,
    title: '-(으)ㄴ/는 (Định ngữ hiện tại)',
    pattern: 'Động từ + (으)ㄴ/는 + Danh từ',
    meaning: 'Bổ nghĩa cho danh từ đứng sau',
    explanation: 'Dùng để tạo câu phức tạp hơn, mô tả đặc điểm của danh từ',
    orderIndex: 2,
  },
  {
    id: 3,
    chapterId: 2,
    title: '-고 싶다 (Muốn)',
    pattern: 'Động từ + 고 싶다',
    meaning: 'Diễn tả mong muốn, ý định',
    explanation: 'Dùng để nói về điều mình muốn làm',
    orderIndex: 1,
  },
];

// Mock Exercises
const MOCK_LISTENING_EXERCISES: IListeningExercise[] = [
  {
    id: 1,
    chapterId: 1,
    skillType: 'LISTENING',
    orderIndex: 1,
    audioUrl: '/audio/chapter1-listening1.mp3',
    question: 'Nghe đoạn hội thoại và chọn câu trả lời đúng: Họ gặp nhau ở đâu?',
    correctAnswer: 'B',
    maxScore: 10,
  },
  {
    id: 2,
    chapterId: 1,
    skillType: 'LISTENING',
    orderIndex: 2,
    audioUrl: '/audio/chapter1-listening2.mp3',
    question: 'Cô ấy cảm thấy thế nào khi gặp anh ấy lần đầu?',
    correctAnswer: 'A',
    maxScore: 10,
  },
  {
    id: 3,
    chapterId: 2,
    skillType: 'LISTENING',
    orderIndex: 1,
    audioUrl: '/audio/chapter2-listening1.mp3',
    question: 'Vấn đề gì xảy ra ở công ty?',
    correctAnswer: 'C',
    maxScore: 10,
  },
];

const MOCK_SPEAKING_EXERCISES: ISpeakingExercise[] = [
  {
    id: 1,
    chapterId: 1,
    skillType: 'SPEAKING',
    orderIndex: 1,
    prompt: 'Hãy giới thiệu về cuộc gặp đầu tiên của bạn với một người quan trọng. Sử dụng mẫu câu: 처음 만났을 때...',
    sampleAudio: '/audio/chapter1-speaking1-sample.mp3',
    targetPhrase: '처음 만났을 때 정말 설렜어요',
    maxScore: 15,
  },
  {
    id: 2,
    chapterId: 1,
    skillType: 'SPEAKING',
    orderIndex: 2,
    prompt: 'Mô tả ấn tượng đầu tiên của bạn về một người bạn mới. Dùng từ vựng: 인상, 설레다, 첫사랑',
    targetPhrase: '첫 인상이 정말 좋았어요',
    maxScore: 15,
  },
];

const MOCK_READING_EXERCISES: IReadingExercise[] = [
  {
    id: 1,
    chapterId: 1,
    skillType: 'READING',
    orderIndex: 1,
    passage:
      '김지영은 대학교에서 처음 그를 만났다. 그날 날씨가 정말 좋았고 캠퍼스의 벚꽃이 활짝 피어 있었다. 그는 도서관 앞에서 책을 읽고 있었고, 지영은 그의 집중하는 모습에 첫눈에 반했다.',
    question: '김지영은 어디서 그를 처음 만났나요?',
    correctAnswer: 'A',
    maxScore: 10,
  },
  {
    id: 2,
    chapterId: 1,
    skillType: 'READING',
    orderIndex: 2,
    passage:
      '첫 만남 이후로 지영은 매일 그 시간에 도서관에 갔다. 그와 이야기를 나누고 싶었지만 용기가 나지 않았다. 일주일이 지나서야 드디어 그에게 말을 걸었다.',
    question: '지영이 그에게 말을 걸기까지 얼마나 걸렸나요?',
    correctAnswer: 'B',
    maxScore: 10,
  },
  {
    id: 3,
    chapterId: 2,
    skillType: 'READING',
    orderIndex: 1,
    passage: '회사 생활은 생각보다 힘들었다. 아침 일찍 출근해서 저녁 늦게까지 일해야 했다. 동료들은 친절했지만 업무 압박은 심했다.',
    question: '회사 생활에서 가장 힘든 점은 무엇인가요?',
    correctAnswer: 'C',
    maxScore: 10,
  },
];

const MOCK_WRITING_EXERCISES: IWritingExercise[] = [
  {
    id: 1,
    chapterId: 1,
    skillType: 'WRITING',
    orderIndex: 1,
    prompt:
      'Viết một đoạn văn ngắn (50-80 từ) về cuộc gặp gỡ đầu tiên đáng nhớ của bạn. Sử dụng ít nhất 3 từ vựng đã học: 만남, 설레다, 인상',
    sampleAnswer:
      '작년 봄에 친구 소개로 새로운 사람을 만났어요. 첫 만남이었지만 정말 설렜어요. 그 사람의 첫 인상이 너무 좋았고 대화도 잘 통했어요. 지금은 제일 친한 친구가 되었어요.',
    minWords: 50,
    maxScore: 20,
  },
  {
    id: 2,
    chapterId: 2,
    skillType: 'WRITING',
    orderIndex: 1,
    prompt: 'Mô tả một ngày làm việc điển hình của bạn. Sử dụng ngữ pháp -았/었어요 và từ vựng về công việc (60-100 từ)',
    sampleAnswer:
      '오늘 아침 8시에 회사에 출근했어요. 먼저 이메일을 확인하고 회의 준비를 했어요. 오전에는 팀 회의가 있었고 점심은 동료들과 함께 먹었어요. 오후에는 프로젝트 작업을 했어요. 저녁 6시에 퇴근했어요.',
    minWords: 60,
    maxScore: 20,
  },
];

export const getChapters = createAsyncThunk('chapter/fetch_all', async () => {
  const response = await axios.get<IChapter[]>(API_URL);
  return response.data;
});

export const getChaptersByBookId = createAsyncThunk('chapter/fetch_by_book', async (bookId: number) => {
  if (USE_MOCK) {
    return MOCK_CHAPTERS.filter(c => c.bookId === bookId);
  }
  const response = await axios.get<IChapter[]>(`${API_URL}/book/${bookId}`);
  return response.data;
});

export const getChapter = createAsyncThunk('chapter/fetch_entity', async (id: number) => {
  if (USE_MOCK) {
    return MOCK_CHAPTERS.find(c => c.id === id) || MOCK_CHAPTERS[0];
  }
  const response = await axios.get<IChapter>(`${API_URL}/${id}`);
  return response.data;
});

export const createChapter = createAsyncThunk('chapter/create_entity', async (entity: IChapter) => {
  const response = await axios.post<IChapter>(API_URL, entity);
  return response.data;
});

export const updateChapter = createAsyncThunk('chapter/update_entity', async ({ id, chapter }: { id: number; chapter: IChapter }) => {
  const response = await axios.put<IChapter>(`${API_URL}/${id}`, chapter);
  return response.data;
});

export const deleteChapter = createAsyncThunk('chapter/delete_entity', async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
  return { id };
});

// Get chapters by book - Matches GET /api/chapters/book/{bookId}
export const getChaptersByBook = createAsyncThunk('chapter/fetch_by_book_id', async (bookId: number) => {
  if (USE_MOCK) {
    return MOCK_CHAPTERS.filter(c => c.bookId === bookId);
  }
  const response = await axios.get<IChapter[]>(`${API_URL}/book/${bookId}`);
  return response.data;
});

// Get chapter content (words, grammars, exercises)
export const getChapterWords = createAsyncThunk('chapter/fetch_words', async (chapterId: number) => {
  if (USE_MOCK) {
    return MOCK_WORDS.filter(w => w.chapterId === chapterId);
  }
  const response = await axios.get<IWord[]>(`${API_URL}/${chapterId}/words`);
  return response.data;
});

export const getChapterGrammars = createAsyncThunk('chapter/fetch_grammars', async (chapterId: number) => {
  if (USE_MOCK) {
    return MOCK_GRAMMARS.filter(g => g.chapterId === chapterId);
  }
  const response = await axios.get<IGrammar[]>(`${API_URL}/${chapterId}/grammars`);
  return response.data;
});

export const getChapterExercises = createAsyncThunk('chapter/fetch_exercises', async (chapterId: number) => {
  if (USE_MOCK) {
    return {
      listening: MOCK_LISTENING_EXERCISES.filter(e => e.chapterId === chapterId),
      speaking: MOCK_SPEAKING_EXERCISES.filter(e => e.chapterId === chapterId),
      reading: MOCK_READING_EXERCISES.filter(e => e.chapterId === chapterId),
      writing: MOCK_WRITING_EXERCISES.filter(e => e.chapterId === chapterId),
    };
  }
  const response = await axios.get<{
    listening: IListeningExercise[];
    speaking: ISpeakingExercise[];
    reading: IReadingExercise[];
    writing: IWritingExercise[];
  }>(`${API_URL}/${chapterId}/exercises`);
  return response.data;
});

// ==================== NEW API ENDPOINTS ====================

// Get chapter with full details - Matches GET /api/chapters/{id}/detail
export const getChapterDetails = createAsyncThunk('chapter/fetch_details', async (id: number) => {
  if (USE_MOCK) {
    const chapter = MOCK_CHAPTERS.find(c => c.id === id) || MOCK_CHAPTERS[0];
    return {
      ...chapter,
      words: MOCK_WORDS.filter(w => w.chapterId === id),
      grammars: MOCK_GRAMMARS.filter(g => g.chapterId === id),
      exercises: {
        listening: MOCK_LISTENING_EXERCISES.filter(e => e.chapterId === id),
        speaking: MOCK_SPEAKING_EXERCISES.filter(e => e.chapterId === id),
        reading: MOCK_READING_EXERCISES.filter(e => e.chapterId === id),
        writing: MOCK_WRITING_EXERCISES.filter(e => e.chapterId === id),
      },
    };
  }
  // Backend uses /detail not /details
  const response = await axios.get<any>(`${API_URL}/${id}/detail`);
  return response.data;
});

// Search chapters - Matches GET /api/chapters/search?keyword=xxx
export const searchChapters = createAsyncThunk('chapter/search', async (params: { keyword?: string; page?: number; size?: number }) => {
  if (USE_MOCK) {
    const keyword = params.keyword?.toLowerCase() || '';
    return MOCK_CHAPTERS.filter(c => c.title.toLowerCase().includes(keyword) || c.description?.toLowerCase().includes(keyword));
  }
  const response = await axios.get<IChapter[]>(`${API_URL}/search`, {
    params: {
      keyword: params.keyword,
      page: params.page || 0,
      size: params.size || 20,
    },
  });
  return response.data;
});

// Count chapters in book - Matches GET /api/chapters/count/book/{bookId}
export const countChaptersByBook = createAsyncThunk('chapter/count_by_book', async (bookId: number) => {
  if (USE_MOCK) {
    return MOCK_CHAPTERS.filter(c => c.bookId === bookId).length;
  }
  const response = await axios.get<number>(`${API_URL}/count/book/${bookId}`);
  return response.data;
});

// Get next chapter - Matches GET /api/chapters/{id}/next
export const getNextChapter = createAsyncThunk('chapter/fetch_next', async (id: number) => {
  if (USE_MOCK) {
    const current = MOCK_CHAPTERS.find(c => c.id === id);
    if (!current) return null;
    const bookChapters = MOCK_CHAPTERS.filter(c => c.bookId === current.bookId).sort((a, b) => a.orderIndex - b.orderIndex);
    const currentIndex = bookChapters.findIndex(c => c.id === id);
    return currentIndex >= 0 && currentIndex < bookChapters.length - 1 ? bookChapters[currentIndex + 1] : null;
  }
  try {
    const response = await axios.get<IChapter>(`${API_URL}/${id}/next`);
    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 404) return null;
    throw error;
  }
});

// Get previous chapter - Matches GET /api/chapters/{id}/previous
export const getPreviousChapter = createAsyncThunk('chapter/fetch_previous', async (id: number) => {
  if (USE_MOCK) {
    const current = MOCK_CHAPTERS.find(c => c.id === id);
    if (!current) return null;
    const bookChapters = MOCK_CHAPTERS.filter(c => c.bookId === current.bookId).sort((a, b) => a.orderIndex - b.orderIndex);
    const currentIndex = bookChapters.findIndex(c => c.id === id);
    return currentIndex > 0 ? bookChapters[currentIndex - 1] : null;
  }
  try {
    const response = await axios.get<IChapter>(`${API_URL}/${id}/previous`);
    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 404) return null;
    throw error;
  }
});

// Partial update chapter - Matches PATCH /api/chapters/{id}
export const patchChapter = createAsyncThunk(
  'chapter/patch_entity',
  async ({ id, updates }: { id: number; updates: Partial<IChapter> }) => {
    const response = await axios.patch<IChapter>(`${API_URL}/${id}`, updates);
    return response.data;
  },
);

// Reorder chapters - Matches PUT /api/chapters/reorder
export const reorderChapters = createAsyncThunk('chapter/reorder', async (chapters: IChapter[]) => {
  const response = await axios.put<IChapter[]>(`${API_URL}/reorder`, chapters);
  return response.data;
});
