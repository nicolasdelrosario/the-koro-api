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
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductsService } from './products.service';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create Product',
    description: 'Admin-only endpoint.',
  })
  @ApiCreatedResponse({ description: 'Created product', type: ProductEntity })
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
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    return await this.productsService.create(createProductDto, req.user);
  }

  @Get()
  @Public()
  @ApiOperation({
    summary: 'List Products',
    description: 'Public endpoint.',
  })
  @ApiOkResponse({ description: 'List of products', type: [ProductEntity] })
  async findAll(): Promise<ProductEntity[]> {
    return await this.productsService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({
    summary: 'List Product by ID',
    description: 'Public endpoint.',
  })
      @ApiParam({
    name: 'id',
    description: 'Product ID',
    schema: { type: 'string', format: 'uuid' },
  })
  @ApiOkResponse({ description: 'Product details', type: ProductEntity })
  @ApiNotFoundResponse({
    description: 'Product not found',
    type: NotFoundResponseDto,
  })
  async findOneById(@Param() params: FindOneParams): Promise<ProductEntity> {
    return await this.productsService.findOneById(params.id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update Product',
    description: 'Admin-only endpoint.',
  })
        @ApiParam({
    name: 'id',
    description: 'Product ID',
    schema: { type: 'string', format: 'uuid' },
  })
  @ApiOkResponse({ description: 'Updated product', type: ProductEntity })
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
    description: 'Product not found',
    type: NotFoundResponseDto,
  })
  async update(
    @Param() params: FindOneParams,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    return await this.productsService.update(params.id, updateProductDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete Product',
    description: 'Admin-only endpoint.',
  })
        @ApiParam({
    name: 'id',
    description: 'Product ID',
    schema: { type: 'string', format: 'uuid' },
  })
  @ApiOkResponse({ description: 'Deleted product', type: ProductEntity })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing token',
    type: UnauthorizedResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'You do not have permission to access this resource',
    type: ForbiddenResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
    type: NotFoundResponseDto,
  })
  async remove(@Param() params: FindOneParams): Promise<ProductEntity> {
    return await this.productsService.remove(params.id);
  }
}
