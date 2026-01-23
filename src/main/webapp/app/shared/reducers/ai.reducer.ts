import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { DEFAULT_GEMINI_MODEL } from 'app/shared/util/ai-utils';

export const USER_GEMINI_KEY_STORAGE = 'USER_GEMINI_KEY';

export interface AIConfig {
  apiKey: string;
  model: string;
  targetLang: string;
  nativeLang: string;
}

export interface VocabularyAIResult {
  word: string;
  definition: string;
  example: string;
  phonetic?: string;
}

export interface GrammarAIResult {
  title: string;
  description: string;
  example: string;
}

interface AIState {
  loading: boolean;
  errorMessage: string | null;
  vocabularyResult: VocabularyAIResult | null;
  grammarResult: GrammarAIResult | null;
}

const initialState: AIState = {
  loading: false,
  errorMessage: null,
  vocabularyResult: null,
  grammarResult: null,
};

const cleanAiResponse = (raw: string): string => {
  return raw
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();
};

const handleGeminiError = (error: unknown, modelName: string) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error;
    const status = axiosError.response?.status;
    const errorData = axiosError.response?.data;
    const errorMessage = errorData?.error?.message || axiosError.message;

    console.error('Gemini API Error Details:', {
      status,
      errorMessage,
      errorData,
      modelName,
    });

    if (status === 404) {
      throw new Error(`Model '${modelName}' not found (404). Please try selecting a different model.`);
    } else if (status === 400 && errorMessage.includes('API key')) {
      if (errorMessage.includes('leaked')) {
        throw new Error('Your API key was reported as leaked by Google. Please generate a NEW key at aistudio.google.com.');
      }
      throw new Error('Invalid API Key. Please check your Google AI Studio key.');
    } else if (status === 403) {
      if (errorMessage.includes('leaked')) {
        throw new Error('Your API key was reported as leaked by Google. Please generate a NEW key at aistudio.google.com.');
      }
      throw new Error(`Access denied (403): ${errorMessage}`);
    } else if (status === 429) {
      if (errorMessage.includes('limit: 0')) {
        throw new Error(
          `Model '${modelName}' is not available for browser requests on your plan. Please switch to 'Gemini 1.5 Flash' in settings.`,
        );
      }
      throw new Error('Quota exceeded. Please check your plan or try a different model.');
    } else if (status === 401) {
      throw new Error(`Authentication failed (401): ${errorMessage}. Please check your API Key.`);
    }
    throw new Error(`Gemini API Error: ${errorMessage}`);
  }
  throw error;
};

const handleOpenAIError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error;
    const status = axiosError.response?.status;
    const errorData = axiosError.response?.data;
    const errorMessage = errorData?.error?.message || axiosError.message;

    console.error('OpenAI API Error Details:', {
      status,
      errorMessage,
      errorData,
    });

    if (status === 401) {
      throw new Error('Invalid OpenAI API Key. Please check your key.');
    } else if (status === 429) {
      throw new Error('Rate limit exceeded. Please check your OpenAI plan.');
    }
    throw new Error(`OpenAI API Error: ${errorMessage}`);
  }
  throw error;
};

// Async Thunks
export const generateVocabularyContent = createAsyncThunk(
  'ai/generateVocabulary',
  async ({ word, config }: { word: string; config: AIConfig }) => {
    const prompt = `
      Role: You are a dictionary editor.
      Task: Provide details for the word "${word}".
      Rules:
      - 'word': The word itself ("${word}").
      - 'definition': Meaning in **${config.nativeLang}**.
      - 'example': A sentence in **${config.targetLang}** using the word.
      - 'phonetic': IPA phonetic transcription.
      Output: Valid JSON Object ONLY.
      Format:
      {
        "word": "...",
        "definition": "...",
        "example": "...",
        "phonetic": "..."
      }
    `;

    return await callAI<VocabularyAIResult>(prompt, config);
  },
);

