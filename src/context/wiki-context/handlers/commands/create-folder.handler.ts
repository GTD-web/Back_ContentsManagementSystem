import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
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

    // parentId가 null이거나 없으면 루트 폴더 ID로 자동 설정
    let parentId = data.parentId;
    if (!parentId) {
      const rootFolder = await this.wikiFileSystemService.루트_폴더를_조회하거나_생성한다();
      parentId = rootFolder.id;
      this.logger.log(`parentId가 없어 루트 폴더로 설정됨 - 루트 ID: ${parentId}`);
    }

    const folder = await this.wikiFileSystemService.폴더를_생성한다({
      ...data,
      parentId,
    });

    return {
      id: folder.id,
      name: folder.name,
      type: folder.type,
    };
  }
}
