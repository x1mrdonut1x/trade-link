import { Module } from '@nestjs/common';

import { CompanyModule } from '../company/company.module';
import { ContactModule } from '../contact/contact.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ImportController } from './import.controller';
import { ImportService } from './import.service';

@Module({
  imports: [PrismaModule, CompanyModule, ContactModule],
  controllers: [ImportController],
  providers: [ImportService],
})
export class ImportModule {}
