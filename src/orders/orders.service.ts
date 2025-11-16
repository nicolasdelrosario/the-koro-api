import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { ProductEntity } from 'src/products/entities/product.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderEntity } from './entities/order.entity';
import { OrdersProductsEntity } from './entities/orders-products.entity';
import { ShippingEntity } from './entities/shipping.entity';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: JwtPayload) {
    if (!createOrderDto.orderedProducts?.length) {
      throw new BadRequestException('Ordered products are required.');
    }

    const ids = createOrderDto.orderedProducts.map((p) => p.id);
    const duplicates = ids.filter((id, idx) => ids.indexOf(id) !== idx);
    if (duplicates.length > 0) {
      throw new BadRequestException(
        `Duplicate product ids in order: ${[...new Set(duplicates)].join(', ')}`,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const shippingEntity = queryRunner.manager.create(
        ShippingEntity,
        createOrderDto.shipping,
      );
      await queryRunner.manager.save(ShippingEntity, shippingEntity);

      const orderEntity = queryRunner.manager.create(OrderEntity, {
        orderBy: { id: user.sub } as UserEntity,
        shipping: shippingEntity,
      });
      const savedOrder = await queryRunner.manager.save(
        OrderEntity,
        orderEntity,
      );

      const orderProductsToSave: OrdersProductsEntity[] = [];

      for (const ordered of createOrderDto.orderedProducts) {
        const product = await queryRunner.manager
          .getRepository(ProductEntity)
          .createQueryBuilder('product')
          .setLock('pessimistic_write')
          .where('product.id = :id', { id: ordered.id })
          .andWhere('product.deletedAt IS NULL')
          .getOne();

        if (!product) {
          throw new NotFoundException(
            `Product with id ${ordered.id} not found`,
          );
        }

        if (product.stock < ordered.quantity) {
          throw new BadRequestException(
            `Product with ID ${ordered.id} has only ${product.stock} available`,
          );
        }

        const orderProduct = queryRunner.manager.create(OrdersProductsEntity, {
          order: savedOrder,
          product,
          unitPrice: Number(product.price),
          quantity: ordered.quantity,
        });

        orderProductsToSave.push(orderProduct);
        product.stock -= ordered.quantity;
        await queryRunner.manager.save(ProductEntity, product);
      }

      await queryRunner.manager.save(OrdersProductsEntity, orderProductsToSave);

      await queryRunner.commitTransaction();

      return await this.findOneById(savedOrder.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return await this.orderRepository.find({
      relations: {
        shipping: true,
        orderBy: true,
        products: {
          product: true,
        },
        updatedBy: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findMyOrders(user: JwtPayload): Promise<OrderEntity[]> {
    return await this.orderRepository.find({
      where: { orderBy: { id: user.sub } },
      relations: {
        shipping: true,
        orderBy: true,
        products: { product: true },
        updatedBy: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async findOneById(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: {
        shipping: true,
        orderBy: true,
        products: {
          product: true,
        },
        updatedBy: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async update(
    id: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
    user: JwtPayload,
  ) {
    const order = await this.findOneById(id);

    if ([OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(order.status)) {
      throw new BadRequestException(
        `Order is ${order.status} and cannot be updated`,
      );
    }

    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
      [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    if (order.status === updateOrderStatusDto.status) {
      return order;
    }

    if (
      !validTransitions[order.status]?.includes(updateOrderStatusDto.status)
    ) {
      throw new BadRequestException(
        `Invalid status transition from ${order.status} to ${updateOrderStatusDto.status}`,
      );
    }

    if (updateOrderStatusDto.status === OrderStatus.SHIPPED) {
      order.shippedAt = new Date();
    }

    if (updateOrderStatusDto.status === OrderStatus.DELIVERED) {
      order.deliveredAt = new Date();
    }

    order.status = updateOrderStatusDto.status;
    order.updatedBy = { id: user.sub } as UserEntity;

    const updatedOrder = await this.orderRepository.save(order);

    return this.findOneById(updatedOrder.id);
  }

  async cancel(id: string, user: JwtPayload) {
    const order = await this.findOneById(id);

    if (
      order.status === OrderStatus.DELIVERED ||
      order.status === OrderStatus.CANCELLED
    ) {
      throw new BadRequestException(`Order status cannot be updated`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const orderProduct of order.products) {
        const product = await queryRunner.manager
          .getRepository(ProductEntity)
          .createQueryBuilder('product')
          .setLock('pessimistic_write')
          .where('product.id = :id', { id: orderProduct.product.id })
          .andWhere('product.deletedAt IS NULL')
          .getOne();

        if (product) {
          product.stock = (product.stock ?? 0) + orderProduct.quantity;
          await queryRunner.manager.save(ProductEntity, product);
        }
      }

      order.status = OrderStatus.CANCELLED;
      order.updatedBy = { id: user.sub } as UserEntity;

      await queryRunner.manager.save(OrderEntity, order);
      await queryRunner.commitTransaction();

      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<OrderEntity> {
    const order = await this.findOneById(id);

    return await this.orderRepository.softRemove(order);
  }
}
