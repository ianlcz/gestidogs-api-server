import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { createWriteStream } from 'fs';
import { get } from 'http';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('GestiDogs')
    .setDescription('Backend of a dog training center management application')
    .setVersion('0.0.1')
    .addBearerAuth(
      {
        description: 'Default JWT Authorization',
        type: 'http',
        in: 'header',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'BearerToken',
    )
    .build();

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({ transform: true, forbidUnknownValues: false }),
  );

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'GestiDogs API Documentation',
    customfavIcon: '../favicon.png',
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'method',
    },
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(8080, '0.0.0.0');

  // get the swagger json file (if app is running in development mode)
  if (process.env.NODE_ENV === 'development') {
    // write swagger ui files
    get(`${await app.getUrl()}/docs/swagger-ui-bundle.js`, (response) =>
      response.pipe(createWriteStream('swagger-static/swagger-ui-bundle.js')),
    );

    get(`${await app.getUrl()}/docs/swagger-ui-init.js`, (response) =>
      response.pipe(createWriteStream('swagger-static/swagger-ui-init.js')),
    );

    get(
      `${await app.getUrl()}/docs/swagger-ui-standalone-preset.js`,
      (response) =>
        response.pipe(
          createWriteStream('swagger-static/swagger-ui-standalone-preset.js'),
        ),
    );

    get(`${await app.getUrl()}/docs/swagger-ui.css`, (response) =>
      response.pipe(createWriteStream('swagger-static/swagger-ui.css')),
    );
  }
}
bootstrap();
