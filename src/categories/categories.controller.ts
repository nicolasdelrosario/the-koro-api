import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { BadRequestResponseDto } from 'src/utility/common/dto/bad-request-response.dto';
import { ForbiddenResponseDto } from 'src/utility/common/dto/forbidden-response.dto';
import { NotFoundResponseDto } from 'src/utility/common/dto/not-found-response.dto';
import { UnauthorizedResponseDto } from 'src/utility/common/dto/unauthorized-response.dto';
import { FindOneParams } from 'src/utility/common/entities/find-one-params.entity';
import { Role } from 'src/utility/common/enums/roles.enum';
import type { AuthenticatedRequest } from 'src/utility/common/interfaces/authenticated-request.interface';
import { Roles } from 'src/utility/decorators/roles.decorator';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create Category',
    description: 'Admin-only endpoint.',
  })
  @ApiCreatedResponse({ description: 'Created category', type: CategoryEntity })
  @ApiBadRequestResponse({
    description: 'Bad request error',
    type: BadRequestResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing token',
    type: UnauthorizedResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'You do not have permission to access this resource',
    type: ForbiddenResponseDto,
  })
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    return await this.categoriesService.create(createCategoryDto, req.user);
  }

  @Get()
  @Public()
  @ApiOperation({
    summary: 'List Categories',
    description: 'Public endpoint.',
  })
  @ApiOkResponse({
    description: 'List of categories',
    type: [CategoryEntity],
  })
  async findAll(): Promise<CategoryEntity[]> {
    return await this.categoriesService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({
    summary: 'List Category by ID',
    description: 'Public endpoint.',
  })
    @ApiParam({
    name: 'id',
    description: 'Category ID',
    schema: { type: 'string', format: 'uuid' },
  })
  @ApiOkResponse({
    description: 'Category details',
    type: CategoryEntity,
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
    type: NotFoundResponseDto,
  })
  async findOneById(@Param() params: FindOneParams): Promise<CategoryEntity> {
    return await this.categoriesService.findOneById(params.id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update Category',
    description: 'Admin-only endpoint.',
  })
  @ApiParam({
    name: 'id',
    description: 'Category ID',
    schema: { type: 'string', format: 'uuid' },
  })
  @ApiOkResponse({ description: 'Updated category', type: CategoryEntity })
  @ApiBadRequestResponse({
    description: 'Bad request error',
    type: BadRequestResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing token',
    type: UnauthorizedResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'You do not have permission to access this resource',
    type: ForbiddenResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
    type: NotFoundResponseDto,
  })
  async update(
    @Param() params: FindOneParams,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    return await this.categoriesService.update(params.id, updateCategoryDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete Category',
    description: 'Admin-only endpoint.',
  })
  @ApiParam({
    name: 'id',
    description: 'Category ID',
    schema: { type: 'string', format: 'uuid' },
  })
  @ApiOkResponse({ description: 'Deleted category', type: CategoryEntity })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing token',
    type: UnauthorizedResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'You do not have permission to access this resource',
    type: ForbiddenResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
    type: NotFoundResponseDto,
  })
  async remove(@Param() params: FindOneParams): Promise<CategoryEntity> {
    return await this.categoriesService.remove(params.id);
  }
}
