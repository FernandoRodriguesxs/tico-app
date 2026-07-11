import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateMealDto {
  @ApiPropertyOptional({ example: 'Ovos mexidos + café com leite' })
  @IsOptional()
  @IsString()
  food?: string;

  @ApiPropertyOptional({ example: 240, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  kcal?: number;
}
