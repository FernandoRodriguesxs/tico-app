import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class RequestCodeDto {
  @ApiProperty({ example: 'voce@email.com' })
  @IsEmail()
  email!: string;
}
