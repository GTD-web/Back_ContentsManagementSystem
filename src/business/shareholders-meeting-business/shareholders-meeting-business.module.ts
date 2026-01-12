import { Module } from '@nestjs/common';
import { ShareholdersMeetingContextModule } from '@context/shareholders-meeting-context/shareholders-meeting-context.module';
import { CategoryModule } from '@domain/common/category/category.module';
import { StorageModule } from '@libs/storage/storage.module';
import { ShareholdersMeetingBusinessService } from './shareholders-meeting-business.service';

/**
 * 주주총회 비즈니스 모듈
 */
@Module({
  imports: [ShareholdersMeetingContextModule, CategoryModule, StorageModule],
  providers: [ShareholdersMeetingBusinessService],
  exports: [ShareholdersMeetingBusinessService],
})
export class ShareholdersMeetingBusinessModule {}
