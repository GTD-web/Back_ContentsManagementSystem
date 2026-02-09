import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger, BadRequestException } from '@nestjs/common';
import { WikiFileSystemService } from '@domain/sub/wiki-file-system/wiki-file-system.service';
import { CreateFolderDto, CreateWikiResult } from '../../interfaces/wiki-context.interface';

export class CreateFolderCommand {
  constructor(public readonly data: CreateFolderDto) {}
}

@CommandHandler(CreateFolderCommand)
export class CreateFolderHandler
  implements ICommandHandler<CreateFolderCommand, CreateWikiResult>
{
  private readonly logger = new Logger(CreateFolderHandler.name);

  constructor(
    private readonly wikiFileSystemService: WikiFileSystemService,
  ) {}

  async execute(command: CreateFolderCommand): Promise<CreateWikiResult> {
    const { data } = command;

    this.logger.log(`폴더 생성 커맨드 실행 - 이름: ${data.name}`);

    // parentId가 null인 경우 (루트 레벨 폴더 생성 시도) 검증
    if (!data.parentId || data.parentId === null) {
      throw new BadRequestException(
        'parentId는 필수입니다. 루트 폴더는 시스템에 의해 자동으로 생성됩니다.'
      );
    }

    const folder = await this.wikiFileSystemService.폴더를_생성한다(data);

    return {
      id: folder.id,
      name: folder.name,
      type: folder.type,
    };
  }
}
