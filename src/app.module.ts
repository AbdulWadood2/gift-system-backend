import { BadRequestException, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { BunnyModule } from './bunny/bunny.module';

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
    UserModule,
    BunnyModule,
  ],
})
export class AppModule {}
