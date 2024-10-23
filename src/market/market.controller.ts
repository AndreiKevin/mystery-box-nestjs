import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <this is not used as a type. nestjs needs it to be imported as a class>
import { MarketService } from './market.service';
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
  async purchaseMysteryBox(@Body() purchaseData: { userId: number; mysteryBoxId: number }) {
    try {
      const result = await this.marketService.purchaseMysteryBox(purchaseData.userId, purchaseData.mysteryBoxId);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }


  @Get('mystery-boxes')
  async getMysteryBoxes() {
    const mysteryBoxes = await this.marketService.getMysteryBoxes();
    return { success: true, data: { mysteryBoxes } };
  }
}
