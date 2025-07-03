import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Get,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { RegisterRequest } from '@tradelink/shared';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { LocalAuthGuard } from '../../guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() registerData: RegisterRequest) {
    try {
      return await this.authService.register(registerData);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'User with this email already exists'
      ) {
        throw new ConflictException(error.message);
      }
      throw new BadRequestException('Registration failed');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
