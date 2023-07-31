import { Tokens, Logout, VerifyAccess } from './types';
import { AuthDto, CreateUserDto } from './dto';
import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RtGuard } from 'src/common/guards';
import {
  GetCurrentUser,
  GetCurrentUserId,
  Public,
} from 'src/common/decorators';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  @ApiCreatedResponse({
    description: 'User has been successfully created.',
    type: Tokens,
  })
  @HttpCode(HttpStatus.CREATED)
  signupLocal(@Body() dto: CreateUserDto): Promise<Tokens> {
    return this.authService.signupLocal(dto);
  }

  @Public()
  @Post('signin')
  @ApiOkResponse({
    description: 'Logged in succesfully.',
    type: Tokens,
  })
  @HttpCode(HttpStatus.OK)
  signinLocal(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signinLocal(dto);
  }

  @Post('logout')
  @ApiOkResponse({
    description: 'Logged out succesfully.',
    type: Logout,
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: number): Promise<Logout> {
    return this.authService.logout(userId);
  }

  // @Public()
  // @UseGuards(RtGuard)
  // @Post('refresh')
  // @ApiBearerAuth()
  // @HttpCode(HttpStatus.OK)
  // refreshTokens(
  //   @GetCurrentUserId() userId: number,
  //   @GetCurrentUser('refreshToken') refreshToken: string,
  // ) {
  //   return this.authService.refreshTokens(userId, refreshToken);
  // }
  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Post('verify-access')
  @ApiOkResponse({
    description: 'Access approved.',
    type: VerifyAccess,
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  verifyAccess(): Promise<VerifyAccess> {
    return this.authService.verifyAccess();
  }
}
