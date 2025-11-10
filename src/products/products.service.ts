import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { CategoriesService } from 'src/categories/categories.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    user: JwtPayload,
  ): Promise<ProductEntity> {
    const category = await this.categoriesService.findOneById(
      createProductDto.categoryId,
    );

    const product = this.productRepository.create({
      ...createProductDto,
      addedBy: {
        id: user.sub,
        name: user.name,
        email: user.email,
      } as UserEntity,
      category,
    });

    return await this.productRepository.save(product);
  }

  async findAll(): Promise<ProductEntity[]> {
    return await this.productRepository.find({
      relations: ['addedBy', 'category'],
      select: {
        addedBy: {
          id: true,
          name: true,
          email: true,
        },
        category: {
          id: true,
          title: true,
        },
      },
    });
  }

  async findOneById(id: string): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['addedBy', 'category'],
      select: {
        addedBy: {
          id: true,
          name: true,
          email: true,
        },
        category: {
          id: true,
          title: true,
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  async findAllByCategory(id: string): Promise<ProductEntity[]> {
    const category = await this.categoriesService.findOneById(id);

    return await this.productRepository.find({
      where: { category: { id: category.id } },
      relations: ['addedBy', 'category'],
      select: {
        addedBy: {
          id: true,
          name: true,
          email: true,
        },
        category: {
          id: true,
          title: true,
        },
      },
      order: { createdAt: 'DESC' },
    });
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    const product = await this.findOneById(id);

    Object.assign(product, updateProductDto);

    if (updateProductDto.categoryId) {
      const category = await this.categoriesService.findOneById(
        updateProductDto.categoryId,
      );

      product.category = category;
    }

    return await this.productRepository.save(product);
  }

  async remove(id: string): Promise<ProductEntity> {
    const product = await this.findOneById(id);

    return await this.productRepository.softRemove(product);
  }
}
