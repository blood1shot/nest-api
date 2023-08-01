import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto';
import * as bcrypt from 'bcryptjs';
import { User } from './types';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const hash = await this.hashData(dto.password);

    const newUser = await this.prisma.user.create({
      data: {
        firstname: dto.firstname,
        lastname: dto.lastname,
        email: dto.email,
        hash,
      },
    });

    return this.omitProperties(newUser, 'hash', 'hashedRt');
  }

  async getUser(userId: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: +userId,
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return this.omitProperties(user, 'hash', 'hashedRt');
  }

  async updateUserRtHash(userId: number, refreshToken: string): Promise<void> {
    const hash = await this.hashData(refreshToken);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    });
  }

  async deleteUserRtHash(userId: number): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  omitProperties(obj, ...props) {
    const result = { ...obj };
    props.forEach((prop) => {
      delete result[prop];
    });
    return result;
  }
}
