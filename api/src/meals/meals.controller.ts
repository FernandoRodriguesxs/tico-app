import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { MealsService } from './meals.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';

@ApiTags('meals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('meals')
export class MealsController {
  constructor(private readonly meals: MealsService) {}

  @Get('history')
  @ApiQuery({ name: 'limit', required: false, example: 14 })
  history(@CurrentUser() userId: string, @Query('limit', new DefaultValuePipe(14), ParseIntPipe) limit: number) {
    return this.meals.history(userId, limit);
  }

  @Get()
  @ApiQuery({ name: 'date', required: false, example: '2026-07-15' })
  findByDay(@CurrentUser() userId: string, @Query('date') date?: string) {
    return this.meals.findByDay(userId, date);
  }

  @Post()
  create(@CurrentUser() userId: string, @Body() dto: CreateMealDto) {
    return this.meals.create(userId, dto);
  }

  @Patch(':id')
  update(@CurrentUser() userId: string, @Param('id') id: string, @Body() dto: UpdateMealDto) {
    return this.meals.update(userId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() userId: string, @Param('id') id: string) {
    return this.meals.remove(userId, id);
  }
}
