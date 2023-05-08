import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  Establishment,
  EstablishmentSchema,
} from './schemas/establishment.schema';
import { EstablishmentsService } from './services/establishments.service';
import { EstablishmentsController } from './controllers/establishments.controller';

import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Establishment.name, schema: EstablishmentSchema },
    ]),
    forwardRef(() => UsersModule),
  ],
  controllers: [EstablishmentsController],
  providers: [EstablishmentsService],
  exports: [EstablishmentsService],
})
export class EstablishmentsModule {}
