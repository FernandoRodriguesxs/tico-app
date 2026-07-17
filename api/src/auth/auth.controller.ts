import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { RequestCodeDto } from './dto/request-code.dto';
import { VerifyDto } from './dto/verify.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('request-code')
  @HttpCode(200)
  requestCode(@Body() dto: RequestCodeDto) {
    return this.auth.requestCode(dto.email);
  }

  @Post('verify')
  @HttpCode(200)
  verify(@Body() dto: VerifyDto) {
    return this.auth.verify(dto.email, dto.code);
  }
}
