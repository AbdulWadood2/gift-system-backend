import { Module } from '@nestjs/common';
import { WithdrawalService } from './withdrawal.service';
import { WithdrawalController } from './withdrawal.controller';
import { WithdrawalHelper } from './helper/withdrawal.helper';
import { MongooseModule } from '@nestjs/mongoose';
import { Withdrawal, WithdrawalSchema } from './schema/withdrawal.schema';
import { WalletModule } from '../wallet/wallet.module';
import { ResourceAppModule } from '../resource-apps/resource-app.module';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Withdrawal.name, schema: WithdrawalSchema },
    ]),
    WalletModule,
    ResourceAppModule,
    AuthModule,
    UserModule,
  ],
  controllers: [WithdrawalController],
  providers: [
    {
      provide: 'IWithdrawalService',
      useClass: WithdrawalService,
    },
    {
      provide: 'IWithdrawalHelper',
      useClass: WithdrawalHelper,
    },
  ],
  exports: [
    {
      provide: 'IWithdrawalHelper',
      useClass: WithdrawalHelper,
    },
  ],
})
export class WithdrawalModule {}
