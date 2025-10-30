import { ApiProperty } from '@nestjs/swagger';

export class ForbiddenResponseDto {
  @ApiProperty({
    oneOf: [
      { type: 'string', example: 'Forbidden error' },
      {
        type: 'array',
        items: { type: 'string' },
        example: ['You do not have permission to access this resource'],
      },
    ],
  })
  message: string | string[];

  @ApiProperty({ example: 'Forbidden' })
  error: string;

  @ApiProperty({ example: 403 })
  statusCode: number;
}
