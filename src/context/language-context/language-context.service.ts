import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CreateLanguageCommand } from './handlers/commands/create-language.handler';
import { UpdateLanguageCommand } from './handlers/commands/update-language.handler';
import { UpdateLanguageActiveCommand } from './handlers/commands/update-language-active.handler';
import { UpdateLanguageOrderCommand } from './handlers/commands/update-language-order.handler';
import { DeleteLanguageCommand } from './handlers/commands/delete-language.handler';
import { InitializeDefaultLanguagesCommand } from './handlers/commands/initialize-default-languages.handler';
import { GetLanguageListQuery } from './handlers/queries/get-language-list.handler';
import {
  CreateLanguageDto,
  CreateLanguageResult,
  UpdateLanguageDto,
  LanguageListResult,
} from './interfaces/language-context.interface';
import { Language } from '@domain/common/language/language.entity';

/**
 * 언어 컨텍스트 서비스
 *
 * 언어 생성, 수정, 삭제 및 조회 비즈니스 로직을 담당합니다.
 */
@Injectable()
export class LanguageContextService implements OnModuleInit {
  private readonly logger = new Logger(LanguageContextService.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 모듈 초기화 시 기본 언어를 자동으로 추가한다
   * CQRS 핸들러가 초기화되기 전에 실행되므로 직접 Repository 사용
   */
  async onModuleInit() {
    try {
      this.logger.log('🌐 서버 시작 시 기본 언어 초기화 시작...');
      
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
            createdBy: 'system',
          });
          const saved = await this.languageRepository.save(language);
          createdLanguages.push(saved);
          
          if (isDefaultLang) {
            this.logger.log(`✅ 기본 언어 추가 완료 - ${lang.name} (${lang.code}) [시스템 기본 언어]`);
          } else {
            this.logger.log(`   - ${lang.name} (${lang.code})`);
          }
        } else {
          // 기존 언어의 isDefault 값 업데이트 (마이그레이션 후 첫 실행 시)
          const isDefaultLang = lang.code === defaultLanguageCode;
          if (existing.isDefault !== isDefaultLang) {
            existing.isDefault = isDefaultLang;
            await this.languageRepository.save(existing);
            this.logger.log(`   - ${lang.name} (${lang.code}) isDefault 업데이트됨`);
          }
          
          if (isDefaultLang) {
            this.logger.log(`✅ 기본 언어 확인 완료 - ${lang.name} (${lang.code}) [시스템 기본 언어, 이미 존재]`);
          }
        }
      }

      if (createdLanguages.length > 0) {
        this.logger.log(`✅ 기본 언어 초기화 완료 - ${createdLanguages.length}개 언어 추가됨`);
      } else {
        this.logger.log('✅ 기본 언어가 이미 존재합니다.');
      }
    } catch (error) {
      this.logger.error('❌ 기본 언어 초기화 실패', error);
      // 에러가 발생해도 서버 시작은 계속 진행
    }
  }

  /**
   * 언어를 생성한다
   */
  async 언어를_생성한다(
    data: CreateLanguageDto,
  ): Promise<CreateLanguageResult> {
    const command = new CreateLanguageCommand(data);
    return await this.commandBus.execute(command);
  }

  /**
   * 언어를 수정한다
   */
  async 언어를_수정한다(
    id: string,
    data: UpdateLanguageDto,
  ): Promise<Language> {
    const command = new UpdateLanguageCommand(id, data);
    return await this.commandBus.execute(command);
  }

  /**
   * 언어 활성 상태를 수정한다
   */
  async 언어_활성_상태를_수정한다(
    id: string,
    data: { isActive: boolean; updatedBy: string },
  ): Promise<Language> {
    const command = new UpdateLanguageActiveCommand(id, data);
    return await this.commandBus.execute(command);
  }

  /**
   * 언어 순서를 변경한다
   */
  async 언어_순서를_변경한다(
    id: string,
    data: { order: number; updatedBy: string },
  ): Promise<Language> {
    const command = new UpdateLanguageOrderCommand(id, data);
    return await this.commandBus.execute(command);
  }

  /**
   * 언어를 삭제한다
   */
  async 언어를_삭제한다(id: string): Promise<boolean> {
    const command = new DeleteLanguageCommand(id);
    return await this.commandBus.execute(command);
  }

  /**
   * 언어 목록을 조회한다
   */
  async 언어_목록을_조회한다(
    includeInactive: boolean = false,
  ): Promise<LanguageListResult> {
    const query = new GetLanguageListQuery(includeInactive);
    return await this.queryBus.execute(query);
  }

  /**
   * 기본 언어들을 추가한다
   */
  async 기본_언어들을_추가한다(createdBy?: string): Promise<Language[]> {
    const command = new InitializeDefaultLanguagesCommand(createdBy);
    return await this.commandBus.execute(command);
  }
}
