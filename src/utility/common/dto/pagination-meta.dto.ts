import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({ example: 245 })
  totalItems: number;

  @ApiProperty({ example: 12 })
  itemCount: number;

  @ApiProperty({ example: 12 })
  itemsPerPage: number;

  @ApiProperty({ example: 21 })
  totalPages: number;

  @ApiProperty({ example: 1 })
  currentPage: number;
}
