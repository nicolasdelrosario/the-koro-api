import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(signInDto: SignInDto): Promise<UserEntity | null> {
    const { email, password } = signInDto;

    const user = await this.usersService.findOneByEmail(email);
    if (!user) throw new BadRequestException('Invalid credentials');

    const isMatch = await compare(password, user.password);
    if (!isMatch) throw new BadRequestException('Invalid credentials');

    return user;
  }

  async signUp(signUpDto: SignUpDto): Promise<{ access_token: string }> {
    const { email, password } = signUpDto;

    const userExists = await this.usersService.findOneByEmail(email);
    if (userExists) throw new BadRequestException('Email already exists');

    const SALT_OR_ROUNDS = 10;
    const hashedPassword = await hash(password, SALT_OR_ROUNDS);

    const newUser = await this.usersService.save({
      ...signUpDto,
      password: hashedPassword,
    });

    return this.accessToken(newUser);
  }

  async accessToken(user: UserEntity): Promise<{ access_token: string }> {
    const { id, email, name, roles } = user;
    const payload: JwtPayload = { sub: id, email, name, roles };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
