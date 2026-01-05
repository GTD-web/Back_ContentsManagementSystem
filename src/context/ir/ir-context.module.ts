import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { IRBusinessModule } from '@business/ir';

import { CreateIRHandler } from './handlers/commands/create-ir.handler';
import { UpdateIRHandler } from './handlers/commands/update-ir.handler';
import { DeleteIRHandler } from './handlers/commands/delete-ir.handler';
import { PublishIRHandler } from './handlers/commands/publish-ir.handler';
import { UnpublishIRHandler } from './handlers/commands/unpublish-ir.handler';
import { GetAllIRHandler } from './handlers/queries/get-all-ir.handler';
import { GetIRHandler } from './handlers/queries/get-ir.handler';

const CommandHandlers = [
  CreateIRHandler,
  UpdateIRHandler,
  DeleteIRHandler,
  PublishIRHandler,
  UnpublishIRHandler,
];

const QueryHandlers = [GetAllIRHandler, GetIRHandler];

@Module({
  imports: [CqrsModule, IRBusinessModule],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [CqrsModule],
})
export class IRContextModule {}
