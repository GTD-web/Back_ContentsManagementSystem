import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ElectronicNoticeBusinessModule } from '@business/electronic-notice';

import { CreateElectronicNoticeHandler } from './handlers/commands/create-electronic-notice.handler';
import { UpdateElectronicNoticeHandler } from './handlers/commands/update-electronic-notice.handler';
import { DeleteElectronicNoticeHandler } from './handlers/commands/delete-electronic-notice.handler';
import { PublishElectronicNoticeHandler } from './handlers/commands/publish-electronic-notice.handler';
import { UnpublishElectronicNoticeHandler } from './handlers/commands/unpublish-electronic-notice.handler';
import { GetAllElectronicNoticesHandler } from './handlers/queries/get-all-electronic-notices.handler';
import { GetElectronicNoticeHandler } from './handlers/queries/get-electronic-notice.handler';

const CommandHandlers = [
  CreateElectronicNoticeHandler,
  UpdateElectronicNoticeHandler,
  DeleteElectronicNoticeHandler,
  PublishElectronicNoticeHandler,
  UnpublishElectronicNoticeHandler,
];

const QueryHandlers = [
  GetAllElectronicNoticesHandler,
  GetElectronicNoticeHandler,
];

@Module({
  imports: [CqrsModule, ElectronicNoticeBusinessModule],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [CqrsModule],
})
export class ElectronicNoticeContextModule {}
