import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const config = new DocumentBuilder()
    .setTitle('GestiDogs')
    .setDescription('Backend of a dog training center management application')
    .setVersion('0.1')
    .addTag('users')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(8080);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
