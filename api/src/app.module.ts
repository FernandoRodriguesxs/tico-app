import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { MealsModule } from './meals/meals.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [PrismaModule, MealsModule, UsersModule],
})
export class AppModule {}
