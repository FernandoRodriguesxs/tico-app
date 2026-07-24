import type { ApiMeal } from './api';

export type UIMeal = ApiMeal & { emoji: string; reply?: string; kind?: 'note' };

const REPLIES = ['Anotei! 🥑', 'Boa! 🌰', 'Registrado! ✨', 'Tá anotado! 🐿️', 'Show, comi junto 🥗', 'Feito! 🍊'];
const EMOJIS = ['🥗', '🍳', '🍛', '🥑', '🍎', '🌰', '🥪', '🍊', '🥐', '🍲'];

const LOW_CONFIDENCE = 0.5;

export function pickReply(): string {
  return REPLIES[Math.floor(Math.random() * REPLIES.length)];
}

export function isLowConfidence(confidence: number | null): boolean {
  return confidence !== null && confidence < LOW_CONFIDENCE;
}

export function emojiFor(id: string): string {
  let sum = 0;
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
  return EMOJIS[sum % EMOJIS.length];
}
