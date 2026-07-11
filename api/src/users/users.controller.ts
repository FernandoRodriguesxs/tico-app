import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateGoalDto } from './dto/update-goal.dto';

@ApiTags('me')
@Controller('me')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  getMe() {
    return this.users.getMe();
  }

  @Patch('goal')
  updateGoal(@Body() dto: UpdateGoalDto) {
    return this.users.updateGoal(dto.dailyGoalKcal);
  }
}
