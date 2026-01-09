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
      `브로슈어 생성 시작 - 언어 ID: ${data.languageId}, 제목: ${data.title}`,
    );

    // languageId 검증
    const language = await this.languageRepository.findOne({
      where: { id: data.languageId },
    });

    if (!language) {
      throw new BadRequestException(
        `존재하지 않는 언어 ID입니다: ${data.languageId}`,
      );
    }

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

    // 번역 생성 (제목, 설명 포함)
    const translation = this.brochureTranslationRepository.create({
      brochureId: saved.id,
      languageId: data.languageId,
      title: data.title,
      description: data.description || null,
      createdBy: data.createdBy,
      updatedBy: data.createdBy, // 생성 시점이므로 createdBy와 동일
    });

    await this.brochureTranslationRepository.save(translation);

    this.logger.log(
      `브로슈어 생성 완료 - ID: ${saved.id}, Order: ${saved.order}, Language: ${language.code}, Title: ${data.title}`,
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
