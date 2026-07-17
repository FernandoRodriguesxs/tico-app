import Constants from 'expo-constants';

function resolveBaseUrl(): string {
  const host = Constants.expoConfig?.hostUri?.split(':')[0];
  return host ? `http://${host}:3000` : 'http://localhost:3000';
}

const BASE_URL = resolveBaseUrl();

export type ApiMeal = {
  id: string;
  text: string;
  food: string;
  kcal: number;
  confidence: number | null;
  eatenAt: string;
  createdAt: string;
};

export type Me = {
  id: string;
  email: string;
  dailyGoalKcal: number;
};

export type DaySummary = {
  date: string;
  totalKcal: number;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!response.ok) throw new Error(`Falha na requisição (${response.status})`);
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function getMe() {
  return request<Me>('/me');
}

export function updateGoal(dailyGoalKcal: number) {
  return request<Me>('/me/goal', {
    method: 'PATCH',
    body: JSON.stringify({ dailyGoalKcal }),
  });
}

export function getMeals(date?: string) {
  return request<ApiMeal[]>(date ? `/meals?date=${date}` : '/meals');
}

export function getDays(limit = 14) {
  return request<DaySummary[]>(`/meals/history?limit=${limit}`);
}

export function createMeal(text: string) {
  return request<ApiMeal>('/meals', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
}

export function updateMeal(id: string, data: { food?: string; kcal?: number }) {
  return request<ApiMeal>(`/meals/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteMeal(id: string) {
  return request<{ ok: boolean }>(`/meals/${id}`, { method: 'DELETE' });
}
