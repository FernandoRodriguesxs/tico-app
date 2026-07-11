const FOODS: Record<string, number> = {
  ovo: 78, ovos: 78, café: 5, cafe: 5, leite: 60, pão: 140, pao: 140,
  arroz: 205, feijão: 115, feijao: 115, frango: 220, carne: 250, bife: 250,
  peixe: 180, salada: 45, abacate: 160, maçã: 95, maca: 95, banana: 105,
  castanha: 100, castanhas: 100, iogurte: 90, queijo: 110, pizza: 285,
  hambúrguer: 350, hamburguer: 350, refrigerante: 140, coca: 140, chocolate: 230,
  biscoito: 150, sanduíche: 300, sanduiche: 300, macarrão: 220, macarrao: 220,
  batata: 160, suco: 110, torrada: 70, requeijão: 60, manteiga: 70, aveia: 150,
  granola: 190, tapioca: 170, pastel: 300, coxinha: 280, brigadeiro: 100,
  sorvete: 210, bolo: 300, salgado: 280, wrap: 320, panqueca: 230, pipoca: 120,
  vinho: 125, cerveja: 150, açaí: 300, acai: 300, crepe: 260, lasanha: 380,
};

export function estimateKcal(text: string): number {
  const words = text.toLowerCase().replace(/[,.!?;]/g, ' ').split(/\s+/).filter(Boolean);
  let total = 0;
  let matched = false;
  for (let i = 0; i < words.length; i++) {
    const v = FOODS[words[i]];
    if (v != null) {
      let mult = 1;
      const n = parseInt(words[i - 1], 10);
      if (!Number.isNaN(n) && n > 0 && n < 20) mult = n;
      total += v * mult;
      matched = true;
    }
  }
  if (!matched) total = 250;
  return Math.round(total);
}

export function toFoodLabel(text: string): string {
  const t = text.trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
}
