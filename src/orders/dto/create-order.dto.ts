import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { CreateShippingDto } from './create-shipping.dto';
import { OrderedProductsDto } from './ordered-products.dto';

export class CreateOrderDto {
  @ApiProperty({ description: 'Shipping details' })
  @IsNotEmpty({ message: 'Shipping address is required.' })
  @Type(() => CreateShippingDto)
  @ValidateNested()
  shipping: CreateShippingDto;

  @ApiProperty({ description: 'Ordered products', type: [OrderedProductsDto] })
  @IsNotEmpty({ message: 'Ordered products are required.' })
  @IsArray({ message: 'Ordered products must be an array.' })
  @ArrayMinSize(1, { message: 'At least one ordered product is required.' })
  @ValidateNested({ each: true })
  @Type(() => OrderedProductsDto)
  orderedProducts: OrderedProductsDto[];
}
