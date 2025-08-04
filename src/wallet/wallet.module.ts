import { Module } from '@nestjs/common';
import { WalletHelper } from './helper/wallet.helper';
import { MongooseModule } from '@nestjs/mongoose';
import { Wallet, WalletSchema } from './schema/wallet.schema';
import { TransactionModule } from '../transaction/transaction.module';
import { GiftModule } from '../gift/gift.module';
import { ResourceAppModule } from '../resource-apps/resource-app.module';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }]),
    TransactionModule,
    GiftModule,
    ResourceAppModule,
    AuthModule,
    UserModule,
  ],
  controllers: [WalletController],
  providers: [
    {
      provide: 'IWalletService',
      useClass: WalletService,
    },
    {
      provide: 'IWalletHelper',
      useClass: WalletHelper,
    },
  ],
  exports: [
    {
      provide: 'IWalletHelper',
      useClass: WalletHelper,
    },
  ],
})
export class WalletModule {}
