import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MealsService } from './meals.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';

@ApiTags('meals')
@Controller('meals')
export class MealsController {
  constructor(private readonly meals: MealsService) {}

  @Get()
  findToday() {
    return this.meals.findToday();
  }

  @Post()
  create(@Body() dto: CreateMealDto) {
    return this.meals.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMealDto) {
    return this.meals.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.meals.remove(id);
  }
}
