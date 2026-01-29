import { GoogleGenAI, Type } from "@google/genai";
import { SearchFilters, Professional } from '../types';

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export interface AIAssistanceResponse {
  answer: string;
  suggestions: {
    profession: string;
    city?: string;
  }[];
  recommendedProIds: string[];
}

export interface ChatHistoryItem {
  role: 'user' | 'model';
  parts: { text: string }[];
}

const withRetry = async <T>(fn: () => Promise<T>, maxRetries = 2, initialDelay = 1000): Promise<T> => {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      const errorMsg = err?.message || '';
      const isRetryable = errorMsg.includes('503') || errorMsg.includes('429') || err?.status === 503 || err?.status === 429;
      if (!isRetryable || i === maxRetries - 1) throw err;
      await new Promise(resolve => setTimeout(resolve, initialDelay * Math.pow(2, i)));
    }
  }
  throw lastError;
};

export const getAIAssistance = async (
  query: string, 
  availablePros: Professional[], 
  language: string,
  history: ChatHistoryItem[] = [],
  preferredCity?: string
): Promise<AIAssistanceResponse> => {
  const langMap: Record<string, string> = {
    en: 'English', fr: 'French', es: 'Spanish', it: 'Italian', nl: 'Dutch', ru: 'Russian', uk: 'Ukrainian'
  };
  const targetLanguage = langMap[language.split('-')[0]] || 'English';

  // Pré-filtrage intelligent
  let filteredPros = availablePros;
  if (preferredCity) {
    const cityLower = preferredCity.toLowerCase();
    filteredPros = availablePros.filter(p => 
      p.cities?.some(c => c.toLowerCase().includes(cityLower)) ||
      p.address?.toLowerCase().includes(cityLower)
    );
  }
  
  if (filteredPros.length < 15) {
    const others = availablePros.filter(p => !filteredPros.includes(p));
    filteredPros = [...filteredPros, ...others.slice(0, 20 - filteredPros.length)];
  }

  // Minification du contexte pour l'IA avec focus sur la géographie
  const prosContext = filteredPros.slice(0, 25).map(p => ({
    id: p.id,
    j: p.professions?.[0], 
    s: p.specialties?.slice(0, 4), 
    l: p.languages,
    a: p.address, // ADRESSE PRÉCISE
    cc: p.cities, // COUVERTURE GÉOGRAPHIQUE COMPLÈTE
    r: p.rating,
    x: p.yearsOfExperience
  }));

  const contents = [
    ...history.slice(-6), 
    { role: 'user' as const, parts: [{ text: query }] }
  ];

  try {
    const ai = getAIClient();
    
    const response = await withRetry(async () => {
      return await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: contents,
        config: {
          systemInstruction: `You are ExpaLink AI, a premium concierge for expats in Spain.
          - CONTEXT DATA: ${JSON.stringify(prosContext)}
          - MATCHING RULE: 
            1. Use the specific address 'a' for precise local proximity matching.
            2. If 'a' is unavailable or not in the requested area, use the geographic coverage 'cc' (list of cities the pro serves).
            3. Consider languages 'l' and specialties 's'.
          - STYLE: Professional, helpful, warm. 
          - RULE: Do not mention pro names in the 'answer'. Refer to them as "a specialist" or "this expert".
          - LANGUAGE: Reply in ${targetLanguage}.
          - FORMAT: Strict JSON only.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              answer: { type: Type.STRING },
              suggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    profession: { type: Type.STRING },
                    city: { type: Type.STRING, nullable: true }
                  }
                }
              },
              recommendedProIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ['answer', 'suggestions', 'recommendedProIds']
          }
        }
      });
    });

    const data = JSON.parse(response.text || '{}');
    return {
      answer: data.answer || "I found some experts for you.",
      suggestions: data.suggestions || [],
      recommendedProIds: data.recommendedProIds || []
    };
  } catch (error: any) {
    console.error("AI Assistant Error:", error);
    return { 
      answer: "I'm having a bit of trouble matching experts right now. Could you try rephrasing your request?", 
      suggestions: [], 
      recommendedProIds: [] 
    };
  }
};

export const getSmartRecommendations = async (filters: SearchFilters) => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Match: ${filters.profession} in ${filters.city}.`,
      config: { systemInstruction: "Concise relevance for Spain." }
    });
    return { response: response.text };
  } catch (error) { return null; }
};

export const translateProfile = async (bio: string, specialties?: string[]) => {
  const languages = ['en', 'fr', 'es', 'it', 'nl', 'ru', 'uk'];
  const fallback = { bios: languages.reduce((acc, l) => ({ ...acc, [l]: bio }), {}), specialtyTranslations: {} };
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Translate to ${languages.join(',')}: ${bio}`,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '{}');
  } catch (e) { return fallback; }
};