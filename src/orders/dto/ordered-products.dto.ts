import { IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';

export class OrderedProductsDto {
  @IsNotEmpty({ message: 'ID is required.' })
  @IsUUID('4', { message: 'ID must be a valid UUID.' })
  id: string;

  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Unit Price must be a number with up to 2 decimal places' },
  )
  @IsPositive({ message: 'Unit Price must be a positive number' })
  unitPrice: number;

  @IsNotEmpty({ message: 'Quantity is required' })
  @IsNumber({}, { message: 'Quantity must be a number' })
  @IsPositive({ message: 'Quantity must be a positive number' })
  quantity: number;
}
