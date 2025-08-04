import { Module } from '@nestjs/common';
import { GiftHelper } from './helper/gift.helper';
import { MongooseModule } from '@nestjs/mongoose';
import { Gift, GiftSchema } from './schema/gift.schema';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { GiftController } from './gift.controller';
import { GiftService } from './gift.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Gift.name, schema: GiftSchema }]),
    UserModule,
    AuthModule,
  ],
  controllers: [GiftController],
  providers: [
    {
      provide: 'IGiftService',
      useClass: GiftService,
    },
    {
      provide: 'IGiftHelper',
      useClass: GiftHelper,
    },
  ],
  exports: [
    {
      provide: 'IGiftHelper',
      useClass: GiftHelper,
    },
  ],
})
export class GiftModule {}
