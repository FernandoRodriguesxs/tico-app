import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TEST_USER_ID } from '../common/constants';
import { estimateKcal, toFoodLabel } from './estimator';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';

function todayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

@Injectable()
export class MealsService {
  constructor(private readonly prisma: PrismaService) {}

  findToday() {
    const { start, end } = todayRange();
    return this.prisma.meal.findMany({
      where: { userId: TEST_USER_ID, eatenAt: { gte: start, lt: end } },
      orderBy: { eatenAt: 'asc' },
    });
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
