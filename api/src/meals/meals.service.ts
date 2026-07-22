import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VisionService, type VisionEstimate } from '../vision/vision.service';
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
  constructor(
    private readonly prisma: PrismaService,
    private readonly vision: VisionService,
  ) {}

  findByDay(userId: string, date?: string) {
    const { start, end } = dayRange(date);
    return this.prisma.meal.findMany({
      where: { userId, eatenAt: { gte: start, lt: end } },
      orderBy: { eatenAt: 'asc' },
    });
  }

  async history(userId: string, limit: number) {
    const days = Math.min(Math.max(limit, 1), 60);
    const since = new Date();
    since.setHours(0, 0, 0, 0);
    since.setDate(since.getDate() - (days - 1));

    const meals = await this.prisma.meal.findMany({
      where: { userId, eatenAt: { gte: since } },
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

  async create(userId: string, dto: CreateMealDto) {
    const text = dto.text.trim();
    const estimate = await this.estimateText(text);
    return this.prisma.meal.create({
      data: {
        userId,
        text,
        food: estimate.food || toFoodLabel(text),
        kcal: estimate.kcal,
        confidence: estimate.confidence,
      },
    });
  }

  async createFromPhoto(userId: string, imageBase64: string, mimeType: string) {
    const estimate = await this.vision.estimate({ imageBase64, mimeType });
    return this.prisma.meal.create({
      data: {
        userId,
        text: 'Foto do prato',
        food: estimate.food || 'Prato não identificado',
        kcal: estimate.kcal,
        confidence: estimate.confidence,
      },
    });
  }

  private async estimateText(text: string): Promise<VisionEstimate> {
    try {
      return await this.vision.estimate({ text });
    } catch {
      return { food: toFoodLabel(text), kcal: estimateKcal(text), confidence: null };
    }
  }

  async update(userId: string, id: string, dto: UpdateMealDto) {
    await this.ensureOwned(userId, id);
    return this.prisma.meal.update({
      where: { id },
      data: { food: dto.food, kcal: dto.kcal },
    });
  }

  async remove(userId: string, id: string) {
    await this.ensureOwned(userId, id);
    await this.prisma.meal.delete({ where: { id } });
    return { ok: true };
  }

  private async ensureOwned(userId: string, id: string) {
    const meal = await this.prisma.meal.findFirst({ where: { id, userId } });
    if (!meal) throw new NotFoundException('Refeição não encontrada');
  }
}
