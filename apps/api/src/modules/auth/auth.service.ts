import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterRequest } from '@tradelink/shared';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';

export interface AuthenticatedUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<AuthenticatedUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) return null;

    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      id: user.id,
    };
  }

  async login(user: AuthenticatedUser): Promise<LoginResponse> {
    const payload = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async register(registerData: RegisterRequest): Promise<LoginResponse> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerData.email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(registerData.password, saltRounds);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: registerData.email,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        password: hashedPassword,
      },
    });

    return this.login({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  }
}
