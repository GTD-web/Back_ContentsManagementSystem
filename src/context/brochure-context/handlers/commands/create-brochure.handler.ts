import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brochure } from '@domain/core/brochure/brochure.entity';
import { BrochureTranslation } from '@domain/core/brochure/brochure-translation.entity';
import { Language } from '@domain/common/language/language.entity';
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

    this.logger.log(`브로슈어 생성 시작`);

    // 번역의 languageId 검증
    if (data.translations && data.translations.length > 0) {
      const languageIds = data.translations.map((trans) => trans.languageId);
      const uniqueLanguageIds = [...new Set(languageIds)];

      const existingLanguages = await this.languageRepository.find({
        where: uniqueLanguageIds.map((id) => ({ id })),
      });

      const existingLanguageIds = new Set(
        existingLanguages.map((lang) => lang.id),
      );
      const missingLanguageIds = uniqueLanguageIds.filter(
        (id) => !existingLanguageIds.has(id),
      );

      if (missingLanguageIds.length > 0) {
        throw new BadRequestException(
          `존재하지 않는 언어 ID입니다: ${missingLanguageIds.join(', ')}`,
        );
      }
    }

    // 브로슈어 생성
    const brochure = this.brochureRepository.create({
      isPublic: data.isPublic,
      status: data.status,
      order: data.order,
      attachments: data.attachments || null,
      createdBy: data.createdBy,
    });

    const saved = await this.brochureRepository.save(brochure);

    // 번역 생성
    if (data.translations && data.translations.length > 0) {
      const translations = data.translations.map((trans) =>
        this.brochureTranslationRepository.create({
          brochureId: saved.id,
          languageId: trans.languageId,
          title: trans.title,
          description: trans.description,
          createdBy: data.createdBy,
        }),
      );

      await this.brochureTranslationRepository.save(translations);
    }

    this.logger.log(`브로슈어 생성 완료 - ID: ${saved.id}`);

    return {
      id: saved.id,
      isPublic: saved.isPublic,
      status: saved.status,
      order: saved.order,
      createdAt: saved.createdAt,
    };
  }
}
