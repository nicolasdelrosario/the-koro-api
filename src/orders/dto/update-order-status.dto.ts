import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { OrderStatus } from '../enums/order-status.enum';

export class UpdateOrderStatusDto {
  @IsNotEmpty({ message: 'Status is required' })
  @IsString({ message: 'Status must be a string' })
  @IsIn([OrderStatus.SHIPPED, OrderStatus.DELIVERED], {
    message: 'Status must be either SHIPPED or DELIVERED',
  })
  status: OrderStatus;
}
