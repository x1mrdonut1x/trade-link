import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [PrismaModule],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
