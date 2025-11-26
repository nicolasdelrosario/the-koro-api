import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { CategoriesService } from 'src/categories/categories.service';
import { ProductsSortBy } from 'src/products/enums/products-sort-by.enum';
import { UserEntity } from 'src/users/entities/user.entity';
import { SortOrder } from 'src/utility/common/enums/sort-order.enum';
import {
  Between,
  FindOptionsWhere,
  ILike,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductsQueryDto } from './dto/find-products.query.dto';
import { PaginatedProductsResponseDto } from './dto/paginated-products-response.dto';
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

async findAll(
  query?: FindProductsQueryDto,
): Promise<PaginatedProductsResponseDto> {
  const page = query?.page ?? 1;
  const limit = query?.limit ?? 12;
  const skip = (page - 1) * limit;

  const sortBy = query?.sortBy ?? ProductsSortBy.CREATED_AT;
  const order = query?.order ?? SortOrder.DESC;

  const baseFilter: FindOptionsWhere<ProductEntity> = {};

  if (query?.categoryId) {
    baseFilter.category = { id: query.categoryId };
  }

  if (query?.priceMin != null && query?.priceMax != null) {
    baseFilter.price = Between(query.priceMin, query.priceMax);
  } else if (query?.priceMin != null) {
    baseFilter.price = MoreThanOrEqual(query.priceMin);
  } else if (query?.priceMax != null) {
    baseFilter.price = LessThanOrEqual(query.priceMax);
  }

  if (query?.inStock) {
    baseFilter.stock = MoreThan(0);
  }

  const where: FindOptionsWhere<ProductEntity>[] = [];

  if (query?.q) {
    const like = `%${query.q}%`;
    where.push(
      { ...baseFilter, title: ILike(like) },
      { ...baseFilter, description: ILike(like) },
    );
  } else {
    where.push(baseFilter);
  }

  const [products, total] = await this.productRepository.findAndCount({
    where,
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
    order: { [sortBy]: order },
    skip,
    take: limit,
  });

  const meta = {
    totalItems: total,
    itemCount: products.length,
    itemsPerPage: limit,
    totalPages: Math.ceil(total / limit) || 1,
    currentPage: page,
  };

  return { data: products, meta };
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
