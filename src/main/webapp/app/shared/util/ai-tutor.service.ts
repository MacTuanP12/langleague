import axios from 'axios';

export interface AiContext {
  question: string;
  correctAnswer: string;
  userAnswer?: string;
}

export interface AiGrammarContext {
  grammarTopic: string;
  grammarContent: string;
  grammarExamples?: string;
  userQuestion: string;
  chatHistory?: Array<{ role: string; content: string }>;
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

/**
 * Generates grammar help using the Google Gemini API with conversation context.
 *
 * @param apiKey The user's Gemini API Key.
 * @param context The grammar context including topic, content, and user question.
 * @returns A promise that resolves to the AI's response text.
 * @throws Error if the API call fails or the key is invalid.
 */
export const generateAiGrammarHelp = async (apiKey: string, context: AiGrammarContext): Promise<string> => {
  if (!apiKey) {
    throw new Error('API Key is missing');
  }

  // Build conversation history for context
  const conversationHistory = context.chatHistory || [];
  const conversationContext =
    conversationHistory.length > 0
      ? conversationHistory.map(msg => `${msg.role === 'user' ? 'Student' : 'Tutor'}: ${msg.content}`).join('\n')
      : '';

  const prompt = `
    System: You are a friendly, patient, and encouraging English grammar tutor. Your goal is to help students understand English grammar concepts through clear explanations, practical examples, and interactive conversation. Keep your responses concise (under 150 words) and easy to understand. Use markdown formatting for better readability.

    Grammar Topic: "${context.grammarTopic}"
    
    Grammar Content:
    ${context.grammarContent}
    
    ${context.grammarExamples ? `Examples:\n${context.grammarExamples}` : ''}
    
    ${conversationContext ? `Previous Conversation:\n${conversationContext}\n` : ''}
    
    Student's Question: "${context.userQuestion}"
    
    Please provide a helpful, clear, and encouraging response. If the student asks for examples, provide practical ones. If they ask about differences, explain clearly with examples.
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

    const candidate = response.data?.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('No response generated.');
    }

    return text;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 400 || status === 403) {
        throw new Error('INVALID_KEY');
      }
      throw new Error(error.response?.data?.error?.message || 'Failed to communicate with AI Tutor.');
    }
    throw error;
  }
};
