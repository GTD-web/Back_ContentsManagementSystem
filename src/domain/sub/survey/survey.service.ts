import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Survey } from './survey.entity';
import { SurveyQuestion } from './survey-question.entity';
import { SurveyCompletion } from './survey-completion.entity';
import { SurveyResponseText } from './responses/survey-response-text.entity';
import { SurveyResponseChoice } from './responses/survey-response-choice.entity';
import { SurveyResponseCheckbox } from './responses/survey-response-checkbox.entity';
import { SurveyResponseScale } from './responses/survey-response-scale.entity';
import { SurveyResponseGrid } from './responses/survey-response-grid.entity';
import { SurveyResponseFile } from './responses/survey-response-file.entity';
import { SurveyResponseDatetime } from './responses/survey-response-datetime.entity';

/**
 * 설문조사 서비스
 * 설문조사 관리 비즈니스 로직을 처리합니다.
 */
@Injectable()
export class SurveyService {
  private readonly logger = new Logger(SurveyService.name);

  constructor(
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,
    @InjectRepository(SurveyQuestion)
    private readonly questionRepository: Repository<SurveyQuestion>,
    @InjectRepository(SurveyCompletion)
    private readonly completionRepository: Repository<SurveyCompletion>,
    @InjectRepository(SurveyResponseText)
    private readonly textResponseRepository: Repository<SurveyResponseText>,
    @InjectRepository(SurveyResponseChoice)
    private readonly choiceResponseRepository: Repository<SurveyResponseChoice>,
    @InjectRepository(SurveyResponseCheckbox)
    private readonly checkboxResponseRepository: Repository<SurveyResponseCheckbox>,
    @InjectRepository(SurveyResponseScale)
    private readonly scaleResponseRepository: Repository<SurveyResponseScale>,
    @InjectRepository(SurveyResponseGrid)
    private readonly gridResponseRepository: Repository<SurveyResponseGrid>,
    @InjectRepository(SurveyResponseFile)
    private readonly fileResponseRepository: Repository<SurveyResponseFile>,
    @InjectRepository(SurveyResponseDatetime)
    private readonly datetimeResponseRepository: Repository<SurveyResponseDatetime>,
  ) {}

