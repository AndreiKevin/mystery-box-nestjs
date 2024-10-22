import { Controller, Get, UseGuards, Request } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <this is not used as a type. nestjs needs it to be imported as a class>
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { JwtPayload } from '../auth/jwt-payload.interface';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('balance')
  async getBalance(@Request() req: { user: JwtPayload }) {
    // The userId comes from the JWT token, extracted by JwtAuthGuard
    const userId = req.user.userId;
    const balance = await this.usersService.getBalance(userId);
    return { success: true, data: balance };
  }
}
