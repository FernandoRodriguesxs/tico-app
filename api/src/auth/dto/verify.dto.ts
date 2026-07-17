import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Matches } from 'class-validator';

export class VerifyDto {
  @ApiProperty({ example: 'voce@email.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '123456' })
  @Matches(/^\d{6}$/, { message: 'O código deve ter 6 dígitos.' })
  code!: string;
}
