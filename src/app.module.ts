import { BadRequestException, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { BunnyModule } from './bunny/bunny.module';
import { WalletModule } from './wallet/wallet.module';
import { TransactionModule } from './transaction/transaction.module';
import { GiftModule } from './gift/gift.module';
import { WithdrawalModule } from './withdrawal/withdrawal.module';
import { ResourceAppModule } from './resource-apps/resource-app.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      useFactory: () => {
        const mongoUrl = process.env.MONGODB_URL;
        if (!mongoUrl) {
          throw new BadRequestException(
            'Please provide MONGODB_URL in environment variables',
          );
        }
        return {
          uri: mongoUrl,
        };
      },
    }),
    AuthModule,
    BunnyModule,
    WalletModule,
    TransactionModule,
    GiftModule,
    WithdrawalModule,
    ResourceAppModule
  ],
})
export class AppModule {}
