import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ShareholdersMeetingBusinessModule } from '@business/shareholders-meeting';

import { CreateShareholdersMeetingHandler } from './handlers/commands/create-shareholders-meeting.handler';
import { UpdateShareholdersMeetingHandler } from './handlers/commands/update-shareholders-meeting.handler';
import { DeleteShareholdersMeetingHandler } from './handlers/commands/delete-shareholders-meeting.handler';
import { GetAllShareholdersMeetingsHandler } from './handlers/queries/get-all-shareholders-meetings.handler';
import { GetShareholdersMeetingHandler } from './handlers/queries/get-shareholders-meeting.handler';

const CommandHandlers = [
  CreateShareholdersMeetingHandler,
  UpdateShareholdersMeetingHandler,
  DeleteShareholdersMeetingHandler,
];

const QueryHandlers = [
  GetAllShareholdersMeetingsHandler,
  GetShareholdersMeetingHandler,
];

@Module({
  imports: [CqrsModule, ShareholdersMeetingBusinessModule],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [CqrsModule],
})
export class ShareholdersMeetingContextModule {}
