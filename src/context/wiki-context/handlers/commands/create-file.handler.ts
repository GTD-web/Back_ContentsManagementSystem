import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { WikiFileSystemService } from '@domain/sub/wiki-file-system/wiki-file-system.service';
import { CreateFileDto, CreateWikiResult } from '../../interfaces/wiki-context.interface';

export class CreateFileCommand {
  constructor(public readonly data: CreateFileDto) {}
}

@CommandHandler(CreateFileCommand)
export class CreateFileHandler
  implements ICommandHandler<CreateFileCommand, CreateWikiResult>
{
  private readonly logger = new Logger(CreateFileHandler.name);

  constructor(
    private readonly wikiFileSystemService: WikiFileSystemService,
  ) {}

  async execute(command: CreateFileCommand): Promise<CreateWikiResult> {
    const { data } = command;

    this.logger.log(`파일 생성 커맨드 실행 - 이름: ${data.name}`);

    // parentId가 null이거나 없으면 루트 폴더 ID로 자동 설정
    let parentId = data.parentId;
    if (!parentId) {
      const rootFolder = await this.wikiFileSystemService.루트_폴더를_조회하거나_생성한다();
      parentId = rootFolder.id;
      this.logger.log(`parentId가 없어 루트 폴더로 설정됨 - 루트 ID: ${parentId}`);
    }

    const file = await this.wikiFileSystemService.파일을_생성한다({
      ...data,
      parentId,
    });

    return {
      id: file.id,
      name: file.name,
      type: file.type,
    };
  }
}
