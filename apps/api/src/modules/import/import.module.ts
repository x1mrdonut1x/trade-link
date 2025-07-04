import { Module } from '@nestjs/common';

import { ImportController } from './import.controller';
import { ImportService } from './import.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CompanyModule } from '../company/company.module';
import { ContactModule } from '../contact/contact.module';

@Module({
  imports: [PrismaModule, CompanyModule, ContactModule],
  controllers: [ImportController],
  providers: [ImportService],
})
export class ImportModule {}
