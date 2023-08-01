import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto';
import { User } from './types';

@Controller('users')
export class UserController {
  constructor(private userService: UsersService) {}

  @Post('create')
  createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @Get(':id')
  getUser(@Param('id') id: string): Promise<User> {
    return this.userService.getUser(+id);
  }
}