export const generateGrammarContent = createAsyncThunk(
  'ai/generateGrammar',
  async ({ title, config }: { title: string; config: AIConfig }) => {
    const prompt = `
      Role: You are a grammar teacher.
      Task: Explain the grammar point "${title}".
      Rules:
      - 'title': The title itself ("${title}").
      - 'description': Explanation of usage in **${config.nativeLang}**. Use Markdown for formatting (bold, lists).
      - 'example': Example sentences in **${config.targetLang}**.
      Output: Valid JSON Object ONLY.
      Format:
      {
        "title": "...",
        "description": "...",
        "example": "..."
      }
    `;

    return await callAI<GrammarAIResult>(prompt, config);
  },
);

const callAI = async <T>(prompt: string, config: AIConfig): Promise<T> => {
  const apiKey = config.apiKey ? config.apiKey.trim() : '';

  if (!apiKey) {
    throw new Error('Please configure your API Key first.');
  }

  try {
    let responseText = '';

    if (config.model.includes('gemini')) {
      if (!apiKey.startsWith('AIza')) {
        throw new Error('Invalid Gemini API Key format. It should start with "AIza".');
      }

      const modelName = config.model;
      // Use v1beta for all models as it is the most compatible endpoint for browser keys
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

      // eslint-disable-next-line no-console
      console.log('Gemini API Request:', {
        url: url.replace(/key=[^&]+/, 'key=AIzaSy...[masked]'), // Mask key in console
        modelName,
        prompt: prompt.substring(0, 200) + '...', // Log first 200 chars of prompt
      });

      try {
        // Create a new axios instance to avoid global interceptors
        const aiAxios = axios.create();

        // Remove Content-Type header to let browser handle it, or force it if needed.
        // Some proxies/browsers dislike explicit Content-Type with simple CORS requests, but Gemini needs it.
        // We will try standard post.

        const response = await aiAxios.post(
          url,
          {
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        const data = response.data;
        if (
          data.candidates &&
          data.candidates.length > 0 &&
          data.candidates[0].content &&
          data.candidates[0].content.parts &&
          data.candidates[0].content.parts.length > 0
        ) {
          responseText = data.candidates[0].content.parts[0].text;
        } else {
          throw new Error('Invalid response format from Gemini API');
        }
      } catch (error: unknown) {
        handleGeminiError(error, modelName);
      }
    } else {
      // OpenAI
      try {
        const aiAxios = axios.create();
        const response = await aiAxios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: config.model,
            messages: [
              { role: 'system', content: 'You are a helpful educational assistant. Output valid JSON only.' },
              { role: 'user', content: prompt },
            ],
            temperature: 0.7,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
          },
        );

        const data = response.data;
        if (data.choices && data.choices.length > 0 && data.choices[0].message) {
          responseText = data.choices[0].message.content;
        } else {
          throw new Error('Invalid response format from OpenAI API');
        }
      } catch (error: unknown) {
        handleOpenAIError(error);
      }
    }

    const jsonString = cleanAiResponse(responseText);
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('AI Generation Error:', error);
    throw error; // Re-throw to be caught by rejected action
  }
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    resetAIState(state) {
      state.loading = false;
      state.errorMessage = null;
      state.vocabularyResult = null;
      state.grammarResult = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(generateVocabularyContent.pending, state => {
        state.loading = true;
        state.errorMessage = null;
        state.vocabularyResult = null;
      })
      .addCase(generateVocabularyContent.fulfilled, (state, action) => {
        state.loading = false;
        state.vocabularyResult = action.payload;
      })
      .addCase(generateVocabularyContent.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to generate vocabulary content';
        toast.error(state.errorMessage);
      })
      .addCase(generateGrammarContent.pending, state => {
        state.loading = true;
        state.errorMessage = null;
        state.grammarResult = null;
      })
      .addCase(generateGrammarContent.fulfilled, (state, action) => {
        state.loading = false;
        state.grammarResult = action.payload;
      })
      .addCase(generateGrammarContent.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to generate grammar content';
        toast.error(state.errorMessage);
      });
  },
});

export const { resetAIState } = aiSlice.actions;

export default aiSlice.reducer;
