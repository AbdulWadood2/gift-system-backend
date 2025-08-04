import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schema/user.schema';
import { Module } from '@nestjs/common';
import { BunnyController } from './bunny.controller';
import { BunnyHelper } from './helper/bunny.helper';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [BunnyController],
  providers: [
    {
      provide: 'IBunnyHelper',
      useClass: BunnyHelper,
    },
  ],
  exports: [
    {
      provide: 'IBunnyHelper',
      useClass: BunnyHelper,
    },
  ],
})
export class BunnyModule {}
