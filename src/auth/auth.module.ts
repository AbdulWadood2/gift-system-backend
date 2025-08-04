import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthHelper } from './helper/auth.helper';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { BunnyModule } from 'src/bunny/bunny.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    BunnyModule,
  ],
  providers: [
    {
      provide: 'IAuthService',
      useClass: AuthService,
    },
    {
      provide: 'IAuthHelper',
      useClass: AuthHelper,
    },
  ],
  controllers: [AuthController],
  exports: [
    {
      provide: 'IAuthHelper',
      useClass: AuthHelper,
    },
  ],
})
export class AuthModule {}
