import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Language } from '@domain/common/language/language.entity';
import {
  CreateLanguageDto,
  CreateLanguageResult,
} from '../../interfaces/language-context.interface';
import { Logger, ConflictException } from '@nestjs/common';
import { TranslationSyncTriggerService } from '../../translation-sync-trigger.service';

/**
 * 언어 생성 커맨드
 */
export class CreateLanguageCommand {
  constructor(public readonly data: CreateLanguageDto) {}
}

/**
 * 언어 생성 핸들러
 */
@CommandHandler(CreateLanguageCommand)
export class CreateLanguageHandler implements ICommandHandler<CreateLanguageCommand> {
  private readonly logger = new Logger(CreateLanguageHandler.name);

  constructor(
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
    private readonly translationSyncService: TranslationSyncTriggerService,
  ) {}

  async execute(command: CreateLanguageCommand): Promise<CreateLanguageResult> {
    const { data } = command;

    this.logger.log(`언어 추가 시작 - 코드: ${data.code}, 이름: ${data.name}`);

    // 중복 체크
    const existing = await this.languageRepository.findOne({
      where: { code: data.code },
    });

    if (existing) {
      // 이미 존재하는 언어라면 오류
      throw new ConflictException(
        `이미 존재하는 언어 코드입니다: ${data.code}`,
      );
    }

    // 새 언어 생성 (새로 추가되는 언어는 기본 언어가 아님)
    const language = this.languageRepository.create({
      ...data,
      isActive: data.isActive ?? true, // 기본값 true 설정
      isDefault: false, // 새로 추가되는 언어는 기본 언어가 아님
    });
    const saved = await this.languageRepository.save(language);

    this.logger.log(`언어 생성 완료 - ID: ${saved.id}`);

    // 활성화된 언어로 추가된 경우 번역 동기화 트리거
    if (saved.isActive) {
      this.logger.log(
        `새 언어 추가로 인한 번역 동기화 트리거 - 언어 코드: ${saved.code}`,
      );
      // 비동기로 실행하여 응답 지연 방지
      this.translationSyncService
        .언어_활성화_시_번역_동기화(saved.code)
        .catch((error) => {
          this.logger.error(
            `번역 동기화 트리거 실패 - 언어: ${saved.code}`,
            error.stack || error.message,
          );
        });
    }

    return {
      id: saved.id,
      code: saved.code,
      name: saved.name,
      isActive: saved.isActive,
      isDefault: saved.isDefault,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
      createdBy: saved.createdBy,
      updatedBy: saved.updatedBy,
      deletedAt: saved.deletedAt,
    };
  }
}
