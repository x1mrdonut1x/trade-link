import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventScheduleController } from './eventSchedule.controller';
import { EventScheduleService } from './eventSchedule.service';

@Module({
  imports: [PrismaModule],
  controllers: [EventsController, EventScheduleController],
  providers: [EventsService, EventScheduleService],
  exports: [EventsService, EventScheduleService],
})
export class EventsModule {}
