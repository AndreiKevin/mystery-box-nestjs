import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketModule } from './market/market.module';
import { UsersModule } from './users/users.module';
import { ReferralModule } from './referral/referral.module';
import { AuthModule } from './auth/auth.module';
import { AppDataSource } from './data-source';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    MarketModule,
    UsersModule,
    ReferralModule,
    AuthModule,
  ],
})
export class AppModule {}
