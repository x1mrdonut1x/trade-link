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
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { LoginRequest, RegisterRequest } from '@tradelink/shared';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Body() loginData: LoginRequest) {
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
