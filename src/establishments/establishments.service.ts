import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from 'src/users/user.schema';
import { UsersService } from 'src/users/users.service';
import { CreateEstablishmentDto } from './dto/createEstablishment.dto';
import { Establishment, EstablishmentDocument } from './establishment.schema';

@Injectable()
export class EstablishmentsService {
  constructor(
    @InjectModel(Establishment.name)
    private establishmentModel: Model<EstablishmentDocument>,
    private usersService: UsersService,
  ) {}

  async create(
    createEstablishmentDto: CreateEstablishmentDto,
  ): Promise<Establishment> {
    try {
      // Instanciate Establishment Model with createEstablishmentDto
      const establishmentToCreate = new this.establishmentModel(
        createEstablishmentDto,
      );

      // Only User with Admin role can create an Establishment
      const establishmentOwner = await this.usersService.findOne(
        establishmentToCreate.ownerId.toString(),
      );
      if (establishmentOwner.role !== Role.ADMIN) {
        throw new UnauthorizedException();
      }

      // Save Establishment data on MongoDB and return them
      return await establishmentToCreate.save();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
        {
          cause: error,
        },
      );
    }
  }

  async findAll(): Promise<Establishment[]> {
    try {
      return await this.establishmentModel.find();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error,
        },
        HttpStatus.NOT_FOUND,
        {
          cause: error,
        },
      );
    }
  }
}
