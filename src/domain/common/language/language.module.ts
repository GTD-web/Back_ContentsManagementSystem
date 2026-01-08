import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from './language.entity';
import { LanguageService } from './language.service';

/**
 * 언어 모듈
 * 다국어 지원을 위한 언어 관리 기능을 제공합니다.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Language])],
  providers: [LanguageService],
  exports: [LanguageService],
})
export class LanguageModule {}
