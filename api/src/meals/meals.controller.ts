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
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { MealsService } from './meals.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';

@ApiTags('meals')
@Controller('meals')
export class MealsController {
  constructor(private readonly meals: MealsService) {}

  @Get('history')
  @ApiQuery({ name: 'limit', required: false, example: 14 })
  history(@Query('limit', new DefaultValuePipe(14), ParseIntPipe) limit: number) {
    return this.meals.history(limit);
  }

  @Get()
  @ApiQuery({ name: 'date', required: false, example: '2026-07-15' })
  findByDay(@Query('date') date?: string) {
    return this.meals.findByDay(date);
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
