import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TEST_USER_ID } from '../common/constants';
import { estimateKcal, toFoodLabel } from './estimator';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';

function dayRange(date?: string) {
  const base = date ? new Date(`${date}T00:00:00`) : new Date();
  const start = Number.isNaN(base.getTime()) ? new Date() : base;
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

function localDateKey(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

@Injectable()
export class MealsService {
  constructor(private readonly prisma: PrismaService) {}

  findByDay(date?: string) {
    const { start, end } = dayRange(date);
    return this.prisma.meal.findMany({
      where: { userId: TEST_USER_ID, eatenAt: { gte: start, lt: end } },
      orderBy: { eatenAt: 'asc' },
    });
  }

  async history(limit: number) {
    const days = Math.min(Math.max(limit, 1), 60);
    const since = new Date();
    since.setHours(0, 0, 0, 0);
    since.setDate(since.getDate() - (days - 1));

    const meals = await this.prisma.meal.findMany({
      where: { userId: TEST_USER_ID, eatenAt: { gte: since } },
      orderBy: { eatenAt: 'desc' },
    });

    const totals = new Map<string, number>();
    for (const meal of meals) {
      const key = localDateKey(meal.eatenAt);
      totals.set(key, (totals.get(key) ?? 0) + meal.kcal);
    }

    return [...totals.entries()]
      .map(([date, totalKcal]) => ({ date, totalKcal }))
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }

  create(dto: CreateMealDto) {
    const text = dto.text.trim();
    return this.prisma.meal.create({
      data: {
        userId: TEST_USER_ID,
        text,
        food: toFoodLabel(text),
        kcal: estimateKcal(text),
      },
    });
  }

  async update(id: string, dto: UpdateMealDto) {
    await this.ensureOwned(id);
    return this.prisma.meal.update({
      where: { id },
      data: { food: dto.food, kcal: dto.kcal },
    });
  }

  async remove(id: string) {
    await this.ensureOwned(id);
    await this.prisma.meal.delete({ where: { id } });
    return { ok: true };
  }

  private async ensureOwned(id: string) {
    const meal = await this.prisma.meal.findFirst({
      where: { id, userId: TEST_USER_ID },
    });
    if (!meal) throw new NotFoundException('Refeição não encontrada');
  }
}
