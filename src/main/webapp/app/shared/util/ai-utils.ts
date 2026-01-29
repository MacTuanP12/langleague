import { toast } from 'react-toastify';
import axios from 'axios';

// Constants kept for compatibility but not used for storage anymore
export const USER_GEMINI_KEY_STORAGE = 'USER_GEMINI_KEY';
export const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';

export interface AIConfig {
  apiKey?: string; // Optional/Ignored
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

export interface ExerciseAIResult {
  exerciseText: string;
  options: {
    optionText: string;
    isCorrect: boolean;
  }[];
}

const cleanAiResponse = (raw: string): string => {
  return raw
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();
};

const callBackendAI = async <T>(prompt: string, model: string): Promise<T | null> => {
  try {
    const response = await axios.post('/api/ai/generate', {
      prompt,
      model,
    });

    const text = response.data?.text;
    if (!text || text.trim().length === 0) {
      throw new Error('No content generated from AI');
    }

    const jsonString = cleanAiResponse(text);

    // Try to parse JSON
    let parsedData: T;
    try {
      parsedData = JSON.parse(jsonString) as T;
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Cleaned JSON string:', jsonString);
      throw new Error('Failed to parse AI response as JSON. The AI may not have returned valid JSON format.');
    }

    return parsedData;
  } catch (error) {
    console.error('AI Generation Error:', error);

    // Don't show toast here - let the calling component handle error display
    // This allows for more specific error messages in the UI

    if (axios.isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;

        if (status === 400) {
          const errorMessage = errorData?.error || 'Invalid request to AI service';
          throw new Error(errorMessage);
        } else if (status === 401 || status === 403) {
          throw new Error('API authentication failed. Please contact administrator.');
        } else if (status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        } else if (status >= 500) {
          throw new Error('AI service is temporarily unavailable. Please try again later.');
        } else {
          const errorMessage = errorData?.error || error.message || 'Failed to generate content';
          throw new Error(errorMessage);
        }
      } else if (error.request) {
        throw new Error('Network error: Could not reach AI service. Please check your connection.');
      }
    }

    // Re-throw if it's already an Error
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Failed to generate content via AI Service');
  }
};

export const generateVocabularyContent = async (word: string, config: AIConfig): Promise<VocabularyAIResult | null> => {
  const prompt = `Role: You are a dictionary editor.
Task: Provide details for the word "${word}".

Rules:
- 'word': The word itself ("${word}").
- 'definition': Meaning in ${config.nativeLang}.
- 'example': A sentence in ${config.targetLang} using the word.
- 'phonetic': IPA phonetic transcription (optional but recommended).

Output: Valid JSON Object ONLY. Do not include any markdown formatting, code blocks, or explanations. Return ONLY the JSON object.

Format:
{
  "word": "${word}",
  "definition": "...",
  "example": "...",
  "phonetic": "..."
}`;

  return await callBackendAI<VocabularyAIResult>(prompt, config.model);
};

export const generateGrammarContent = async (title: string, config: AIConfig): Promise<GrammarAIResult | null> => {
  const prompt = `Role: You are a grammar teacher.
Task: Explain the grammar point "${title}".

Rules:
- 'title': The title itself ("${title}").
- 'description': Explanation of usage in ${config.nativeLang}. Use Markdown for formatting (bold, lists, code blocks).
- 'example': Example sentences in ${config.targetLang}. Show multiple examples if helpful.

Output: Valid JSON Object ONLY. Do not include any markdown formatting around the JSON, code blocks, or explanations. Return ONLY the JSON object.

Format:
{
  "title": "${title}",
  "description": "...",
  "example": "..."
}`;

  return await callBackendAI<GrammarAIResult>(prompt, config.model);
};

export const generateExerciseContent = async (topic: string, config: AIConfig): Promise<ExerciseAIResult | null> => {
  const prompt = `Role: Quiz creator.
Task: Create a multiple choice question about "${topic}".

Rules:
- 'exerciseText': The question in ${config.targetLang}.
- 'options': Array of answer choices. Must have at least 2 options, and exactly ONE option must have "isCorrect": true.
- Each option must have "optionText" (string) and "isCorrect" (boolean).

Output: Valid JSON Object ONLY. Do not include any markdown formatting, code blocks, or explanations. Return ONLY the JSON object.

Format:
{
  "exerciseText": "Question content",
  "options": [
    { "optionText": "Option A", "isCorrect": false },
    { "optionText": "Option B", "isCorrect": true },
    { "optionText": "Option C", "isCorrect": false },
    { "optionText": "Option D", "isCorrect": false }
  ]
}`;

  return await callBackendAI<ExerciseAIResult>(prompt, config.model);
};
