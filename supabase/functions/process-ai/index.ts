import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenAI, Type } from "@google/genai"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { task, text, filters, specialties } = await req.json()
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    let systemInstruction = "You are ExpaLink AI, a premium relocation assistant."
    let prompt = text
    let responseMimeType = "text/plain"
    let responseSchema = undefined

    if (task === 'assistance') {
      systemInstruction = "Tu es un assistant expert en relocation. Réponds de manière concise, chaleureuse et pratique."
      prompt = `Réponds à cette question d'expatrié : ${text}`
    } 
    else if (task === 'translation') {
      systemInstruction = "Tu es un traducteur expert. Traduis la bio et les spécialités fournies en EXACTEMENT 7 langues : en, fr, es, it, nl, ru, uk. Retourne TOUJOURS un objet JSON valide."
      responseMimeType = "application/json"
      prompt = `Traduis la bio: "${text}" et les spécialités: ${JSON.stringify(specialties)} en en, fr, es, it, nl, ru, uk.`
      
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          bios: {
            type: Type.OBJECT,
            properties: {
              en: { type: Type.STRING },
              fr: { type: Type.STRING },
              es: { type: Type.STRING },
              it: { type: Type.STRING },
              nl: { type: Type.STRING },
              ru: { type: Type.STRING },
              uk: { type: Type.STRING }
            },
            required: ['en', 'fr', 'es', 'it', 'nl', 'ru', 'uk']
          },
          specialtyTranslations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                original: { type: Type.STRING },
                en: { type: Type.STRING },
                fr: { type: Type.STRING },
                es: { type: Type.STRING },
                it: { type: Type.STRING },
                nl: { type: Type.STRING },
                ru: { type: Type.STRING },
                uk: { type: Type.STRING }
              },
              required: ['original', 'en', 'fr', 'es', 'it', 'nl', 'ru', 'uk']
            }
          }
        },
        required: ['bios', 'specialtyTranslations']
      }
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType,
        responseSchema
      },
    })

    return new Response(
      task === 'translation' ? response.text : JSON.stringify({ response: response.text }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})