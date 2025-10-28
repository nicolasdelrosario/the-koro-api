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
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewEntity } from './entities/review.entity';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<ReviewEntity> {
    return await this.reviewsService.create(createReviewDto, req.user);
  }

  @Get()
  @Public()
  async findAll(): Promise<ReviewEntity[]> {
    return await this.reviewsService.findAll();
  }

  @Get('product/:id')
  @Public()
  async findAllByProduct(@Param('id') id: string): Promise<ReviewEntity[]> {
    return await this.reviewsService.findAllByProduct(id);
  }

  @Get(':id')
  @Public()
  async findOne(@Param() params: FindOneParams): Promise<ReviewEntity> {
    return await this.reviewsService.findOneById(params.id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  async update(
    @Param() params: FindOneParams,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<ReviewEntity> {
    return await this.reviewsService.update(params.id, updateReviewDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@Param() params: FindOneParams): Promise<ReviewEntity> {
    return await this.reviewsService.remove(params.id);
  }
}
