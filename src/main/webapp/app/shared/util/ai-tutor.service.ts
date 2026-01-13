import axios from 'axios';

export interface AiContext {
  question: string;
  correctAnswer: string;
  userAnswer?: string;
}

export interface AiResponse {
  text: string;
}

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

/**
 * Generates an explanation using the Google Gemini API.
 *
 * @param apiKey The user's Gemini API Key.
 * @param context The context of the question (question text, correct answer, user's answer).
 * @returns A promise that resolves to the AI's explanation text.
 * @throws Error if the API call fails or the key is invalid.
 */
export const generateAiExplanation = async (apiKey: string, context: AiContext): Promise<string> => {
  if (!apiKey) {
    throw new Error('API Key is missing');
  }

  const prompt = `
    System: You are a friendly and encouraging English tutor. Your goal is to help a student understand why their answer might be wrong and explain the grammar rule or vocabulary context behind the correct answer. Keep the explanation concise (under 100 words) and easy to understand.

    User Context:
    - Question: "${context.question}"
    - Correct Answer: "${context.correctAnswer}"
    ${context.userAnswer ? `- Student's Answer: "${context.userAnswer}"` : ''}

    Please explain why the correct answer is "${context.correctAnswer}" and provide a helpful tip.
  `;

  const payload = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
  };

  try {
    const response = await axios.post(`${GEMINI_API_URL}?key=${apiKey}`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Parse Gemini response structure
    // Response format: { candidates: [ { content: { parts: [ { text: "..." } ] } } ] }
    const candidate = response.data?.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('No explanation generated.');
    }

    return text;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      // 400 (Bad Request) often means invalid key format or parameters
      // 403 (Forbidden) means the key is invalid or lacks permissions
      if (status === 400 || status === 403) {
        throw new Error('INVALID_KEY');
      }
      throw new Error(error.response?.data?.error?.message || 'Failed to communicate with AI Tutor.');
    }
    throw error;
  }
};
