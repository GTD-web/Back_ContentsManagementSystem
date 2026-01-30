import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Language } from '@domain/common/language/language.entity';
import { Logger } from '@nestjs/common';

/**
 * 기본 언어 초기화 커맨드
 */
export class InitializeDefaultLanguagesCommand {
  constructor(public readonly createdBy?: string) {}
}

/**
 * 기본 언어 초기화 핸들러
 */
@CommandHandler(InitializeDefaultLanguagesCommand)
export class InitializeDefaultLanguagesHandler
  implements ICommandHandler<InitializeDefaultLanguagesCommand>
{
  private readonly logger = new Logger(InitializeDefaultLanguagesHandler.name);

  constructor(
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
    private readonly configService: ConfigService,
  ) {}

  async execute(
    command: InitializeDefaultLanguagesCommand,
  ): Promise<Language[]> {
    this.logger.log('기본 언어 초기화 시작');

    // 기본 언어 코드 가져오기
    const defaultLanguageCode = this.configService.get<string>(
      'DEFAULT_LANGUAGE_CODE',
      'en',
    );

    // 기본 언어 목록
    const defaultLanguages = [
      { code: 'en', name: 'English' },
      { code: 'ko', name: '한국어' },
      { code: 'ja', name: '日本語' },
      { code: 'zh', name: '中文' },
    ];

    const createdLanguages: Language[] = [];

    for (const lang of defaultLanguages) {
      // 이미 존재하는지 확인
      const existing = await this.languageRepository.findOne({
        where: { code: lang.code },
      });

      if (!existing) {
        const isDefaultLang = lang.code === defaultLanguageCode;
        const language = this.languageRepository.create({
          code: lang.code,
          name: lang.name,
          isActive: true,
          isDefault: isDefaultLang,
          createdBy: command.createdBy,
        });
        const saved = await this.languageRepository.save(language);
        createdLanguages.push(saved);
        
        if (isDefaultLang) {
          this.logger.log(`✅ 기본 언어 추가 완료 - ${lang.name} (${lang.code}) [시스템 기본 언어]`);
        } else {
          this.logger.log(`기본 언어 추가 완료 - ${lang.name} (${lang.code})`);
        }
      } else {
        // 기존 언어의 isDefault 값 업데이트
        const isDefaultLang = lang.code === defaultLanguageCode;
        if (existing.isDefault !== isDefaultLang) {
          existing.isDefault = isDefaultLang;
          await this.languageRepository.save(existing);
        }
        
        if (isDefaultLang) {
          this.logger.log(
            `✅ 기본 언어 확인 완료 - ${lang.name} (${lang.code}) [시스템 기본 언어, 이미 존재]`,
          );
        } else {
          this.logger.log(
            `기본 언어 건너뛰기 - ${lang.name} (${lang.code}) 이미 존재`,
          );
        }
      }
    }

    this.logger.log(
      `기본 언어 초기화 완료 - 총 ${createdLanguages.length}개 추가됨`,
    );

    return createdLanguages;
  }
}
