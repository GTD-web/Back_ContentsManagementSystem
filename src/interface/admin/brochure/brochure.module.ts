import { Module } from '@nestjs/common';
import { AuthContextModule } from '@context/auth-context';
import { BrochureBusinessModule } from '@business/brochure-business/brochure-business.module';
import { BrochureController } from './brochure.controller';

/**
 * 브로슈어 인터페이스 모듈
 */
@Module({
  imports: [AuthContextModule, BrochureBusinessModule],
  controllers: [BrochureController],
})
export class BrochureInterfaceModule {}
