import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import type { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('balance')
  async getBalance(@Request() req) {
    const userId = req.user.userId;
    const balance = await this.usersService.getBalance(userId);
    return { success: true, data: balance };
  }
}
