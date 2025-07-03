import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import type {
  CreateUserRequest,
  GetUserResponse,
  UpdateUserRequest,
} from '@tradelink/shared';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUser(id: number): Promise<GetUserResponse> {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: id },
    });
  }

  async createUser(data: CreateUserRequest) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    const { password, ...userData } = data;
    return this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
  }

  async updateUser(id: number, data: UpdateUserRequest) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: number) {
    await this.prisma.user.delete({
      where: { id },
    });
    return { success: true, message: 'User deleted successfully' };
  }

  async getAllUsers() {
    return this.prisma.user.findMany();
  }
}
