// Commands
export * from './commands/create-survey.handler';
export * from './commands/update-survey.handler';
export * from './commands/delete-survey.handler';
export * from './commands/complete-survey.handler';

// Queries
export * from './queries/get-survey-detail.handler';
export * from './queries/get-survey-by-announcement.handler';
export * from './queries/get-survey-list.handler';

// Command Handlers
import { CreateSurveyHandler } from './commands/create-survey.handler';
import { UpdateSurveyHandler } from './commands/update-survey.handler';
import { DeleteSurveyHandler } from './commands/delete-survey.handler';
import { CompleteSurveyHandler } from './commands/complete-survey.handler';

// Query Handlers
import { GetSurveyDetailHandler } from './queries/get-survey-detail.handler';
import { GetSurveyByAnnouncementHandler } from './queries/get-survey-by-announcement.handler';
import { GetSurveyListHandler } from './queries/get-survey-list.handler';

export const SurveyCommandHandlers = [
  CreateSurveyHandler,
  UpdateSurveyHandler,
  DeleteSurveyHandler,
  CompleteSurveyHandler,
];

export const SurveyQueryHandlers = [
  GetSurveyDetailHandler,
  GetSurveyByAnnouncementHandler,
  GetSurveyListHandler,
];

export const SurveyHandlers = [
  ...SurveyCommandHandlers,
  ...SurveyQueryHandlers,
];