  /**
   * 설문조사를 생성한다
   */
  async 설문조사를_생성한다(data: {
    announcementId: string;
    title: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    order?: number;
    questions?: Array<{
      title: string;
      type: any;
      form?: any;
      isRequired: boolean;
      order: number;
    }>;
  }): Promise<Survey> {
    this.logger.log(`설문조사 생성 시작 - 공지사항 ID: ${data.announcementId}`);

    // 트랜잭션으로 설문조사와 질문을 함께 생성
    const queryRunner =
      this.surveyRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. 설문조사 생성
      const survey = queryRunner.manager.create(Survey, {
        announcementId: data.announcementId,
        title: data.title,
        description: data.description || null,
        startDate: data.startDate || null,
        endDate: data.endDate || null,
        order: data.order || 0,
      });

      const savedSurvey = await queryRunner.manager.save(Survey, survey);

      // 2. 질문 생성 (있는 경우)
      if (data.questions && data.questions.length > 0) {
        const questions = data.questions.map((q) =>
          queryRunner.manager.create(SurveyQuestion, {
            surveyId: savedSurvey.id,
            title: q.title,
            type: q.type,
            form: q.form || null,
            isRequired: q.isRequired,
            order: q.order,
          }),
        );

        await queryRunner.manager.save(SurveyQuestion, questions);
      }

      await queryRunner.commitTransaction();

      this.logger.log(`설문조사 생성 완료 - ID: ${savedSurvey.id}`);

      // 질문을 포함하여 반환
      return await this.ID로_설문조사를_조회한다(savedSurvey.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `설문조사 생성 실패: ${error.message}`,
        error.stack,
      );
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * ID로 설문조사를 조회한다 (질문 포함)
   */
  async ID로_설문조사를_조회한다(id: string): Promise<Survey> {
    this.logger.debug(`설문조사 조회 - ID: ${id}`);

    const survey = await this.surveyRepository.findOne({
      where: { id },
      relations: ['questions'],
      order: {
        questions: {
          order: 'ASC',
        },
      },
    });

    if (!survey) {
      throw new NotFoundException(`설문조사를 찾을 수 없습니다. ID: ${id}`);
    }

    return survey;
  }

  /**
   * 공지사항 ID로 설문조사를 조회한다
   */
  async 공지사항ID로_설문조사를_조회한다(
    announcementId: string,
  ): Promise<Survey | null> {
    this.logger.debug(
      `공지사항의 설문조사 조회 - 공지사항 ID: ${announcementId}`,
    );

    const survey = await this.surveyRepository.findOne({
      where: { announcementId },
      relations: ['questions'],
      order: {
        questions: {
          order: 'ASC',
        },
      },
    });

    return survey;
  }

  /**
   * 설문조사를 업데이트한다
   */
  async 설문조사를_업데이트한다(
    id: string,
    data: {
      title?: string;
      description?: string;
      startDate?: Date;
      endDate?: Date;
      order?: number;
      questions?: Array<{
        id?: string; // 기존 질문 ID (수정용)
        title: string;
        type: any;
        form?: any;
        isRequired: boolean;
        order: number;
      }>;
    },
  ): Promise<Survey> {
    this.logger.log(`설문조사 업데이트 시작 - ID: ${id}`);

    const queryRunner =
      this.surveyRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. 설문조사 기본 정보 업데이트
      const survey = await queryRunner.manager.findOne(Survey, {
        where: { id },
      });

      if (!survey) {
        throw new NotFoundException(`설문조사를 찾을 수 없습니다. ID: ${id}`);
      }

      if (data.title !== undefined) survey.title = data.title;
      if (data.description !== undefined)
        survey.description = data.description;
      if (data.startDate !== undefined) survey.startDate = data.startDate;
      if (data.endDate !== undefined) survey.endDate = data.endDate;
      if (data.order !== undefined) survey.order = data.order;

      await queryRunner.manager.save(Survey, survey);

      // 2. 질문 업데이트 (있는 경우)
      if (data.questions !== undefined) {
        // 기존 질문 모두 삭제
        await queryRunner.manager.delete(SurveyQuestion, { surveyId: id });

        // 새로운 질문 생성
        if (data.questions.length > 0) {
          const questions = data.questions.map((q) =>
            queryRunner.manager.create(SurveyQuestion, {
              surveyId: id,
              title: q.title,
              type: q.type,
              form: q.form || null,
              isRequired: q.isRequired,
              order: q.order,
            }),
          );

          await queryRunner.manager.save(SurveyQuestion, questions);
        }
      }

      await queryRunner.commitTransaction();

      this.logger.log(`설문조사 업데이트 완료 - ID: ${id}`);

      return await this.ID로_설문조사를_조회한다(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `설문조사 업데이트 실패: ${error.message}`,
        error.stack,
      );
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 설문조사를 삭제한다
   */
  async 설문조사를_삭제한다(id: string): Promise<boolean> {
    this.logger.log(`설문조사 삭제 시작 - ID: ${id}`);

    const survey = await this.ID로_설문조사를_조회한다(id);

    // CASCADE 설정으로 질문과 응답도 함께 삭제됨
    await this.surveyRepository.softRemove(survey);

    this.logger.log(`설문조사 삭제 완료 - ID: ${id}`);
    return true;
  }

  /**
   * 설문 완료를 기록한다
   */
  async 설문_완료를_기록한다(
    surveyId: string,
    employeeId: string,
    employeeNumber: string,
  ): Promise<SurveyCompletion> {
    this.logger.log(
      `설문 완료 기록 - 설문 ID: ${surveyId}, 직원 사번: ${employeeNumber}`,
    );

    // 설문조사 존재 확인
    const survey = await this.ID로_설문조사를_조회한다(surveyId);
    const totalQuestions = survey.questions?.length || 0;

    // 이미 완료 기록이 있는지 확인
    let completion = await this.completionRepository.findOne({
      where: { surveyId, employeeNumber },
    });

    if (completion) {
      // 이미 있으면 완료 상태 업데이트
      completion.totalQuestions = totalQuestions;
      completion.answeredQuestions = totalQuestions;
      completion.isCompleted = true;
      completion.completedAt = new Date();
      return await this.completionRepository.save(completion);
    }

    // 없으면 새로 생성
    completion = this.completionRepository.create({
      surveyId,
      employeeId,
      employeeNumber,
      totalQuestions,
      answeredQuestions: totalQuestions,
      isCompleted: true,
      completedAt: new Date(),
    });

    return await this.completionRepository.save(completion);
  }

  /**
   * 설문 완료 여부를 확인한다
   */
  async 설문_완료_여부를_확인한다(
    surveyId: string,
    employeeNumber: string,
  ): Promise<boolean> {
    const completion = await this.completionRepository.findOne({
      where: { surveyId, employeeNumber, isCompleted: true },
    });

    return !!completion;
  }

  /**
   * 설문 완료자 수를 조회한다
   */
  async 설문_완료자_수를_조회한다(surveyId: string): Promise<number> {
    return await this.completionRepository.count({
      where: { surveyId, isCompleted: true },
    });
  }

  /**
   * 설문 미완료자 사번 목록을 조회한다
   */
  async 설문_미완료자를_조회한다(
    surveyId: string,
    targetEmployeeNumbers: string[],
  ): Promise<string[]> {
    const completions = await this.completionRepository.find({
      where: { surveyId, isCompleted: true },
    });

    const completedNumbers = new Set(completions.map((c) => c.employeeNumber));
    return targetEmployeeNumbers.filter((num) => !completedNumbers.has(num));
  }

  /**
   * 모든 설문조사를 조회한다
   */
  async 모든_설문조사를_조회한다(): Promise<Survey[]> {
    this.logger.debug('설문조사 목록 조회');

    return await this.surveyRepository.find({
      relations: ['questions'],
      order: {
        order: 'DESC',
        createdAt: 'DESC',
      },
    });
  }

  /**
   * 사용자의 설문 응답을 조회한다
   */
  async 사용자의_설문_응답을_조회한다(
    surveyId: string,
    employeeNumber: string,
  ): Promise<{
    textAnswers: Array<{ questionId: string; textValue: string }>;
    choiceAnswers: Array<{ questionId: string; selectedOption: string }>;
    checkboxAnswers: Array<{ questionId: string; selectedOptions: string[] }>;
    scaleAnswers: Array<{ questionId: string; scaleValue: number }>;
    gridAnswers: Array<{
      questionId: string;
      gridAnswers: Array<{ rowName: string; columnValue: string }>;
    }>;
    fileAnswers: Array<{
      questionId: string;
      files: Array<{
        fileUrl: string;
        fileName: string;
        fileSize: number;
        mimeType: string;
      }>;
    }>;
    datetimeAnswers: Array<{ questionId: string; datetimeValue: string }>;
  } | null> {
    this.logger.log(
      `사용자 설문 응답 조회 - 설문 ID: ${surveyId}, 직원 사번: ${employeeNumber}`,
    );

    // 설문 완료 여부 확인
    const completion = await this.completionRepository.findOne({
      where: { surveyId, employeeNumber },
    });
    if (!completion || completion.answeredQuestions === 0) {
      return null;
    }

    // 설문의 질문 ID 목록 조회
    const survey = await this.ID로_설문조사를_조회한다(surveyId);
    const questionIds = survey.questions?.map((q) => q.id) || [];

    if (questionIds.length === 0) {
      return {
        textAnswers: [],
        choiceAnswers: [],
        checkboxAnswers: [],
        scaleAnswers: [],
        gridAnswers: [],
        fileAnswers: [],
        datetimeAnswers: [],
      };
    }

    // 1. 텍스트 응답
    const textResponses = await this.textResponseRepository
      .createQueryBuilder('response')
      .where('response.employeeId = :employeeNumber', { employeeNumber })
      .andWhere('response.questionId IN (:...questionIds)', { questionIds })
      .getMany();
    const textAnswers = textResponses.map((r) => ({
      questionId: r.questionId,
      textValue: r.textValue,
    }));

    // 2. 선택형 응답
    const choiceResponses = await this.choiceResponseRepository
      .createQueryBuilder('response')
      .where('response.employeeId = :employeeNumber', { employeeNumber })
      .andWhere('response.questionId IN (:...questionIds)', { questionIds })
      .getMany();
    const choiceAnswers = choiceResponses.map((r) => ({
      questionId: r.questionId,
      selectedOption: r.selectedOption,
    }));

    // 3. 체크박스 응답
    const checkboxResponses = await this.checkboxResponseRepository
      .createQueryBuilder('response')
      .where('response.employeeId = :employeeNumber', { employeeNumber })
      .andWhere('response.questionId IN (:...questionIds)', { questionIds })
      .getMany();
    const checkboxMap = new Map<string, string[]>();
    checkboxResponses.forEach((r) => {
      const options = checkboxMap.get(r.questionId) || [];
      options.push(r.selectedOption);
      checkboxMap.set(r.questionId, options);
    });
    const checkboxAnswers = Array.from(checkboxMap.entries()).map(
      ([questionId, selectedOptions]) => ({
        questionId,
        selectedOptions,
      }),
    );

    // 4. 척도 응답
    const scaleResponses = await this.scaleResponseRepository
      .createQueryBuilder('response')
      .where('response.employeeId = :employeeNumber', { employeeNumber })
      .andWhere('response.questionId IN (:...questionIds)', { questionIds })
      .getMany();
    const scaleAnswers = scaleResponses.map((r) => ({
      questionId: r.questionId,
      scaleValue: r.scaleValue,
    }));

    // 5. 그리드 응답
    const gridResponses = await this.gridResponseRepository
      .createQueryBuilder('response')
      .where('response.employeeId = :employeeNumber', { employeeNumber })
      .andWhere('response.questionId IN (:...questionIds)', { questionIds })
      .getMany();
    const gridMap = new Map<
      string,
      Array<{ rowName: string; columnValue: string }>
    >();
    gridResponses.forEach((r) => {
      const items = gridMap.get(r.questionId) || [];
      items.push({ rowName: r.rowName, columnValue: r.columnValue });
      gridMap.set(r.questionId, items);
    });
    const gridAnswers = Array.from(gridMap.entries()).map(
      ([questionId, gridAnswers]) => ({
        questionId,
        gridAnswers,
      }),
    );

    // 6. 파일 응답
    const fileResponses = await this.fileResponseRepository
      .createQueryBuilder('response')
      .where('response.employeeId = :employeeNumber', { employeeNumber })
      .andWhere('response.questionId IN (:...questionIds)', { questionIds })
      .getMany();
    const fileMap = new Map<
      string,
      Array<{
        fileUrl: string;
        fileName: string;
        fileSize: number;
        mimeType: string;
      }>
    >();
    fileResponses.forEach((r) => {
      const files = fileMap.get(r.questionId) || [];
      files.push({
        fileUrl: r.fileUrl,
        fileName: r.fileName,
        fileSize: r.fileSize,
        mimeType: r.mimeType,
      });
      fileMap.set(r.questionId, files);
    });
    const fileAnswers = Array.from(fileMap.entries()).map(
      ([questionId, files]) => ({
        questionId,
        files,
      }),
    );

    // 7. 날짜/시간 응답
    const datetimeResponses = await this.datetimeResponseRepository
      .createQueryBuilder('response')
      .where('response.employeeId = :employeeNumber', { employeeNumber })
      .andWhere('response.questionId IN (:...questionIds)', { questionIds })
      .getMany();
    const datetimeAnswers = datetimeResponses.map((r) => ({
      questionId: r.questionId,
      datetimeValue: r.datetimeValue.toISOString(),
    }));

    this.logger.log(
      `사용자 설문 응답 조회 완료 - 총 ${textAnswers.length + choiceAnswers.length + checkboxAnswers.length + scaleAnswers.length + gridAnswers.length + fileAnswers.length + datetimeAnswers.length}개 응답`,
    );

    return {
      textAnswers,
      choiceAnswers,
      checkboxAnswers,
      scaleAnswers,
      gridAnswers,
      fileAnswers,
      datetimeAnswers,
    };
  }

  /**
   * 설문 응답을 제출한다
   */
  async 설문_응답을_제출한다(
    announcementId: string,
    employeeId: string,
    employeeNumber: string,
    answers: {
      textAnswers?: Array<{ questionId: string; textValue: string }>;
      choiceAnswers?: Array<{ questionId: string; selectedOption: string }>;
      checkboxAnswers?: Array<{ questionId: string; selectedOptions: string[] }>;
      scaleAnswers?: Array<{ questionId: string; scaleValue: number }>;
      gridAnswers?: Array<{
        questionId: string;
        gridAnswers: Array<{ rowName: string; columnValue: string }>;
      }>;
      fileAnswers?: Array<{
        questionId: string;
        files: Array<{
          fileUrl: string;
          fileName: string;
          fileSize: number;
          mimeType: string;
        }>;
      }>;
      datetimeAnswers?: Array<{ questionId: string; datetimeValue: string }>;
    },
  ): Promise<{ success: boolean; surveyId: string }> {
    this.logger.log(
      `설문 응답 제출 시작 - 공지사항 ID: ${announcementId}, 직원 사번: ${employeeNumber}`,
    );

    // 1. 설문조사 존재 확인
    const survey =
      await this.공지사항ID로_설문조사를_조회한다(announcementId);
    if (!survey) {
      throw new NotFoundException(
        `해당 공지사항에 설문조사가 없습니다. 공지사항 ID: ${announcementId}`,
      );
    }

    // 2. 중복 응답 확인
    const isAlreadyCompleted = await this.설문_완료_여부를_확인한다(
      survey.id,
      employeeNumber,
    );
    if (isAlreadyCompleted) {
      throw new ConflictException('이미 응답을 완료한 설문조사입니다.');
    }

    // 3. 트랜잭션으로 응답 저장
    const queryRunner =
      this.surveyRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const submittedAt = new Date();

      // 3-1. 텍스트 응답 저장
      if (answers.textAnswers && answers.textAnswers.length > 0) {
        for (const answer of answers.textAnswers) {
          await queryRunner.manager.save(SurveyResponseText, {
            questionId: answer.questionId,
            employeeId: employeeId,
            employeeNumber: employeeNumber,
            textValue: answer.textValue,
            submittedAt,
          });
        }
        this.logger.debug(
          `텍스트 응답 ${answers.textAnswers.length}개 저장 완료`,
        );
      }

      // 3-2. 선택형 응답 저장
      if (answers.choiceAnswers && answers.choiceAnswers.length > 0) {
        for (const answer of answers.choiceAnswers) {
          await queryRunner.manager.save(SurveyResponseChoice, {
            questionId: answer.questionId,
            employeeId: employeeId,
            employeeNumber: employeeNumber,
            selectedOption: answer.selectedOption,
            submittedAt,
          });
        }
        this.logger.debug(
          `선택형 응답 ${answers.choiceAnswers.length}개 저장 완료`,
        );
      }

      // 3-3. 체크박스 응답 저장 (다중 선택)
      if (answers.checkboxAnswers && answers.checkboxAnswers.length > 0) {
        for (const answer of answers.checkboxAnswers) {
          for (const option of answer.selectedOptions) {
            await queryRunner.manager.save(SurveyResponseCheckbox, {
              questionId: answer.questionId,
              employeeId: employeeId,
              employeeNumber: employeeNumber,
              selectedOption: option,
              submittedAt,
            });
          }
        }
        this.logger.debug(
          `체크박스 응답 ${answers.checkboxAnswers.length}개 저장 완료`,
        );
      }

      // 3-4. 척도 응답 저장
      if (answers.scaleAnswers && answers.scaleAnswers.length > 0) {
        for (const answer of answers.scaleAnswers) {
          await queryRunner.manager.save(SurveyResponseScale, {
            questionId: answer.questionId,
            employeeId: employeeId,
            employeeNumber: employeeNumber,
            scaleValue: answer.scaleValue,
            submittedAt,
          });
        }
        this.logger.debug(
          `척도 응답 ${answers.scaleAnswers.length}개 저장 완료`,
        );
      }

      // 3-5. 그리드 응답 저장
      if (answers.gridAnswers && answers.gridAnswers.length > 0) {
        for (const answer of answers.gridAnswers) {
          for (const gridItem of answer.gridAnswers) {
            await queryRunner.manager.save(SurveyResponseGrid, {
              questionId: answer.questionId,
              employeeId: employeeId,
              employeeNumber: employeeNumber,
              rowName: gridItem.rowName,
              columnValue: gridItem.columnValue,
              submittedAt,
            });
          }
        }
        this.logger.debug(
          `그리드 응답 ${answers.gridAnswers.length}개 저장 완료`,
        );
      }

      // 3-6. 파일 응답 저장
      if (answers.fileAnswers && answers.fileAnswers.length > 0) {
        for (const answer of answers.fileAnswers) {
          for (const file of answer.files) {
            await queryRunner.manager.save(SurveyResponseFile, {
              questionId: answer.questionId,
              employeeId: employeeId,
              employeeNumber: employeeNumber,
              fileUrl: file.fileUrl,
              fileName: file.fileName,
              fileSize: file.fileSize,
              mimeType: file.mimeType,
              submittedAt,
            });
          }
        }
        this.logger.debug(
          `파일 응답 ${answers.fileAnswers.length}개 저장 완료`,
        );
      }

      // 3-7. 날짜/시간 응답 저장
      if (answers.datetimeAnswers && answers.datetimeAnswers.length > 0) {
        for (const answer of answers.datetimeAnswers) {
          await queryRunner.manager.save(SurveyResponseDatetime, {
            questionId: answer.questionId,
            employeeId: employeeId,
            employeeNumber: employeeNumber,
            datetimeValue: new Date(answer.datetimeValue),
            submittedAt,
          });
        }
        this.logger.debug(
          `날짜/시간 응답 ${answers.datetimeAnswers.length}개 저장 완료`,
        );
      }

      // 4. 응답한 질문 수 계산
      const answeredQuestionIds = new Set<string>();
      if (answers.textAnswers)
        answers.textAnswers.forEach((a) =>
          answeredQuestionIds.add(a.questionId),
        );
      if (answers.choiceAnswers)
        answers.choiceAnswers.forEach((a) =>
          answeredQuestionIds.add(a.questionId),
        );
      if (answers.checkboxAnswers)
        answers.checkboxAnswers.forEach((a) =>
          answeredQuestionIds.add(a.questionId),
        );
      if (answers.scaleAnswers)
        answers.scaleAnswers.forEach((a) =>
          answeredQuestionIds.add(a.questionId),
        );
      if (answers.gridAnswers)
        answers.gridAnswers.forEach((a) =>
          answeredQuestionIds.add(a.questionId),
        );
      if (answers.fileAnswers)
        answers.fileAnswers.forEach((a) =>
          answeredQuestionIds.add(a.questionId),
        );
      if (answers.datetimeAnswers)
        answers.datetimeAnswers.forEach((a) =>
          answeredQuestionIds.add(a.questionId),
        );

      const answeredQuestions = answeredQuestionIds.size;
      const totalQuestions = survey.questions?.length || 0;
      const isCompleted = answeredQuestions === totalQuestions;

      // 5. SurveyCompletion 생성/업데이트
      const existingCompletion = await queryRunner.manager.findOne(
        SurveyCompletion,
        {
          where: { surveyId: survey.id, employeeNumber },
        },
      );

      if (existingCompletion) {
        existingCompletion.answeredQuestions = answeredQuestions;
        existingCompletion.totalQuestions = totalQuestions;
        existingCompletion.isCompleted = isCompleted;
        existingCompletion.completedAt = isCompleted ? new Date() : null;
        await queryRunner.manager.save(SurveyCompletion, existingCompletion);
      } else {
        await queryRunner.manager.save(SurveyCompletion, {
          surveyId: survey.id,
          employeeId, // 내부 UUID
          employeeNumber, // SSO 사번
          totalQuestions,
          answeredQuestions,
          isCompleted,
          completedAt: isCompleted ? new Date() : null,
        });
      }

      await queryRunner.commitTransaction();

      this.logger.log(
        `설문 응답 제출 완료 - 설문 ID: ${survey.id}, 응답 질문 수: ${answeredQuestions}/${totalQuestions}`,
      );

      return { success: true, surveyId: survey.id };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`설문 응답 제출 실패: ${error.message}`, error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
