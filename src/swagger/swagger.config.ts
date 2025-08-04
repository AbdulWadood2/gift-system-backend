// src/swagger/swagger.config.ts
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Request, Response } from 'express';
import * as basicAuth from 'express-basic-auth';
import { readFileSync } from 'fs';
import { join } from 'path';

export function setupSwagger(app: INestApplication) {
  const customCss = readFileSync(
    join(process.cwd(), 'public/css/dark-theme.css'),
    'utf8',
  );

  const config = new DocumentBuilder()
    .setTitle('user-gift-system')
    .setDescription(
      'API documentation for user verification system application',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const swaggerUsername = process.env.SWAGGER_USERNAME;
  const swaggerPassword = process.env.SWAGGER_PASSWORD;

  if (swaggerUsername && swaggerPassword) {
    app.use(
      '/api-docs',
      basicAuth({
        users: {
          [swaggerUsername]: swaggerPassword,
        },
        challenge: true,
        realm: 'API Documentation',
      }),
    );
  } else {
    app.use('/api-docs', (req: Request, res: Response) =>
      res.status(401).send('Unauthorized'),
    );
  }

  SwaggerModule.setup('api-docs', app, document, {
    customCss,
  });
}
