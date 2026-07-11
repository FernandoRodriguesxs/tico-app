import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMealDto {
  @ApiProperty({ example: '2 ovos mexidos e um café com leite' })
  @IsString()
  @IsNotEmpty()
  text!: string;
}
