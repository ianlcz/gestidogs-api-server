import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Establishment, EstablishmentSchema } from './establishment.schema';
import { EstablishmentsService } from './establishments.service';
import { EstablishmentsController } from './establishments.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Establishment.name, schema: EstablishmentSchema },
    ]),
    UsersModule,
  ],
  controllers: [EstablishmentsController],
  providers: [EstablishmentsService],
})
export class EstablishmentsModule {}
