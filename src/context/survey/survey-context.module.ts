import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SurveyBusinessModule } from '@business/survey';

import { CreateSurveyHandler } from './handlers/commands/create-survey.handler';
import { UpdateSurveyHandler } from './handlers/commands/update-survey.handler';
import { DeleteSurveyHandler } from './handlers/commands/delete-survey.handler';
import { PublishSurveyHandler } from './handlers/commands/publish-survey.handler';
import { UnpublishSurveyHandler } from './handlers/commands/unpublish-survey.handler';
import { AddInqueryHandler } from './handlers/commands/add-inquery.handler';
import { RemoveInqueryHandler } from './handlers/commands/remove-inquery.handler';
import { GetAllSurveysHandler } from './handlers/queries/get-all-surveys.handler';
import { GetSurveyHandler } from './handlers/queries/get-survey.handler';

const CommandHandlers = [
  CreateSurveyHandler,
  UpdateSurveyHandler,
  DeleteSurveyHandler,
  PublishSurveyHandler,
  UnpublishSurveyHandler,
  AddInqueryHandler,
  RemoveInqueryHandler,
];

const QueryHandlers = [GetAllSurveysHandler, GetSurveyHandler];

@Module({
  imports: [CqrsModule, SurveyBusinessModule],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [CqrsModule],
})
export class SurveyContextModule {}
