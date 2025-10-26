import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { ProductsService } from 'src/products/products.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewEntity } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    private readonly productsService: ProductsService,
  ) {}

  async create(
    createReviewDto: CreateReviewDto,
    user: JwtPayload,
  ): Promise<ReviewEntity> {
    const product = await this.productsService.findOneById(
      createReviewDto.productId,
    );

    const existing = await this.reviewRepository.findOne({
      where: {
        product: { id: createReviewDto.productId },
        user: { id: user.sub },
      },
    });

    if (existing) {
      throw new ConflictException('You have already reviewed this product');
    }

    const review = this.reviewRepository.create({
      ...createReviewDto,
      user: {
        id: user.sub,
        name: user.name,
        email: user.email,
      } as UserEntity,
      product,
    });

    return await this.reviewRepository.save(review);
  }

  async findAll(): Promise<ReviewEntity[]> {
    return await this.reviewRepository.find({
      relations: ['product', 'user'],
      select: {
        user: {
          id: true,
          name: true,
          email: true,
        },
        product: {
          id: true,
          title: true,
        },
      },
      order: { createdAt: 'DESC' },
    });
  }

  async findAllByProduct(id: string): Promise<ReviewEntity[]> {
    const product = await this.productsService.findOneById(id);

    return await this.reviewRepository.find({
      where: { product: { id: product.id } },
      relations: ['product', 'user'],
      select: {
        user: {
          id: true,
          name: true,
          email: true,
        },
        product: {
          id: true,
          title: true,
        },
      },
      order: { createdAt: 'DESC' },
    });
  }

  async findOneById(id: string): Promise<ReviewEntity> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['product', 'user'],
      select: {
        user: {
          id: true,
          name: true,
          email: true,
        },
        product: {
          id: true,
          title: true,
        },
      },
    });

    if (!review) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }

    return review;
  }

  async update(
    id: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<ReviewEntity> {
    const review = await this.findOneById(id);

    Object.assign(review, updateReviewDto);

    if (updateReviewDto.productId) {
      const product = await this.productsService.findOneById(
        updateReviewDto.productId,
      );

      review.product = product;
    }

    return await this.reviewRepository.save(review);
  }

  async remove(id: string): Promise<ReviewEntity> {
    const review = await this.findOneById(id);

    return await this.reviewRepository.softRemove(review);
  }
}
