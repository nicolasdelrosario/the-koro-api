import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
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

    const payload: JwtPayload = {
      sub: newUser.id,
      email: newUser.email,
      name: newUser.name,
      roles: newUser.roles,
    };

    return this.accessToken(payload);
  }

  async accessToken(payload: JwtPayload): Promise<{ access_token: string }> {
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async updateProfile(
    userPayload: JwtPayload,
    updateProfileDto: UpdateProfileDto,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneById(userPayload.sub);
    if (!user) throw new BadRequestException('User not found');

    if (updateProfileDto.email && updateProfileDto.email !== user.email) {
      const existing = await this.usersService.findOneByEmail(
        updateProfileDto.email,
      );

      if (existing && existing.id !== user.id) {
        throw new BadRequestException('Email already exists');
      }
    }

    user.name = updateProfileDto.name ?? user.name;
    user.email = updateProfileDto.email ?? user.email;

    const saved = await this.usersService.save(user);

    const payload: JwtPayload = {
      sub: saved.id,
      email: saved.email,
      name: saved.name,
      roles: saved.roles,
    };

    return this.accessToken(payload);
  }
}
