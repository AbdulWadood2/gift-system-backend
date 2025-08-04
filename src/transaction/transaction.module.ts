import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TransactionHelper } from './helper/transaction.helper';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './schema/transaction.schema';
import { ResourceAppModule } from '../resource-apps/resource-app.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    ResourceAppModule,
    AuthModule,
    UserModule,
  ],
  controllers: [TransactionController],
  providers: [
    {
      provide: 'ITransactionService',
      useClass: TransactionService,
    },
    {
      provide: 'ITransactionHelper',
      useClass: TransactionHelper,
    },
  ],
  exports: [
    {
      provide: 'ITransactionHelper',
      useClass: TransactionHelper,
    },
  ],
})
export class TransactionModule {}
