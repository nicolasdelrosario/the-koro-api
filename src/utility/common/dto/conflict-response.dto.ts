import { ApiProperty } from '@nestjs/swagger';

export class ConflictResponseDto {
  @ApiProperty({
    oneOf: [
      { type: 'string', example: 'Conflict error' },
      {
        type: 'array',
        items: { type: 'string' },
        example: ['User already reviewed this product'],
      },
    ],
  })
  message: string | string[];

  @ApiProperty({ example: 'Conflict' })
  error: string;

  @ApiProperty({ example: 409 })
  statusCode: number;
}
