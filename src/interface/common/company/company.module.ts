import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { AnnouncementBusinessModule } from '@business/announcement-business/announcement-business.module';

@Module({
  imports: [AnnouncementBusinessModule],
  controllers: [CompanyController],
})
export class CompanyModule {}
