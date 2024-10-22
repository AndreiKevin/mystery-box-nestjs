import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketModule } from './market/market.module';
import { UsersModule } from './users/users.module';
import { ReferralModule } from './referral/referral.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'mystery_box',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    MarketModule,
    UsersModule,
    ReferralModule,
    AuthModule,
  ],
})
export class AppModule {}
