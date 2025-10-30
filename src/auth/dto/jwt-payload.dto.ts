import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/utility/common/enums/roles.enum';

export class JwtPayloadDto {
  @ApiProperty({ description: 'User ID', format: 'uuid' })
  sub: string;

  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({ description: 'User name' })
  name: string;

  @ApiProperty({ enum: Role, isArray: true, description: 'User roles' })
  roles: Role[];

  @ApiProperty({ description: 'Issued at', type: Number, required: false })
  iat?: number;

  @ApiProperty({ description: 'Expiration', type: Number, required: false })
  exp?: number;
}
