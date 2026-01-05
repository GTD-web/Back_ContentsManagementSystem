import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EducationManagementBusinessModule } from '@business/education-management';

import { CreateEducationHandler } from './handlers/commands/create-education.handler';
import { UpdateEducationHandler } from './handlers/commands/update-education.handler';
import { DeleteEducationHandler } from './handlers/commands/delete-education.handler';
import { AddAttendeeHandler } from './handlers/commands/add-attendee.handler';
import { UpdateAttendeeStatusHandler } from './handlers/commands/update-attendee-status.handler';
import { GetAllEducationsHandler } from './handlers/queries/get-all-educations.handler';
import { GetEducationHandler } from './handlers/queries/get-education.handler';
import { GetAttendeesHandler } from './handlers/queries/get-attendees.handler';

const CommandHandlers = [
  CreateEducationHandler,
  UpdateEducationHandler,
  DeleteEducationHandler,
  AddAttendeeHandler,
  UpdateAttendeeStatusHandler,
];

const QueryHandlers = [
  GetAllEducationsHandler,
  GetEducationHandler,
  GetAttendeesHandler,
];

@Module({
  imports: [CqrsModule, EducationManagementBusinessModule],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [CqrsModule],
})
export class EducationManagementContextModule {}
