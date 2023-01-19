import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Establishment, EstablishmentSchema } from './establishment.schema';
import { EstablishmentsService } from './establishments.service';
import { EstablishmentsController } from './establishments.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Establishment.name, schema: EstablishmentSchema },
    ]),
  ],
  controllers: [EstablishmentsController],
  providers: [EstablishmentsService],
})
export class EstablishmentsModule {}
