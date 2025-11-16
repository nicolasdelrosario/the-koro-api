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
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewEntity } from './entities/review.entity';
import { ReviewsService } from './reviews.service';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create Review',
    description: 'Authenticated endpoint',
  })
  @ApiCreatedResponse({ description: 'Created review', type: ReviewEntity })
  @ApiBadRequestResponse({
    description: 'Bad request error',
    type: BadRequestResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access token',
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
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<ReviewEntity> {
    return await this.reviewsService.create(createReviewDto, req.user);
  }

  @Get()
  @Public()
  @ApiOperation({
    summary: 'List Reviews',
    description: 'Public endpoint.',
  })
  @ApiOkResponse({ description: 'List of reviews', type: [ReviewEntity] })
  async findAll(): Promise<ReviewEntity[]> {
    return await this.reviewsService.findAll();
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List My Reviews',
    description: 'Authenticated endpoint. Lists reviews created by the user.',
  })
  @ApiOkResponse({ description: 'List of my reviews', type: [ReviewEntity] })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing token',
    type: UnauthorizedResponseDto,
  })
  async findMyReviews(
    @Request() req: AuthenticatedRequest,
  ): Promise<ReviewEntity[]> {
    return await this.reviewsService.findMyReviews(req.user);
  }

  @Get('product/:id')
  @Public()
  @ApiOperation({
    summary: 'List Reviews by Product ID',
    description: 'Public endpoint.',
  })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    schema: { type: 'string', format: 'uuid' },
  })
  @ApiOkResponse({ description: 'List of reviews', type: [ReviewEntity] })
  @ApiNotFoundResponse({
    description: 'Product not found',
    type: NotFoundResponseDto,
  })
  async findAllByProduct(@Param('id') id: string): Promise<ReviewEntity[]> {
    return await this.reviewsService.findAllByProduct(id);
  }

  @Get(':id')
  @Public()
  @ApiOperation({
    summary: 'Get Review by ID',
    description: 'Public endpoint.',
  })
  @ApiParam({
    name: 'id',
    description: 'Review ID',
    schema: { type: 'string', format: 'uuid' },
  })
  @ApiOkResponse({ type: ReviewEntity })
  @ApiNotFoundResponse({
    description: 'Review not found',
    type: NotFoundResponseDto,
  })
  async findOne(@Param() params: FindOneParams): Promise<ReviewEntity> {
    return await this.reviewsService.findOneById(params.id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update Review',
    description: 'Admin-only endpoint.',
  })
  @ApiParam({
    name: 'id',
    description: 'Review ID',
    schema: { type: 'string', format: 'uuid' },
  })
  @ApiOkResponse({ description: 'Updated review', type: ReviewEntity })
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
    description: 'Review not found',
    type: NotFoundResponseDto,
  })
  async update(
    @Param() params: FindOneParams,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<ReviewEntity> {
    return await this.reviewsService.update(params.id, updateReviewDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete Review',
    description: 'Admin-only endpoint.',
  })
  @ApiParam({
    name: 'id',
    description: 'Review ID',
    schema: { type: 'string', format: 'uuid' },
  })
  @ApiOkResponse({ description: 'Deleted review', type: ReviewEntity })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing token',
    type: UnauthorizedResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'You do not have permission to access this resource',
    type: ForbiddenResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Review not found',
    type: NotFoundResponseDto,
  })
  async remove(@Param() params: FindOneParams): Promise<ReviewEntity> {
    return await this.reviewsService.remove(params.id);
  }
}
