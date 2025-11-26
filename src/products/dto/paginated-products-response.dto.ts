import { ProductEntity } from 'src/products/entities/product.entity';
import { PaginatedResponseDto } from 'src/utility/common/dto/paginated-response.dto';

export class PaginatedProductsResponseDto extends PaginatedResponseDto(
  ProductEntity,
) {}
