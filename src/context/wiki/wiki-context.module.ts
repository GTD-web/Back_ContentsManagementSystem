import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { WikiBusinessModule } from '@business/wiki';

import { CreateWikiHandler } from './handlers/commands/create-wiki.handler';
import { UpdateWikiHandler } from './handlers/commands/update-wiki.handler';
import { DeleteWikiHandler } from './handlers/commands/delete-wiki.handler';
import { GetAllWikisHandler } from './handlers/queries/get-all-wikis.handler';
import { GetWikiHandler } from './handlers/queries/get-wiki.handler';

const CommandHandlers = [
  CreateWikiHandler,
  UpdateWikiHandler,
  DeleteWikiHandler,
];

const QueryHandlers = [GetAllWikisHandler, GetWikiHandler];

@Module({
  imports: [CqrsModule, WikiBusinessModule],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [CqrsModule],
})
export class WikiContextModule {}
