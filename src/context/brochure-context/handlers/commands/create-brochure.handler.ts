import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brochure } from '@domain/core/brochure/brochure.entity';
import { BrochureTranslation } from '@domain/core/brochure/brochure-translation.entity';
import { Language } from '@domain/common/language/language.entity';
import { ContentStatus } from '@domain/core/content-status.types';
import {
  CreateBrochureDto,
  CreateBrochureResult,
} from '../../interfaces/brochure-context.interface';
import { Logger, BadRequestException } from '@nestjs/common';

/**
 * 브로슈어 생성 커맨드
 */
export class CreateBrochureCommand {
  constructor(public readonly data: CreateBrochureDto) {}
}

/**
 * 브로슈어 생성 핸들러
 */
@CommandHandler(CreateBrochureCommand)
export class CreateBrochureHandler implements ICommandHandler<CreateBrochureCommand> {
  private readonly logger = new Logger(CreateBrochureHandler.name);

  constructor(
    @InjectRepository(Brochure)
    private readonly brochureRepository: Repository<Brochure>,
    @InjectRepository(BrochureTranslation)
    private readonly brochureTranslationRepository: Repository<BrochureTranslation>,
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
  ) {}

  async execute(command: CreateBrochureCommand): Promise<CreateBrochureResult> {
    const { data } = command;

    this.logger.log(
      `브로슈어 생성 시작 - 번역 수: ${data.translations.length}`,
    );

    // 모든 언어 ID 검증
    const languageIds = data.translations.map((t) => t.languageId);
    const languages = await this.languageRepository.find({
      where: languageIds.map((id) => ({ id })),
    });

    if (languages.length !== languageIds.length) {
      const foundIds = languages.map((l) => l.id);
      const missingIds = languageIds.filter((id) => !foundIds.includes(id));
      throw new BadRequestException(
        `존재하지 않는 언어 ID입니다: ${missingIds.join(', ')}`,
      );
    }

    // 중복 언어 체크
    const uniqueLanguageIds = new Set(languageIds);
    if (uniqueLanguageIds.size !== languageIds.length) {
      throw new BadRequestException('중복된 언어 ID가 있습니다.');
    }

    // 모든 활성 언어 조회 (동기화용)
    const allLanguages = await this.languageRepository.find({
      where: { isActive: true },
    });

    // 자동으로 order 계산 (최대 order + 1)
    const maxOrderBrochures = await this.brochureRepository.find({
      order: { order: 'DESC' },
      select: ['order'],
      take: 1,
    });
    const nextOrder =
      maxOrderBrochures.length > 0 ? maxOrderBrochures[0].order + 1 : 0;

    // 브로슈어 생성 (기본값: 비공개, DRAFT 상태)
    const brochure = this.brochureRepository.create({
      isPublic: false, // 기본값: 비공개
      status: ContentStatus.DRAFT, // 기본값: DRAFT
      order: nextOrder, // 자동 계산
      attachments: data.attachments || null,
      createdBy: data.createdBy,
      updatedBy: data.createdBy, // 생성 시점이므로 createdBy와 동일
    });

    const saved = await this.brochureRepository.save(brochure);

    // 전달받은 언어들에 대한 번역 생성 (isSynced: false, 개별 설정됨)
    const customTranslations = data.translations.map((trans) =>
      this.brochureTranslationRepository.create({
        brochureId: saved.id,
        languageId: trans.languageId,
        title: trans.title,
        description: trans.description || null,
        isSynced: false, // 개별 설정되었으므로 동기화 비활성화
        createdBy: data.createdBy,
        updatedBy: data.createdBy,
      }),
    );

    await this.brochureTranslationRepository.save(customTranslations);

    // 첫 번째 번역 찾기 (한국어 우선, 없으면 첫 번째)
    const koreanLang = languages.find((l) => l.code === 'ko');
    const baseTranslation =
      data.translations.find((t) => t.languageId === koreanLang?.id) ||
      data.translations[0];

    // 전달되지 않은 나머지 활성 언어들에 대한 번역 생성 (isSynced: true, 자동 동기화)
    const remainingLanguages = allLanguages.filter(
      (lang) => !languageIds.includes(lang.id),
    );

    if (remainingLanguages.length > 0) {
      const syncedTranslations = remainingLanguages.map((lang) =>
        this.brochureTranslationRepository.create({
          brochureId: saved.id,
          languageId: lang.id,
          title: baseTranslation.title, // 기준 번역의 제목 사용
          description: baseTranslation.description || null,
          isSynced: true, // 자동 동기화 활성화
          createdBy: data.createdBy,
          updatedBy: data.createdBy,
        }),
      );

      await this.brochureTranslationRepository.save(syncedTranslations);
    }

    const totalTranslations =
      customTranslations.length + remainingLanguages.length;

    this.logger.log(
      `브로슈어 생성 완료 - ID: ${saved.id}, Order: ${saved.order}, 전체 번역 수: ${totalTranslations} (개별 설정: ${customTranslations.length}, 자동 동기화: ${remainingLanguages.length})`,
    );

    return {
      id: saved.id,
      isPublic: saved.isPublic,
      status: saved.status,
      order: saved.order,
      createdAt: saved.createdAt,
    };
  }
}
