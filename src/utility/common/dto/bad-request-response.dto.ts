import { ApiProperty } from '@nestjs/swagger';

export class BadRequestResponseDto {
  @ApiProperty({
    oneOf: [
      { type: 'string', example: 'Bad request error' },
      {
        type: 'array',
        items: { type: 'string' },
        example: ['Title is required', 'Price is required'],
      },
    ],
  })
  message: string | string[];

  @ApiProperty({ example: 'Bad Request' })
  error: string;

  @ApiProperty({ example: 400 })
  statusCode: number;
}
