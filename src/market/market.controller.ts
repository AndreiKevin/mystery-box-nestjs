import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import type { MarketService } from './market.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/v1/market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get('inventory')
  async getInventory() {
    const treasures = await this.marketService.getInventory();
    return { success: true, data: { treasures } };
  }

  @UseGuards(JwtAuthGuard)
  @Post('purchase')
  async purchaseTreasure(@Request() req, @Body() body: { quantity: number }) {
    const userId = req.user.userId;
    const result = await this.marketService.purchaseTreasure(userId, body.quantity);
    return { success: true, data: result };
  }
}
