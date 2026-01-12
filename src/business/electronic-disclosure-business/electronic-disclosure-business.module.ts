import { Module } from '@nestjs/common';
import { ElectronicDisclosureBusinessService } from './electronic-disclosure-business.service';
import { ElectronicDisclosureContextModule } from '@context/electronic-disclosure-context/electronic-disclosure-context.module';
import { StorageModule } from '@libs/storage/storage.module';
import { CategoryModule } from '@domain/common/category/category.module';

/**
 * 전자공시 비즈니스 모듈
 */
@Module({
  imports: [ElectronicDisclosureContextModule, StorageModule, CategoryModule],
  providers: [ElectronicDisclosureBusinessService],
  exports: [ElectronicDisclosureBusinessService],
})
export class ElectronicDisclosureBusinessModule {}
