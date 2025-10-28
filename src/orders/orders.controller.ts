import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { FindOneParams } from 'src/utility/common/entities/find-one-params.entity';
import type { AuthenticatedRequest } from 'src/utility/common/interfaces/authenticated-request.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return await this.ordersService.create(createOrderDto, req.user);
  }

  @Get()
  async findAll() {
    return await this.ordersService.findAll();
  }

  @Get(':id')
  async findOne(@Param() params: FindOneParams) {
    return await this.ordersService.findOneById(params.id);
  }

  @Patch(':id')
  async update(
    @Param() params: FindOneParams,
    @Request() req: AuthenticatedRequest,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return await this.ordersService.update(
      params.id,
      updateOrderStatusDto,
      req.user,
    );
  }

  @Patch(':id/cancel')
  async cancel(
    @Param() params: FindOneParams,
    @Request() req: AuthenticatedRequest,
  ) {
    return await this.ordersService.cancel(params.id, req.user);
  }

  @Delete(':id')
  async remove(@Param() params: FindOneParams) {
    return await this.ordersService.remove(params.id);
  }
}
