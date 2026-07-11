import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

export class UpdateGoalDto {
  @ApiProperty({ example: 2000, minimum: 800, maximum: 5000 })
  @IsInt()
  @Min(800)
  @Max(5000)
  dailyGoalKcal!: number;
}
