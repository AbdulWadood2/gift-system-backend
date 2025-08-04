import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserHelper } from './helper/user.helper';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { AuthModule } from 'src/auth/auth.module';
import { BunnyModule } from 'src/bunny/bunny.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule),
    BunnyModule,
  ],
  controllers: [UserController],
  providers: [
    {
      provide: 'IUserService',
      useClass: UserService,
    },
    {
      provide: 'IUserHelper',
      useClass: UserHelper,
    },
  ],
  exports: [
    {
      provide: 'IUserHelper',
      useClass: UserHelper,
    },
  ],
})
export class UserModule {}
