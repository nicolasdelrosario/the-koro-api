import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateShippingDto {
  @ApiProperty({ description: 'Contact phone number' })
  @IsNotEmpty({ message: 'Phone is required' })
  @IsString({ message: 'Phone format should be string' })
  phone: string;

  @ApiProperty({ description: 'Recipient name', required: false })
  @IsOptional()
  @IsString({ message: 'Name format should be string' })
  name: string;

  @ApiProperty({ description: 'Street address' })
  @IsNotEmpty({ message: 'Address is required' })
  @IsString({ message: 'Address format should be string' })
  address: string;

  @ApiProperty({ description: 'City name' })
  @IsNotEmpty({ message: 'City is required' })
  @IsString({ message: 'City format should be string' })
  city: string;

  @ApiProperty({ description: 'Postal code', example: '10001' })
  @IsNotEmpty({ message: 'Post Code is required' })
  @IsNumberString({}, { message: 'Post Code format should be string' })
  postCode: string;

  @ApiProperty({ description: 'State or province' })
  @IsNotEmpty({ message: 'State is required' })
  @IsString({ message: 'State format should be string' })
  state: string;

  @ApiProperty({ description: 'Country' })
  @IsNotEmpty({ message: 'Country is required' })
  @IsString({ message: 'Country format should be string' })
  country: string;
}
