import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TEST_USER_ID } from '../common/constants';

const publicFields = { id: true, email: true, dailyGoalKcal: true };

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe() {
    const user = await this.prisma.user.findUnique({
      where: { id: TEST_USER_ID },
      select: publicFields,
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  updateGoal(dailyGoalKcal: number) {
    return this.prisma.user.update({
      where: { id: TEST_USER_ID },
      data: { dailyGoalKcal },
      select: publicFields,
    });
  }
}
