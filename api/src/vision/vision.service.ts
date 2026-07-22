import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ESTIMATOR_SYSTEM_PROMPT } from './estimator-prompt';

export type VisionEstimate = {
  food: string;
  kcal: number;
  confidence: number | null;
};

export type EstimateInput = {
  text?: string;
  imageBase64?: string;
  mimeType?: string;
};

type GeminiPart = { text: string } | { inline_data: { mime_type: string; data: string } };

type GeminiResponse = {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
};

const MODEL = 'gemini-2.5-flash';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    food: { type: 'string' },
    kcal: { type: 'integer' },
    confidence: { type: 'number' },
  },
  required: ['food', 'kcal', 'confidence'],
};

@Injectable()
export class VisionService {
  isConfigured(): boolean {
    return Boolean(process.env.GEMINI_API_KEY);
  }

  async estimate(input: EstimateInput): Promise<VisionEstimate> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new ServiceUnavailableException('A IA ainda não está configurada');

    const parts = this.buildParts(input);
    if (parts.length === 0) throw new ServiceUnavailableException('Nada para estimar');

    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: ESTIMATOR_SYSTEM_PROMPT }] },
        contents: [{ parts }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
        },
      }),
    });

    if (!response.ok) throw new ServiceUnavailableException('Não consegui estimar agora');

    const data = (await response.json()) as GeminiResponse;
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new ServiceUnavailableException('A IA não retornou uma estimativa');

    return this.parse(text);
  }

  private buildParts(input: EstimateInput): GeminiPart[] {
    const parts: GeminiPart[] = [];
    if (input.text) parts.push({ text: input.text });
    if (input.imageBase64 && input.mimeType) {
      if (!input.text) parts.push({ text: 'Estime as calorias do prato nesta foto.' });
      parts.push({ inline_data: { mime_type: input.mimeType, data: input.imageBase64 } });
    }
    return parts;
  }

  private parse(text: string): VisionEstimate {
    let raw: Partial<VisionEstimate>;
    try {
      raw = JSON.parse(text) as Partial<VisionEstimate>;
    } catch {
      throw new ServiceUnavailableException('Não entendi a resposta da IA');
    }
    const kcal = Math.max(0, Math.round(Number(raw.kcal ?? 0)));
    const confidence = Math.min(1, Math.max(0, Number(raw.confidence ?? 0)));
    const food = typeof raw.food === 'string' ? raw.food.trim() : '';
    return { food, kcal, confidence };
  }
}
