import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from './pagination-meta.dto';

export function PaginatedResponseDto<T>(itemType: Type<T>) {
  class PaginatedResponse {
    @ApiProperty({ type: () => [itemType] })
    data: T[];

    @ApiProperty({ type: () => PaginationMetaDto })
    meta: PaginationMetaDto;
  }

  return PaginatedResponse;
}
