import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateShippingDto {
  @IsNotEmpty({ message: 'Phone is required' })
  @IsString({ message: 'Phone format should be string' })
  phone: string;

  @IsOptional()
  @IsString({ message: 'Name format should be string' })
  name: string;

  @IsNotEmpty({ message: 'Address is required' })
  @IsString({ message: 'Address format should be string' })
  address: string;

  @IsNotEmpty({ message: 'City is required' })
  @IsString({ message: 'City format should be string' })
  city: string;

  @IsNotEmpty({ message: 'Post Code is required' })
  @IsNumberString({}, { message: 'Post Code format should be string' })
  postCode: string;

  @IsNotEmpty({ message: 'State is required' })
  @IsString({ message: 'State format should be string' })
  state: string;

  @IsNotEmpty({ message: 'Country is required' })
  @IsString({ message: 'Country format should be string' })
  country: string;
}
