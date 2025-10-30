import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '../enums/order-status.enum';

export class UpdateOrderStatusDto {
  @IsNotEmpty({ message: 'Status is required' })
  @IsEnum(OrderStatus, { message: 'Status must be a valid order status' })
  status: OrderStatus;
}
