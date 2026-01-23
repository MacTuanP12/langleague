import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

export type Language = 'en' | 'vi' | 'ja' | 'zh' | 'ko';

const LANGUAGE_MAP: Record<Language, string> = {
  en: 'English',
  vi: 'Vietnamese',
  ja: 'Japanese',
  zh: 'Chinese (Simplified)',
  ko: 'Korean',
};

const GREETING_MAP: Record<Language, string> = {
  en: 'Hello! How can I help you with this grammar topic?',
  vi: 'Xin chào! Tôi có thể giúp gì cho bạn về chủ đề ngữ pháp này?',
  ja: 'こんにちは！この文法について何か質問はありますか？',
  ko: '안녕하세요! 이 문법 주제에 대해 무엇을 도와드릴까요?',
  zh: '你好！关于这个语法点，有什么我可以帮你的吗？',
};

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

const getGenerativeModel = (apiKey: string) => {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    return genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
    });
  } catch (error) {
    console.error(`Error initializing Gemini: ${error instanceof Error ? error.message : String(error)}`);
    throw new Error('INVALID_KEY');
  }
};

const handleApiError = (error: unknown): string => {
  const message = error instanceof Error ? error.message : JSON.stringify(error);

  console.error('Gemini API Error:', message);

  if (message.includes('API key not valid') || message.includes('403')) {
    return 'INVALID_KEY';
  }

  if (message.includes('429') || message.includes('quota')) {
    return 'RATE_LIMIT_ERROR';
  }

  return 'Unexpected AI error. Please check your network and try again.';
};

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Retry wrapper with exponential backoff
const retryWithBackoff = async <T>(fn: () => Promise<T>, maxRetries = 3, initialDelay = 1000): Promise<T> => {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      const errorMsg = error instanceof Error ? error.message : String(error);

      // Don't retry for invalid key errors
      if (errorMsg.includes('INVALID_KEY')) {
        throw error;
      }

      // Check if it's a rate limit error
      if (errorMsg.includes('429') || errorMsg.includes('quota') || errorMsg.includes('RATE_LIMIT')) {
        if (attempt < maxRetries - 1) {
          const delayTime = initialDelay * Math.pow(2, attempt);
          console.warn(`Rate limit hit. Retrying in ${delayTime}ms... (Attempt ${attempt + 1}/${maxRetries})`);
          await delay(delayTime);
          continue;
        }
      }

      // For other errors, don't retry
      throw error;
    }
  }

  throw lastError || new Error('Max retries reached');
};

export const generateAiExplanation = async (apiKey: string, context: AiContext): Promise<string> => {
  if (!apiKey) throw new Error('API Key is missing');

  const model = getGenerativeModel(apiKey);
  const targetLanguage = LANGUAGE_MAP[context.language] || 'English';

  // Tối ưu prompt để giảm input tokens
  const cleanQuestion = context.question.length > 500 ? context.question.substring(0, 500) : context.question;

  const prompt = `
You are a friendly language tutor.
CRITICAL RULES:
- Respond in ${targetLanguage}.
- Keep explanation under 100 words.
- Be simple.

Question: "${cleanQuestion}"
Correct Answer: "${context.correctAnswer}"
${context.userAnswer ? `Student Answer: "${context.userAnswer}"` : ''}

Task: Explain why the correct answer is correct and give one tip.
`;

  try {
    // Wrap API call with retry logic
    const text = await retryWithBackoff(async () => {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 150,
          temperature: 0.7,
        },
      });
      const responseText = result.response.text();
      if (!responseText) throw new Error('No explanation generated');
      return responseText;
    });

    return text;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const generateAiGrammarHelp = async (apiKey: string, context: AiGrammarContext): Promise<string> => {
  if (!apiKey) throw new Error('API Key is missing');

  const model = getGenerativeModel(apiKey);
  const targetLang = LANGUAGE_MAP[context.language] || 'English';

  const cleanGrammarContent = context.grammarContent.length > 1500 ? context.grammarContent.substring(0, 1500) : context.grammarContent;

  const systemPrompt = `
You are an expert English Grammar Tutor.
Student language: ${targetLang}.

CONTEXT:
- Topic: "${context.grammarTopic}"
- Content: """${cleanGrammarContent}"""
- Examples: "${context.grammarExamples || 'None'}"

INSTRUCTIONS:
1. Explain in **${targetLang}**, keep English keywords.
2. Use Markdown & emojis.
3. Keep answers concise (under 150 words).
`;

  const chat = model.startChat({
    history: [
      {
        role: 'user',
        parts: [{ text: systemPrompt }],
      },
      {
        role: 'model',
        parts: [{ text: GREETING_MAP[context.language] || GREETING_MAP['en'] }],
      },

      ...(context.chatHistory?.slice(-5).map(msg => ({
        role: msg.role,
        parts: [{ text: msg.parts }],
      })) || []),
    ],

    generationConfig: {
      maxOutputTokens: 300, // Giới hạn output tokens cho chat ngữ pháp
      temperature: 0.7,
    },

    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ],
  });

  try {
    // Wrap API call with retry logic
    const text = await retryWithBackoff(async () => {
      const result = await chat.sendMessage(context.userQuestion);
      const responseText = result.response.text();
      if (!responseText) throw new Error('No response generated');
      return responseText;
    });

    return text;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
