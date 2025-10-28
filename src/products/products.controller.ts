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
import { Public } from 'src/auth/decorators/public.decorator';
import { FindOneParams } from 'src/utility/common/entities/find-one-params.entity';
import { Role } from 'src/utility/common/enums/roles.enum';
import type { AuthenticatedRequest } from 'src/utility/common/interfaces/authenticated-request.interface';
import { Roles } from 'src/utility/decorators/roles.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(Role.ADMIN)
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    return await this.productsService.create(createProductDto, req.user);
  }

  @Get()
  @Public()
  async findAll(): Promise<ProductEntity[]> {
    return await this.productsService.findAll();
  }

  @Get(':id')
  @Public()
  async findOne(@Param() params: FindOneParams): Promise<ProductEntity> {
    return await this.productsService.findOneById(params.id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  async update(
    @Param() params: FindOneParams,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    return await this.productsService.update(params.id, updateProductDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@Param() params: FindOneParams): Promise<ProductEntity> {
    return await this.productsService.remove(params.id);
  }
}
