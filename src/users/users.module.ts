import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserController } from './users.controller';

@Module({
  providers: [UsersService],
  controllers: [UserController],
})
export class UserModule {}
