import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AccessTokenStrategy } from '../../strategies/accessToken.strategy';
import { RefreshTokenStrategy } from '../../strategies/refreshToken.strategy';

import { User, UserSchema } from './user.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { EstablishmentsModule } from '../establishments/establishments.module';
import { DogsModule } from '../dogs/dogs.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({}),
    PassportModule,
    EstablishmentsModule,
    DogsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [UsersService],
})
export class UsersModule {}
