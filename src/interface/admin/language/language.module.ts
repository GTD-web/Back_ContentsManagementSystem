import { Module } from '@nestjs/common';
import { AuthContextModule } from '@context/auth-context';
import { LanguageBusinessModule } from '@business/language-business/language-business.module';
import { LanguageController } from './language.controller';

/**
 * 언어 인터페이스 모듈
 */
@Module({
  imports: [AuthContextModule, LanguageBusinessModule],
  controllers: [LanguageController],
})
export class LanguageInterfaceModule {}
