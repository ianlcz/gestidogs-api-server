import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from '../users/users.module';

import { Dog, DogSchema } from './schemas/dog.schema';
import { DogsService } from './services/dogs.service';
import { DogsController } from './controllers/dogs.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Dog.name, schema: DogSchema }]),
    forwardRef(() => UsersModule),
  ],
  controllers: [DogsController],
  providers: [DogsService],
  exports: [DogsService],
})
export class DogsModule {}
