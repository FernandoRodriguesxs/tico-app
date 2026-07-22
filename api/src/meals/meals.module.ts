import { Module } from '@nestjs/common';
import { VisionModule } from '../vision/vision.module';
import { MealsController } from './meals.controller';
import { MealsService } from './meals.service';

@Module({
  imports: [VisionModule],
  controllers: [MealsController],
  providers: [MealsService],
})
export class MealsModule {}
