import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type {
  CreateUserRequest,
  GetUserResponse,
  UpdateUserRequest,
} from '@tradelink/shared/user';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUser(id: number): Promise<GetUserResponse> {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: id },
    });
  }

  async createUser(data: CreateUserRequest) {
    return this.prisma.user.create({
      data,
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
