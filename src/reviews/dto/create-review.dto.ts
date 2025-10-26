import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty({ message: 'Ratings is required' })
  @IsNumber({}, { message: 'Ratings must be a number' })
  @Min(0, { message: 'Ratings must be a non-negative number' })
  @Max(5, { message: 'Ratings must be a number between 0 and 5' })
  ratings: number;

  @IsNotEmpty({ message: 'Comment is required' })
  @IsString({ message: 'Comment must be a string' })
  comment: string;

  @IsNotEmpty({ message: 'Product is required' })
  @IsUUID('4', { message: 'Product must be a valid UUID' })
  productId: string;
}
