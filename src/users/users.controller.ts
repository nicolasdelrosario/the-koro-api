import { Controller, Get, Param } from '@nestjs/common';
import { FindOneParams } from 'src/utility/common/entities/find-one-params.entity';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOneById(@Param() params: FindOneParams): Promise<UserEntity | null> {
    return this.usersService.findOneById(params.id);
  }
}
