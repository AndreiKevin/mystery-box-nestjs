import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketController } from './market.controller';
import { MarketService } from './market.service';
import { TreasureType } from './treasure-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TreasureType])],
  controllers: [MarketController],
  providers: [MarketService],
})
export class MarketModule {}
