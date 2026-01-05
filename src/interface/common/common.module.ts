import { Module } from '@nestjs/common';
import { CmsCommonController } from './common.controller';
import { CommonBusinessModule } from '@business/common';

/**
 * CMS 공통 인터페이스 모듈
 */
@Module({
  imports: [CommonBusinessModule],
  controllers: [CmsCommonController],
})
export class CmsCommonInterfaceModule {}
