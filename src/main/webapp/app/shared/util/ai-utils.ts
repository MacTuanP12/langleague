import { toast } from 'react-toastify';
import axios, { AxiosError } from 'axios';

export const USER_GEMINI_KEY_STORAGE = 'USER_GEMINI_KEY';
export const DEFAULT_GEMINI_MODEL = 'gemini-2.0-flash';

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

const cleanAiResponse = (raw: string): string => {
  return raw
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();
};

export const generateVocabularyContent = async (word: string, config: AIConfig): Promise<VocabularyAIResult | null> => {
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
};

export const generateGrammarContent = async (title: string, config: AIConfig): Promise<GrammarAIResult | null> => {
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

const callAI = async <T>(prompt: string, config: AIConfig): Promise<T | null> => {
  const apiKey = config.apiKey ? config.apiKey.trim() : '';

  if (!apiKey) {
    toast.error('Please configure your API Key first.');
    return null;
  }

  try {
    let responseText = '';

    if (config.model.includes('gemini')) {
      // Basic validation for Gemini keys
      if (!apiKey.startsWith('AIza')) {
        throw new Error('Invalid Gemini API Key format. It should start with "AIza".');
      }

      const modelName = config.model;
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

      // eslint-disable-next-line no-console
      console.log('Gemini API Request:', {
        url: url.replace(/key=[^&]+/, 'key=AIzaSy...[masked]'), // Mask key in console
        modelName,
        prompt: prompt.substring(0, 200) + '...', // Log first 200 chars of prompt
      });

      try {
        const aiAxios = axios.create();
        const response = await aiAxios.post(
          url,
          {
            contents: [{ parts: [{ text: prompt }] }],
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
    // Show a cleaner error message to the user
    toast.error(`${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
};
