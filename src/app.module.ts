import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';

import { join } from 'path';

import { AppController } from './app.controller';
import { SessionsController } from './entities/sessions/sessions.controller';

import { AppService } from './app.service';

import { UsersModule } from './entities/users/users.module';
import { SessionsModule } from './entities/sessions/sessions.module';

import { EstablishmentsModule } from './entities/establishments/establishments.module';
import { DogsModule } from './entities/dogs/dogs.module';
import { ActivitiesModule } from './entities/activities/activities.module';
import { ReservationsModule } from './entities/reservations/reservations.module';
import { PaymentsModule } from './entities/payments/payments.module';
import { ObservationsModule } from './entities/observations/observations.module';
import { HolidaysModule } from './entities/holidays/holidays.module';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MongooseModule.forRoot(process.env.GESTIDOGS_MONGO_URI),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/docs',
    }),
    UsersModule,
    EstablishmentsModule,
    DogsModule,
    ActivitiesModule,
    SessionsModule,
    ReservationsModule,
    PaymentsModule,
    ObservationsModule,
    HolidaysModule,
  ],
  controllers: [AppController, SessionsController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
