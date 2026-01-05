import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { BrochureBusinessModule } from '@business/brochure';

import { CreateBrochureHandler } from './handlers/commands/create-brochure.handler';
import { UpdateBrochureHandler } from './handlers/commands/update-brochure.handler';
import { DeleteBrochureHandler } from './handlers/commands/delete-brochure.handler';
import { PublishBrochureHandler } from './handlers/commands/publish-brochure.handler';
import { UnpublishBrochureHandler } from './handlers/commands/unpublish-brochure.handler';
import { GetAllBrochuresHandler } from './handlers/queries/get-all-brochures.handler';
import { GetBrochureHandler } from './handlers/queries/get-brochure.handler';

const CommandHandlers = [
  CreateBrochureHandler,
  UpdateBrochureHandler,
  DeleteBrochureHandler,
  PublishBrochureHandler,
  UnpublishBrochureHandler,
];

const QueryHandlers = [GetAllBrochuresHandler, GetBrochureHandler];

@Module({
  imports: [CqrsModule, BrochureBusinessModule],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [CqrsModule],
})
export class BrochureContextModule {}
