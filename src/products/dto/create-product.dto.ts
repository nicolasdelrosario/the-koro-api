import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'Product title' })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @ApiProperty({ description: 'Product description' })
  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  description: string;

  @ApiProperty({ description: 'Product price', example: 99.99 })
  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must be a number with up to 2 decimal places' },
  )
  @IsPositive({ message: 'Price must be a positive number' })
  price: number;

  @ApiProperty({ description: 'Product stock', example: 10 })
  @IsNotEmpty({ message: 'Stock is required' })
  @IsNumber({}, { message: 'Stock must be a number' })
  @Min(0, { message: 'Stock must be a non-negative number' })
  stock: number;

  @ApiProperty({ description: 'Array of product image URLs', type: [String] })
  @IsArray({ message: 'Images must be an array' })
  @ArrayNotEmpty({ message: 'At least one image is required' })
  @IsString({ each: true, message: 'Each image must be a string' })
  @IsUrl({}, { each: true, message: 'Each image must be a valid URL' })
  images: string[];

  @ApiProperty({ description: 'Category ID', format: 'uuid' })
  @IsNotEmpty({ message: 'Category is required' })
  @IsUUID('4', { message: 'Category must be a valid UUID' })
  categoryId: string;
}
