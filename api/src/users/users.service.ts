import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const publicFields = { id: true, email: true, dailyGoalKcal: true };

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: publicFields });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  updateGoal(userId: string, dailyGoalKcal: number) {
    return this.prisma.user.update({ where: { id: userId }, data: { dailyGoalKcal }, select: publicFields });
  }
}
