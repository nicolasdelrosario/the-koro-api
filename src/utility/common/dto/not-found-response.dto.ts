import { ApiProperty } from '@nestjs/swagger';

export class NotFoundResponseDto {
  @ApiProperty({
    oneOf: [
      { type: 'string', example: 'Not found error' },
      {
        type: 'array',
        items: { type: 'string' },
        example: ['Not found'],
      },
    ],
  })
  message: string | string[];

  @ApiProperty({ example: 'Not Found' })
  error: string;

  @ApiProperty({ example: 404 })
  statusCode: number;
}
