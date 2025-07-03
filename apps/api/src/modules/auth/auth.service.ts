import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterRequest } from '@tradelink/shared';

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

    const { password: _, ...result } = user;

    return result;
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

    const { password: _, ...userWithoutPassword } = user;

    return this.login(userWithoutPassword);
  }
}
