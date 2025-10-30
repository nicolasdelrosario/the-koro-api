import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { BadRequestResponseDto } from 'src/utility/common/dto/bad-request-response.dto';
import { UnauthorizedResponseDto } from 'src/utility/common/dto/unauthorized-response.dto';
import type { AuthenticatedRequest } from 'src/utility/common/interfaces/authenticated-request.interface';
import { AuthService } from './auth.service';
import { AccessTokenDto } from './dto/access-token.dto';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({
    summary: 'Register',
    description:
      'Creates a new account and returns a JWT access token to authenticate subsequent requests.',
  })
  @ApiCreatedResponse({ description: 'JWT access token', type: AccessTokenDto })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: BadRequestResponseDto,
  })
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({
    summary: 'Login',
    description:
      'Validates credentials using local strategy and returns a JWT access token upon success.',
  })
  @ApiOkResponse({ description: 'JWT access token', type: AccessTokenDto })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: BadRequestResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: UnauthorizedResponseDto,
  })
  async login(@Request() req: AuthenticatedRequest) {
    return this.authService.accessToken(req.user);
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List Profile',
    description:
      'Returns the JWT payload for the currently authenticated user.',
  })
  @ApiOkResponse({ description: 'JWT payload', type: JwtPayloadDto })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing token',
    type: UnauthorizedResponseDto,
  })
  getProfile(@Request() req: AuthenticatedRequest) {
    return req.user;
  }
}
