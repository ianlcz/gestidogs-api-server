import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { UsersModule } from './users/users.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    MongooseModule.forRoot(process.env.GESTIDOGS_MONGO_URI),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/swagger',
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
