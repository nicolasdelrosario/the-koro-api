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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    return await this.categoriesService.create(createCategoryDto, req.user);
  }

  @Get()
  async findAll(): Promise<CategoryEntity[]> {
    return await this.categoriesService.findAll();
  }

  @Get(':id')
  async findOneById(@Param() params: FindOneParams): Promise<CategoryEntity> {
    return await this.categoriesService.findOneById(params.id);
  }

  @Patch(':id')
  async update(
    @Param() params: FindOneParams,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    return await this.categoriesService.update(params.id, updateCategoryDto);
  }

  @Delete(':id')
  async remove(@Param() params: FindOneParams): Promise<CategoryEntity> {
    return await this.categoriesService.remove(params.id);
  }
}
