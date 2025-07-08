import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginResponse, RefreshTokenRequest, RegisterRequest, type JWTToken } from '@tradelink/shared';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<JWTToken | null> {
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

  async login(user: JWTToken): Promise<LoginResponse> {
    const tenants = await this.prisma.tenant.findMany({
      where: { membership: { some: { userId: user.id } } },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const payload: JWTToken = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      membership: tenants.map(t => ({ id: t.id, name: t.name })),
    };

    // Generate access token (shorter expiry)
    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h', // Access token expires in 1 hour
    });

    // Generate refresh token (longer expiry)
    const refresh_token = await this.jwtService.signAsync(
      { id: user.id, email: user.email },
      {
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        expiresIn: '7d', // Refresh token expires in 7 days
      }
    );

    // Store hashed refresh token in database
    const saltRounds = 12;
    const hashedRefreshToken = await bcrypt.hash(refresh_token, saltRounds);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefreshToken },
    });

    return {
      access_token,
      refresh_token,
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
      throw new ConflictException('User with this email already exists');
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

  async refreshToken(refreshTokenData: RefreshTokenRequest): Promise<LoginResponse> {
    // Verify the refresh token
    const decoded = await this.jwtService.verifyAsync(refreshTokenData.refresh_token, {
      secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    });

    // Find user and verify stored refresh token
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: decoded.id },
    });

    if (!user.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Verify the refresh token matches the stored hash
    const refreshTokenMatches = await bcrypt.compare(refreshTokenData.refresh_token, user.refreshToken);
    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Generate new tokens (this will also update the stored refresh token)
    return this.login({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  }

  async logout(userId: number): Promise<void> {
    // Clear the refresh token from the database
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }
}
