import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schema/user.schema';
import { forwardRef, Module } from '@nestjs/common';
import { BunnyController } from './bunny.controller';
import { BunnyHelper } from './helper/bunny.helper';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
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
