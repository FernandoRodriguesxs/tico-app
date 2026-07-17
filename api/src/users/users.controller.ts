import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { UsersService } from './users.service';
import { UpdateGoalDto } from './dto/update-goal.dto';

@ApiTags('me')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('me')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  getMe(@CurrentUser() userId: string) {
    return this.users.getMe(userId);
  }

  @Patch('goal')
  updateGoal(@CurrentUser() userId: string, @Body() dto: UpdateGoalDto) {
    return this.users.updateGoal(userId, dto.dailyGoalKcal);
  }
}
