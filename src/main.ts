import { NestFactory, Reflector } from '@nestjs/core';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { AppModule } from './app.module';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { setupSwagger } from './swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true, // Needed for cookies/auth
  });

  // Global serialization interceptor
  //update
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Global prefix and versioning
  app.setGlobalPrefix('api');
  app.enableVersioning({
    prefix: 'v',
    defaultVersion: '1',
    type: VersioningType.URI,
  });

  // swagger
  setupSwagger(app);

  // Register TransformInterceptor after all configurations
  app.useGlobalInterceptors(new TransformInterceptor());

  // clobal pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Only allow properties defined in the DTO
      forbidNonWhitelisted: true, // Throw an error if unknown properties are present
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );
  if (process.env.PORT) {
    await app.listen(process.env.PORT as string);
  } else {
    throw new Error('PORT is not defined');
  }
}
bootstrap();
