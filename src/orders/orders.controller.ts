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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BadRequestResponseDto } from 'src/utility/common/dto/bad-request-response.dto';
import { ForbiddenResponseDto } from 'src/utility/common/dto/forbidden-response.dto';
import { NotFoundResponseDto } from 'src/utility/common/dto/not-found-response.dto';
import { UnauthorizedResponseDto } from 'src/utility/common/dto/unauthorized-response.dto';
import { FindOneParams } from 'src/utility/common/entities/find-one-params.entity';
import { Role } from 'src/utility/common/enums/roles.enum';
import type { AuthenticatedRequest } from 'src/utility/common/interfaces/authenticated-request.interface';
import { Roles } from 'src/utility/decorators/roles.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderEntity } from './entities/order.entity';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create Order',
    description:
      'Creates an order for the authenticated user, including shipping and ordered products.',
  })
  @ApiCreatedResponse({ description: 'Order created', type: OrderEntity })
  @ApiBadRequestResponse({
    description: 'Bad request error',
    type: BadRequestResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing token',
    type: UnauthorizedResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
    type: NotFoundResponseDto,
  })
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return await this.ordersService.create(createOrderDto, req.user);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'List Orders',
    description: 'Admin-only endpoint.',
  })
  @ApiOkResponse({ description: 'List of orders', type: [OrderEntity] })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing token',
    type: UnauthorizedResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'You do not have permission to access this resource',
    type: ForbiddenResponseDto,
  })
  async findAll() {
    return await this.ordersService.findAll();
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List My Orders',
    description: 'Authenticated endpoint. Lists orders created by the user.',
  })
  @ApiOkResponse({ description: 'List of my orders', type: [OrderEntity] })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing token',
    type: UnauthorizedResponseDto,
  })
  async findMyOrders(
    @Request() req: AuthenticatedRequest,
  ): Promise<OrderEntity[]> {
    return await this.ordersService.findMyOrders(req.user);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'List Order by ID',
    description: 'Admin-only endpoint.',
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    schema: { type: 'string', format: 'uuid' },
  })
  @ApiOkResponse({ description: 'Order details', type: OrderEntity })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing token',
    type: UnauthorizedResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'You do not have permission to access this resource',
    type: ForbiddenResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Order not found',
    type: NotFoundResponseDto,
  })
  async findOne(@Param() params: FindOneParams) {
    return await this.ordersService.findOneById(params.id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Update Order Status',
    description: 'Admin-only endpoint.',
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    schema: { type: 'string', format: 'uuid' },
  })
  @ApiOkResponse({ description: 'Order updated', type: OrderEntity })
  @ApiBadRequestResponse({
    description: 'Invalid status transition or order not updatable',
    type: BadRequestResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing token',
    type: UnauthorizedResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'You do not have permission to access this resource',
    type: ForbiddenResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Order not found',
    type: NotFoundResponseDto,
  })
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
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Cancel Order',
    description: 'Admin-only endpoint.',
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    schema: { type: 'string', format: 'uuid' },
  })
  @ApiOkResponse({ description: 'Order cancelled', type: OrderEntity })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing token',
    type: UnauthorizedResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'You do not have permission to access this resource',
    type: ForbiddenResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Order not found',
    type: NotFoundResponseDto,
  })
  async cancel(
    @Param() params: FindOneParams,
    @Request() req: AuthenticatedRequest,
  ) {
    return await this.ordersService.cancel(params.id, req.user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Delete Order',
    description: 'Admin-only endpoint.',
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    schema: { type: 'string', format: 'uuid' },
  })
  @ApiOkResponse({ description: 'Order deleted', type: OrderEntity })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing token',
    type: UnauthorizedResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'You do not have permission to access this resource',
    type: ForbiddenResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Order not found',
    type: NotFoundResponseDto,
  })
  async remove(@Param() params: FindOneParams) {
    return await this.ordersService.remove(params.id);
  }
}
