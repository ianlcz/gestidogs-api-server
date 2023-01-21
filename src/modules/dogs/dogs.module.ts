import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from '../users/users.module';

import { Dog, DogSchema } from './dog.schema';
import { DogsService } from './dogs.service';
import { DogsController } from './dogs.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Dog.name, schema: DogSchema }]),
    UsersModule,
  ],
  controllers: [DogsController],
  providers: [DogsService],
})
export class DogsModule {}
