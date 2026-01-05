import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AnnouncementBusinessModule } from '@business/announcement';

// Command Handlers
import { CreateAnnouncementHandler } from './handlers/commands/create-announcement.handler';
import { UpdateAnnouncementHandler } from './handlers/commands/update-announcement.handler';
import { DeleteAnnouncementHandler } from './handlers/commands/delete-announcement.handler';
import { UpdateEmployeeResponseHandler } from './handlers/commands/update-employee-response.handler';
import { AddEmployeeHandler } from './handlers/commands/add-employee.handler';

// Query Handlers
import { GetAllAnnouncementsHandler } from './handlers/queries/get-all-announcements.handler';
import { GetAnnouncementHandler } from './handlers/queries/get-announcement.handler';
import { GetEmployeeResponsesHandler } from './handlers/queries/get-employee-responses.handler';

const CommandHandlers = [
  CreateAnnouncementHandler,
  UpdateAnnouncementHandler,
  DeleteAnnouncementHandler,
  UpdateEmployeeResponseHandler,
  AddEmployeeHandler,
];

const QueryHandlers = [
  GetAllAnnouncementsHandler,
  GetAnnouncementHandler,
  GetEmployeeResponsesHandler,
];

/**
 * 공지사항 Context Layer
 *
 * @description
 * - CQRS 패턴을 사용하여 Command와 Query를 분리합니다.
 * - 공지사항 및 직원 응답 관련 Command/Query를 처리합니다.
 */
@Module({
  imports: [CqrsModule, AnnouncementBusinessModule],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [CqrsModule],
})
export class AnnouncementContextModule {}
