import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketModule } from './market/market.module';
import { UsersModule } from './users/users.module';
import { ReferralModule } from './referral/referral.module';
import { AuthModule } from './auth/auth.module';
import { CreditTransaction } from './credit/credit-transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      // url: 'postgresql://neondb_owner:cfanZ6z2qpvB@ep-tiny-salad-a1h07rj7.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
      type: 'mysql',
      host: 'sql12.freemysqlhosting.net',
      port: 3306,
      username: 'sql12739915',
      password: 'aM2EQiPvUj',
      database: 'sql12739915',
      entities: [
        __dirname + '/**/*.entity{.ts,.js}',
        CreditTransaction,
      ],
      synchronize: true,
      logging: true,
    }),
    MarketModule,
    UsersModule,
    ReferralModule,
    AuthModule,
  ],
})
export class AppModule {}
