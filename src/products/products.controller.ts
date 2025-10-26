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
import { FindOneParams } from 'src/utility/common/entities/find-one-params.entity';
import type { AuthenticatedRequest } from 'src/utility/common/interfaces/authenticated-request.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    return await this.productsService.create(createProductDto, req.user);
  }

  @Get()
  async findAll(): Promise<ProductEntity[]> {
    return await this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param() params: FindOneParams): Promise<ProductEntity> {
    return await this.productsService.findOneById(params.id);
  }

  @Patch(':id')
  async update(
    @Param() params: FindOneParams,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    return await this.productsService.update(params.id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param() params: FindOneParams): Promise<ProductEntity> {
    return await this.productsService.remove(params.id);
  }
}
