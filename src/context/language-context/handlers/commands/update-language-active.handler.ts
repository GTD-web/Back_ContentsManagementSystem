import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Language } from '@domain/common/language/language.entity';
import { Logger, NotFoundException, BadRequestException } from '@nestjs/common';

/**
 * 언어 활성 상태 수정 커맨드
 */
export class UpdateLanguageActiveCommand {
  constructor(
    public readonly id: string,
    public readonly data: { isActive: boolean; updatedBy: string },
  ) {}
}

/**
 * 언어 활성 상태 수정 핸들러
 */
@CommandHandler(UpdateLanguageActiveCommand)
export class UpdateLanguageActiveHandler
  implements ICommandHandler<UpdateLanguageActiveCommand>
{
  private readonly logger = new Logger(UpdateLanguageActiveHandler.name);

  constructor(
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
    private readonly configService: ConfigService,
  ) {}

  async execute(command: UpdateLanguageActiveCommand): Promise<Language> {
    const { id, data } = command;

    this.logger.log(`언어 활성 상태 수정 시작 - ID: ${id}, 활성: ${data.isActive}`);

    // 언어 조회 (등록된 언어만 활성 상태 수정 가능)
    const language = await this.languageRepository.findOne({
      where: { id },
    });

    if (!language) {
      throw new NotFoundException(`언어를 찾을 수 없습니다. ID: ${id}`);
    }

    // 비활성화하려는 경우 기본 언어 체크
    if (!data.isActive) {
      const defaultLanguageCode = this.configService.get<string>(
        'DEFAULT_LANGUAGE_CODE',
        'en',
      );
      if (language.code === defaultLanguageCode) {
        this.logger.warn(
          `기본 언어 비활성화 시도 차단 - ${language.name} (${language.code})`,
        );
        throw new BadRequestException(
          `기본 언어(${language.name})는 비활성화할 수 없습니다. 시스템 운영에 필수적인 언어입니다.`,
        );
      }
    }

    // 활성 상태 변경
    language.isActive = data.isActive;
    language.updatedBy = data.updatedBy;
    const updated = await this.languageRepository.save(language);

    this.logger.log(
      `언어 활성 상태 수정 완료 - ID: ${id}, 이름: ${language.name}, 활성: ${data.isActive}`,
    );

    return updated;
  }
}
