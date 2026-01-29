import axios from 'axios';

export type Language = 'en' | 'vi' | 'ja' | 'zh' | 'ko';

export interface AiContext {
  question: string;
  correctAnswer: string;
  userAnswer?: string;
  language: Language;
}

export interface AiGrammarContext {
  grammarTopic: string;
  grammarContent: string;
  grammarExamples?: string;
  userQuestion: string;
  chatHistory?: Array<{
    role: 'user' | 'model';
    parts: string;
  }>;
  language: Language;
}

// Helper function to clean JSON string
const cleanJsonString = (text: string): string => {
  return text
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();
};

export const generateUnitContent = async <T>(
  apiKey: string, // Kept for compatibility but ignored
  prompt: string,
  modelName: string = 'gemini-2.5-flash',
): Promise<T[]> => {
  try {
    const response = await axios.post('/api/ai/generate', {
      prompt,
      model: modelName,
    });

    const text = response.data?.text;
    if (!text || text.trim().length === 0) {
      throw new Error('No content generated from AI');
    }

    const cleanJson = cleanJsonString(text);

    // Try to parse JSON
    let parsedData: T[];
    try {
      parsedData = JSON.parse(cleanJson) as T[];
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Cleaned JSON string:', cleanJson);
      throw new Error('Failed to parse AI response as JSON. The AI may not have returned valid JSON format.');
    }

    // Validate that we got an array
    if (!Array.isArray(parsedData)) {
      throw new Error('AI response is not an array. Expected a JSON array.');
    }

    // Validate array is not empty
    if (parsedData.length === 0) {
      throw new Error('AI response is an empty array. No content was generated.');
    }

    return parsedData;
  } catch (error) {
    console.error('AI Generation Error:', error);

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

    // Re-throw if it's already an Error with a message
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Failed to generate content via Backend API');
  }
};

// Helper function to get language name from code
const getLanguageName = (lang: Language): string => {
  const langMap: Record<Language, string> = {
    en: 'English',
    vi: 'Vietnamese',
    ja: 'Japanese',
    zh: 'Chinese',
    ko: 'Korean',
  };
  return langMap[lang] || 'English';
};

// Generate AI explanation for exercise questions
export const generateAiExplanation = async (apiKey: string, context: AiContext): Promise<string> => {
  try {
    const languageName = getLanguageName(context.language);

    let prompt = `You are a helpful language learning tutor. Explain the following exercise question and answer in ${languageName}.\n\n`;
    prompt += `Question: ${context.question}\n\n`;
    prompt += `Correct Answer: ${context.correctAnswer}\n\n`;

    if (context.userAnswer) {
      prompt += `Student's Answer: ${context.userAnswer}\n\n`;
      prompt += `Please explain why the correct answer is correct, and if the student's answer is wrong, explain why it's incorrect. `;
    } else {
      prompt += `Please explain why this is the correct answer. `;
    }

    prompt += `Provide a clear, educational explanation that helps the student understand the concept. Use ${languageName} for your response.`;

    const response = await axios.post('/api/ai/generate', {
      prompt,
      model: 'gemini-2.5-flash',
    });

    const text = response.data?.text;
    if (!text || text.trim().length === 0) {
      throw new Error('No explanation generated from AI');
    }

    return text;
  } catch (error) {
    console.error('AI Explanation Error:', error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;

        if (status === 401 || status === 403) {
          throw new Error('INVALID_KEY');
        } else if (status === 429) {
          throw new Error('RATE_LIMIT_ERROR');
        } else {
          const errorMessage = errorData?.error || error.message || 'Failed to generate explanation';
          throw new Error(errorMessage);
        }
      } else if (error.request) {
        throw new Error('Network error: Could not reach AI service');
      }
    }

    throw error instanceof Error ? error : new Error('Failed to generate AI explanation');
  }
};

// Generate AI grammar help with chat history support
export const generateAiGrammarHelp = async (apiKey: string, context: AiGrammarContext): Promise<string> => {
  try {
    const languageName = getLanguageName(context.language);

    let prompt = `You are a helpful language learning tutor specializing in grammar. Help the student understand the following grammar topic. Respond in ${languageName}.\n\n`;
    prompt += `Grammar Topic: ${context.grammarTopic}\n\n`;
    prompt += `Grammar Content: ${context.grammarContent}\n\n`;

    if (context.grammarExamples) {
      prompt += `Examples: ${context.grammarExamples}\n\n`;
    }

    // Add chat history if available
    if (context.chatHistory && context.chatHistory.length > 0) {
      prompt += `Previous conversation:\n`;
      context.chatHistory.forEach(msg => {
        if (msg.role === 'user') {
          prompt += `Student: ${msg.parts}\n`;
        } else {
          prompt += `Tutor: ${msg.parts}\n`;
        }
      });
      prompt += `\n`;
    }

    prompt += `Student's Question: ${context.userQuestion}\n\n`;
    prompt += `Please provide a helpful, clear explanation that addresses the student's question. Be conversational and educational.`;

    const response = await axios.post('/api/ai/generate', {
      prompt,
      model: 'gemini-2.5-flash',
    });

    const text = response.data?.text;
    if (!text || text.trim().length === 0) {
      throw new Error('No response generated from AI');
    }

    return text;
  } catch (error) {
    console.error('AI Grammar Help Error:', error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;

        if (status === 401 || status === 403) {
          throw new Error('INVALID_KEY');
        } else if (status === 429) {
          throw new Error('RATE_LIMIT_ERROR');
        } else {
          const errorMessage = errorData?.error || error.message || 'Failed to generate grammar help';
          throw new Error(errorMessage);
        }
      } else if (error.request) {
        throw new Error('Network error: Could not reach AI service');
      }
    }

    throw error instanceof Error ? error : new Error('Failed to generate AI grammar help');
  }
};
