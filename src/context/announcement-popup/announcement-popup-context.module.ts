import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AnnouncementPopupBusinessModule } from '@business/announcement-popup';

import { CreateAnnouncementPopupHandler } from './handlers/commands/create-announcement-popup.handler';
import { UpdateAnnouncementPopupHandler } from './handlers/commands/update-announcement-popup.handler';
import { DeleteAnnouncementPopupHandler } from './handlers/commands/delete-announcement-popup.handler';
import { PublishAnnouncementPopupHandler } from './handlers/commands/publish-announcement-popup.handler';
import { UnpublishAnnouncementPopupHandler } from './handlers/commands/unpublish-announcement-popup.handler';
import { GetAllAnnouncementPopupsHandler } from './handlers/queries/get-all-announcement-popups.handler';
import { GetAnnouncementPopupHandler } from './handlers/queries/get-announcement-popup.handler';

const CommandHandlers = [
  CreateAnnouncementPopupHandler,
  UpdateAnnouncementPopupHandler,
  DeleteAnnouncementPopupHandler,
  PublishAnnouncementPopupHandler,
  UnpublishAnnouncementPopupHandler,
];

const QueryHandlers = [
  GetAllAnnouncementPopupsHandler,
  GetAnnouncementPopupHandler,
];

@Module({
  imports: [CqrsModule, AnnouncementPopupBusinessModule],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [CqrsModule],
})
export class AnnouncementPopupContextModule {}
