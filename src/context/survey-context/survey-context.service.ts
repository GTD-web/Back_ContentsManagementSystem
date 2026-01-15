import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateSurveyCommand } from './handlers/commands/create-survey.handler';
import { UpdateSurveyCommand } from './handlers/commands/update-survey.handler';
import { DeleteSurveyCommand } from './handlers/commands/delete-survey.handler';
import { CompleteSurveyCommand } from './handlers/commands/complete-survey.handler';
import { GetSurveyDetailQuery } from './handlers/queries/get-survey-detail.handler';
import { GetSurveyByAnnouncementQuery } from './handlers/queries/get-survey-by-announcement.handler';
import { GetSurveyListQuery } from './handlers/queries/get-survey-list.handler';
import {
  CreateSurveyDto,
  CreateSurveyResult,
  UpdateSurveyDto,
  CompleteSurveyDto,
  SurveyListResult,
  SurveyDetailResult,
} from './interfaces/survey-context.interface';
import { Survey } from '@domain/sub/survey/survey.entity';
import { SurveyCompletion } from '@domain/sub/survey/survey-completion.entity';

/**
 * 설문조사 컨텍스트 서비스
 *
 * 설문조사 생성, 수정, 삭제 및 조회 비즈니스 로직을 담당합니다.
 */
@Injectable()
export class SurveyContextService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * 설문조사를 생성한다
   */
  async 설문조사를_생성한다(
    data: CreateSurveyDto,
  ): Promise<CreateSurveyResult> {
    const command = new CreateSurveyCommand(data);
    return await this.commandBus.execute(command);
  }

  /**
   * 설문조사를 수정한다
   */
  async 설문조사를_수정한다(
    id: string,
    data: UpdateSurveyDto,
  ): Promise<Survey> {
    const command = new UpdateSurveyCommand(id, data);
    return await this.commandBus.execute(command);
  }

  /**
   * 설문조사를 삭제한다
   */
  async 설문조사를_삭제한다(id: string): Promise<boolean> {
    const command = new DeleteSurveyCommand(id);
    return await this.commandBus.execute(command);
  }

  /**
   * 설문 완료를 기록한다
   */
  async 설문_완료를_기록한다(
    data: CompleteSurveyDto,
  ): Promise<SurveyCompletion> {
    const command = new CompleteSurveyCommand(data);
    return await this.commandBus.execute(command);
  }

  /**
   * 설문조사 목록을 조회한다
   */
  async 설문조사_목록을_조회한다(params: {
    page?: number;
    limit?: number;
  }): Promise<SurveyListResult> {
    const query = new GetSurveyListQuery(
      params.page || 1,
      params.limit || 10,
    );
    return await this.queryBus.execute(query);
  }

  /**
   * 설문조사를 조회한다
   */
  async 설문조사를_조회한다(id: string): Promise<SurveyDetailResult> {
    const query = new GetSurveyDetailQuery(id);
    return await this.queryBus.execute(query);
  }

  /**
   * 공지사항의 설문조사를 조회한다
   */
  async 공지사항의_설문조사를_조회한다(
    announcementId: string,
  ): Promise<Survey | null> {
    const query = new GetSurveyByAnnouncementQuery(announcementId);
    return await this.queryBus.execute(query);
  }
}
