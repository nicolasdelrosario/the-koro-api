import { ApiProperty } from '@nestjs/swagger';

export class UnauthorizedResponseDto {
  @ApiProperty({
    oneOf: [
      { type: 'string', example: 'Unauthorized error' },
      {
        type: 'array',
        items: { type: 'string' },
        example: ['Invalid or missing token'],
      },
    ],
  })
  message: string | string[];

  @ApiProperty({ example: 'Unauthorized' })
  error: string;

  @ApiProperty({ example: 401 })
  statusCode: number;
}
