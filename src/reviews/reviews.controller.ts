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
import type { IRequest } from 'src/utility/common/interfaces/request.interface';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewEntity } from './entities/review.entity';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async create(
    @Request() req: IRequest,
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<ReviewEntity> {
    return await this.reviewsService.create(createReviewDto, req.user);
  }

  @Get()
  async findAll(): Promise<ReviewEntity[]> {
    return await this.reviewsService.findAll();
  }

  @Get('product/:id')
  async findAllByProduct(@Param('id') id: string): Promise<ReviewEntity[]> {
    return await this.reviewsService.findAllByProduct(id);
  }

  @Get(':id')
  async findOne(@Param() params: FindOneParams): Promise<ReviewEntity> {
    return await this.reviewsService.findOneById(params.id);
  }

  @Patch(':id')
  async update(
    @Param() params: FindOneParams,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<ReviewEntity> {
    return await this.reviewsService.update(params.id, updateReviewDto);
  }

  @Delete(':id')
  async remove(@Param() params: FindOneParams): Promise<ReviewEntity> {
    return await this.reviewsService.remove(params.id);
  }
}
