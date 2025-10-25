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
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  description: string;

  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must be a number with up to 2 decimal places' },
  )
  @IsPositive({ message: 'Price must be a positive number' })
  price: number;

  @IsNotEmpty({ message: 'Stock is required' })
  @IsNumber({}, { message: 'Stock must be a number' })
  @Min(0, { message: 'Stock must be a non-negative number' })
  stock: number;

  @IsArray({ message: 'Images must be an array' })
  @ArrayNotEmpty({ message: 'At least one image is required' })
  @IsString({ each: true, message: 'Each image must be a string' })
  @IsUrl({}, { each: true, message: 'Each image must be a valid URL' })
  images: string[];

  @IsNotEmpty({ message: 'Category is required' })
  @IsUUID('4', { message: 'Category must be a valid UUID' })
  categoryId: string;
}
