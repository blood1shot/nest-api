import { AuthDto, CreateUserDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Tokens, Logout, VerifyAccess } from './types';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async signupLocal(dto: CreateUserDto): Promise<Tokens> {
    const newUser = await this.usersService.createUser(dto);

    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.usersService.updateUserRtHash(newUser.id, tokens.refresh_token);
    return tokens;
  }

  async signinLocal(dto: AuthDto): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('Access Denied');

    const passwordMatches = await bcrypt.compare(dto.password, user.hash);
    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.usersService.updateUserRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: number): Promise<Logout> {
    await this.usersService.deleteUserRtHash(userId);

    return { message: 'Logged out successfully' };
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user.hashedRt) throw new ForbiddenException('Access denied');

    const rtMatches = await bcrypt.compare(refreshToken, user.hashedRt);
    if (!rtMatches) throw new ForbiddenException('Access denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.usersService.updateUserRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async verifyAccess(): Promise<VerifyAccess> {
    return { message: 'Access approved.' };
  }

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'at-secret',
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'rt-secret',
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
