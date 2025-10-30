import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    description: 'Rating between 0 and 5',
    minimum: 0,
    maximum: 5,
  })
  @IsNotEmpty({ message: 'Ratings is required' })
  @IsNumber({}, { message: 'Ratings must be a number' })
  @Min(0, { message: 'Ratings must be a non-negative number' })
  @Max(5, { message: 'Ratings must be a number between 0 and 5' })
  ratings: number;

  @ApiProperty({ description: 'Review comment' })
  @IsNotEmpty({ message: 'Comment is required' })
  @IsString({ message: 'Comment must be a string' })
  comment: string;

  @ApiProperty({ description: 'Product ID to review', format: 'uuid' })
  @IsNotEmpty({ message: 'Product is required' })
  @IsUUID('4', { message: 'Product must be a valid UUID' })
  productId: string;
}
