import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ForbiddenResponseDto } from 'src/utility/common/dto/forbidden-response.dto';
import { NotFoundResponseDto } from 'src/utility/common/dto/not-found-response.dto';
import { UnauthorizedResponseDto } from 'src/utility/common/dto/unauthorized-response.dto';
import { FindOneParams } from 'src/utility/common/entities/find-one-params.entity';
import { Role } from 'src/utility/common/enums/roles.enum';
import { Roles } from 'src/utility/decorators/roles.decorator';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'List Users', description: 'Admin-only endpoint.' })
  @ApiOkResponse({ description: 'List of users', type: [UserEntity] })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing token',
    type: UnauthorizedResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'You do not have permission to access this resource',
    type: ForbiddenResponseDto,
  })
  findAll(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'List User by ID',
    description: 'Admin-only endpoint.',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    schema: { type: 'string', format: 'uuid' },
  })
  @ApiOkResponse({ description: 'User details', type: UserEntity })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing token',
    type: UnauthorizedResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'You do not have permission to access this resource',
    type: ForbiddenResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: NotFoundResponseDto,
  })
  findOneById(@Param() params: FindOneParams): Promise<UserEntity | null> {
    return this.usersService.findOneById(params.id);
  }
}
