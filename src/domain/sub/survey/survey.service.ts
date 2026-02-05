import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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
        // 기존 질문 조회
        const existingQuestions = await queryRunner.manager.find(
          SurveyQuestion,
          {
            where: { surveyId: id },
          },
        );

        // 프론트엔드가 ID를 보내지 않는 경우를 위해 자동 매칭
        this.질문에_기존_ID를_자동으로_매칭한다(existingQuestions, data.questions);

        // 새로 전달된 질문 ID 목록
        const newQuestionIds = data.questions
          .filter((q) => q.id)
          .map((q) => q.id!);

        // 삭제할 질문: 기존 질문 중 새 목록에 없는 것만 삭제
        const questionsToDelete = existingQuestions.filter(
          (q) => !newQuestionIds.includes(q.id),
        );

        if (questionsToDelete.length > 0) {
          this.logger.warn(
            `질문 ${questionsToDelete.length}개 Soft Delete 예정 - 복구 가능`,
          );
          // Hard Delete 대신 Soft Delete 사용
          for (const question of questionsToDelete) {
            await queryRunner.manager.softDelete(SurveyQuestion, question.id);
          }
        }

        // 질문 업데이트 또는 생성
        for (const questionData of data.questions) {
          if (questionData.id) {
            // 기존 질문 업데이트 (ID가 있으면)
            const existingQuestion = existingQuestions.find(
              (q) => q.id === questionData.id,
            );

            if (existingQuestion) {
              // 질문 내용이 변경되었는지 확인
              const hasQuestionChanged = this.질문이_변경되었는지_확인한다(
                existingQuestion,
                questionData,
              );

              if (hasQuestionChanged) {
                this.logger.log(
                  `질문 변경 감지 - "${existingQuestion.title}" → 해당 질문의 응답 삭제 예정`,
                );

                // 해당 질문의 모든 응답 soft delete
                await this.질문의_응답을_삭제한다(
                  queryRunner,
                  existingQuestion.id,
                );
              }

              // 질문 정보 업데이트
              existingQuestion.title = questionData.title;
              existingQuestion.type = questionData.type;
              existingQuestion.form = questionData.form || null;
              existingQuestion.isRequired = questionData.isRequired;
              existingQuestion.order = questionData.order;

              await queryRunner.manager.save(SurveyQuestion, existingQuestion);
            }
          } else {
            // 새 질문 생성 (ID가 없으면)
            this.logger.warn(
              `새 질문 생성 - 기존 응답 매핑 없음: ${questionData.title}`,
            );
            const newQuestion = queryRunner.manager.create(SurveyQuestion, {
              surveyId: id,
              title: questionData.title,
              type: questionData.type,
              form: questionData.form || null,
              isRequired: questionData.isRequired,
              order: questionData.order,
            });

            await queryRunner.manager.save(SurveyQuestion, newQuestion);
          }
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
   * 질문에 기존 ID를 자동으로 매칭한다
   * 프론트엔드가 ID를 보내지 않는 경우를 대비한 안전장치
   * @private
   */
  private 질문에_기존_ID를_자동으로_매칭한다(
    existingQuestions: SurveyQuestion[],
    newQuestions: Array<{
      id?: string;
      title: string;
      type: string;
      form?: any;
      isRequired: boolean;
      order: number;
    }>,
  ): void {
    // order 기준으로 정렬
    const sortedExisting = [...existingQuestions].sort((a, b) => a.order - b.order);
    const sortedNew = [...newQuestions].sort((a, b) => a.order - b.order);

    let matchedCount = 0;

    for (let i = 0; i < sortedNew.length; i++) {
      const newQ = sortedNew[i];
      
      // 이미 ID가 있으면 스킵
      if (newQ.id) {
        continue;
      }

      // order와 type이 같은 기존 질문 찾기
      const matchingExisting = sortedExisting.find(
        (existing) => 
          existing.order === newQ.order && 
          existing.type === newQ.type
      );

      if (matchingExisting) {
        // ID 자동 할당
        newQ.id = matchingExisting.id;
        matchedCount++;
      }
    }

    if (matchedCount > 0) {
      this.logger.log(
        `프론트엔드가 전송하지 않은 질문 ID ${matchedCount}개를 자동으로 매칭했습니다.`,
      );
    }
  }

  /**
   * 개별 질문이 변경되었는지 확인한다
   * @private
   */
  private 질문이_변경되었는지_확인한다(
    existingQuestion: SurveyQuestion,
    newQuestionData: {
      title: string;
      type: string;
      form?: any;
      isRequired: boolean;
      order: number;
    },
  ): boolean {
    // 제목이 다르면 변경됨
    if (existingQuestion.title !== newQuestionData.title) {
      this.logger.debug(`질문 제목 변경: "${existingQuestion.title}" → "${newQuestionData.title}"`);
      return true;
    }

    // 타입이 다르면 변경됨
    if (existingQuestion.type !== newQuestionData.type) {
      this.logger.debug(`질문 타입 변경: ${existingQuestion.type} → ${newQuestionData.type}`);
      return true;
    }

    // form이 다르면 변경됨 (options, scale 등)
    // null, undefined, {} 모두 동일하게 취급
    const existingForm = existingQuestion.form;
    const newForm = newQuestionData.form;
    
    // 둘 다 비어있으면 (null, undefined, {}) 변경 없음
    const existingIsEmpty = !existingForm || Object.keys(existingForm).length === 0;
    const newIsEmpty = !newForm || Object.keys(newForm).length === 0;
    
    if (existingIsEmpty && newIsEmpty) {
      // 둘 다 비어있으면 form 변경 없음
    } else if (existingIsEmpty !== newIsEmpty) {
      // 하나만 비어있으면 변경됨
      this.logger.debug(`질문 form 변경: empty 상태 불일치`);
      return true;
    } else {
      // 둘 다 값이 있으면 내용 비교
      // 키를 정렬해서 비교하여 순서 문제 해결
      const sortedExisting = this.sortObjectKeys(existingForm);
      const sortedNew = this.sortObjectKeys(newForm);
      
      if (JSON.stringify(sortedExisting) !== JSON.stringify(sortedNew)) {
        this.logger.debug(`질문 form 변경 감지`);
        this.logger.debug(`이전: ${JSON.stringify(sortedExisting)}`);
        this.logger.debug(`새로운: ${JSON.stringify(sortedNew)}`);
        return true;
      }
    }

    // 필수 여부가 다르면 변경됨
    if (existingQuestion.isRequired !== newQuestionData.isRequired) {
      this.logger.debug(`질문 필수 여부 변경: ${existingQuestion.isRequired} → ${newQuestionData.isRequired}`);
      return true;
    }

    // 모든 검사 통과 - 변경 없음
    return false;
  }

  /**
   * 객체의 키를 재귀적으로 정렬 (JSON.stringify 비교 시 순서 문제 해결)
   */
  private sortObjectKeys(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.sortObjectKeys(item));
    }
    
    if (typeof obj === 'object') {
      return Object.keys(obj)
        .sort()
        .reduce((result, key) => {
          result[key] = this.sortObjectKeys(obj[key]);
          return result;
        }, {} as any);
    }
    
    return obj;
  }

  /**
   * 특정 질문의 모든 응답을 soft delete한다
   * @private
   */
  private async 질문의_응답을_삭제한다(
    queryRunner: any,
    questionId: string,
  ): Promise<number> {
    this.logger.log(`질문 응답 삭제 시작 - 질문 ID: ${questionId}`);

    let totalDeleted = 0;

    // 각 응답 타입별로 soft delete
    const deleteResults = await Promise.all([
      queryRunner.manager.softDelete(SurveyResponseText, { questionId }),
      queryRunner.manager.softDelete(SurveyResponseChoice, { questionId }),
      queryRunner.manager.softDelete(SurveyResponseCheckbox, { questionId }),
      queryRunner.manager.softDelete(SurveyResponseScale, { questionId }),
      queryRunner.manager.softDelete(SurveyResponseGrid, { questionId }),
      queryRunner.manager.softDelete(SurveyResponseFile, { questionId }),
      queryRunner.manager.softDelete(SurveyResponseDatetime, { questionId }),
    ]);

    deleteResults.forEach((result) => {
      totalDeleted += result.affected || 0;
    });

    this.logger.log(
      `질문 응답 삭제 완료 - 질문 ID: ${questionId}, 삭제된 레코드: ${totalDeleted}개`,
    );

    return totalDeleted;
  }

  /**
   * 설문조사 구조가 변경되었는지 확인한다
   * @private
   */
  private 설문조사_구조가_변경되었는지_확인한다(
    existingQuestions: SurveyQuestion[],
    newQuestions: Array<{
      id?: string;
      title: string;
      type: string;
      form?: any;
      isRequired: boolean;
      order: number;
    }>,
  ): boolean {
    // 질문 수가 다르면 변경됨
    if (existingQuestions.length !== newQuestions.length) {
      return true;
    }

    // 질문이 없으면 변경 없음
    if (existingQuestions.length === 0) {
      return false;
    }

    // order 기준으로 정렬
    const sortedExisting = [...existingQuestions].sort((a, b) => a.order - b.order);
    const sortedNew = [...newQuestions].sort((a, b) => a.order - b.order);

    // 각 질문을 순서대로 비교
    for (let i = 0; i < sortedExisting.length; i++) {
      const existing = sortedExisting[i];
      const newQ = sortedNew[i];

      // ID가 다르면 (또는 ID가 없으면) 변경됨
      if (newQ.id !== existing.id) {
        return true;
      }

      // 타입이 다르면 변경됨 (응답 구조가 완전히 달라짐)
      if (newQ.type !== existing.type) {
        return true;
      }

      // form이 변경되었는지 확인 (options, scale 등)
      if (JSON.stringify(newQ.form) !== JSON.stringify(existing.form)) {
        return true;
      }
    }

    // 모든 검사 통과 - 구조 변경 없음
    return false;
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
      .where('response.employeeNumber = :employeeNumber', { employeeNumber })
      .andWhere('response.questionId IN (:...questionIds)', { questionIds })
      .getMany();
    const textAnswers = textResponses.map((r) => ({
      questionId: r.questionId,
      textValue: r.textValue,
    }));

    // 2. 선택형 응답
    const choiceResponses = await this.choiceResponseRepository
      .createQueryBuilder('response')
      .where('response.employeeNumber = :employeeNumber', { employeeNumber })
      .andWhere('response.questionId IN (:...questionIds)', { questionIds })
      .getMany();
    const choiceAnswers = choiceResponses.map((r) => ({
      questionId: r.questionId,
      selectedOption: r.selectedOption,
    }));

    // 3. 체크박스 응답
    const checkboxResponses = await this.checkboxResponseRepository
      .createQueryBuilder('response')
      .where('response.employeeNumber = :employeeNumber', { employeeNumber })
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
      .where('response.employeeNumber = :employeeNumber', { employeeNumber })
      .andWhere('response.questionId IN (:...questionIds)', { questionIds })
      .getMany();
    const scaleAnswers = scaleResponses.map((r) => ({
      questionId: r.questionId,
      scaleValue: r.scaleValue,
    }));

    // 5. 그리드 응답
    const gridResponses = await this.gridResponseRepository
      .createQueryBuilder('response')
      .where('response.employeeNumber = :employeeNumber', { employeeNumber })
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
      .where('response.employeeNumber = :employeeNumber', { employeeNumber })
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
      .where('response.employeeNumber = :employeeNumber', { employeeNumber })
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
   * 설문 응답 파일을 개별 삭제한다 (본인이 제출한 파일만 삭제 가능)
   */
  async 설문_응답_파일을_삭제한다(
    announcementId: string,
    employeeId: string,
    fileUrl: string,
  ): Promise<{ success: boolean }> {
    const survey =
      await this.공지사항ID로_설문조사를_조회한다(announcementId);
    if (!survey) {
      throw new NotFoundException(
        `해당 공지사항에 설문조사가 없습니다. 공지사항 ID: ${announcementId}`,
      );
    }

    const questionIds = survey.questions?.map((q) => q.id) || [];
    if (questionIds.length === 0) {
      throw new NotFoundException('설문에 질문이 없습니다.');
    }

    const fileResponse = await this.fileResponseRepository.findOne({
      where: {
        fileUrl,
        employeeId,
        questionId: In(questionIds),
      },
    });

    if (!fileResponse) {
      throw new NotFoundException(
        '해당 설문 응답 파일을 찾을 수 없거나 삭제 권한이 없습니다.',
      );
    }

    await this.fileResponseRepository.remove(fileResponse);
    this.logger.log(
      `설문 응답 파일 삭제 완료 - 공지사항 ID: ${announcementId}, 파일 URL: ${fileUrl}`,
    );
    return { success: true };
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

    // 2. 트랜잭션으로 기존 응답 삭제 후 새 응답 저장 (재제출 시 덮어쓰기)
    const queryRunner =
      this.surveyRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const questionIds =
        survey.questions?.map((q) => q.id) || [];

      const submittedAt = new Date();

      // 2-1. 텍스트 응답 저장 (기존 레코드 복구 또는 새로 생성)
      if (answers.textAnswers && answers.textAnswers.length > 0) {
        for (const answer of answers.textAnswers) {
          // 기존 레코드 찾기 (soft deleted 포함)
          const existing = await queryRunner.manager.findOne(
            SurveyResponseText,
            {
              where: {
                questionId: answer.questionId,
                employeeId: employeeId,
              },
              withDeleted: true,
            },
          );

          if (existing) {
            // 기존 레코드 복구 및 업데이트
            existing.textValue = answer.textValue;
            existing.submittedAt = submittedAt;
            existing.deletedAt = null as any;
            await queryRunner.manager.save(SurveyResponseText, existing);
          } else {
            // 새 레코드 생성
            await queryRunner.manager.save(SurveyResponseText, {
              questionId: answer.questionId,
              employeeId: employeeId,
              employeeNumber: employeeNumber,
              textValue: answer.textValue,
              submittedAt,
            });
          }
        }
        this.logger.debug(
          `텍스트 응답 ${answers.textAnswers.length}개 저장 완료`,
        );
      }

      // 2-2. 선택형 응답 저장 (기존 레코드 복구 또는 새로 생성)
      if (answers.choiceAnswers && answers.choiceAnswers.length > 0) {
        for (const answer of answers.choiceAnswers) {
          const existing = await queryRunner.manager.findOne(
            SurveyResponseChoice,
            {
              where: {
                questionId: answer.questionId,
                employeeId: employeeId,
              },
              withDeleted: true,
            },
          );

          if (existing) {
            existing.selectedOption = answer.selectedOption;
            existing.submittedAt = submittedAt;
            existing.deletedAt = null as any;
            await queryRunner.manager.save(SurveyResponseChoice, existing);
          } else {
            await queryRunner.manager.save(SurveyResponseChoice, {
              questionId: answer.questionId,
              employeeId: employeeId,
              employeeNumber: employeeNumber,
              selectedOption: answer.selectedOption,
              submittedAt,
            });
          }
        }
        this.logger.debug(
          `선택형 응답 ${answers.choiceAnswers.length}개 저장 완료`,
        );
      }

      // 2-3. 체크박스 응답 저장 (기존 레코드 복구 또는 새로 생성)
      // 다중 선택이므로 복잡한 로직 필요
      if (answers.checkboxAnswers && answers.checkboxAnswers.length > 0) {
        for (const answer of answers.checkboxAnswers) {
          // 2-3-1. 해당 질문의 모든 기존 체크박스 응답 soft delete (선택 해제 처리)
          await queryRunner.manager
            .createQueryBuilder()
            .update(SurveyResponseCheckbox)
            .set({ deletedAt: submittedAt })
            .where('questionId = :questionId', { questionId: answer.questionId })
            .andWhere('employeeId = :employeeId', { employeeId })
            .andWhere('deletedAt IS NULL')
            .execute();

          // 2-3-2. 새로 선택한 옵션들을 복구 또는 생성
          for (const option of answer.selectedOptions) {
            const existing = await queryRunner.manager.findOne(
              SurveyResponseCheckbox,
              {
                where: {
                  questionId: answer.questionId,
                  employeeId: employeeId,
                  selectedOption: option,
                },
                withDeleted: true,
              },
            );

            if (existing) {
              // 기존 레코드 복구
              existing.submittedAt = submittedAt;
              existing.deletedAt = null as any;
              await queryRunner.manager.save(SurveyResponseCheckbox, existing);
            } else {
              // 새 레코드 생성
              await queryRunner.manager.save(SurveyResponseCheckbox, {
                questionId: answer.questionId,
                employeeId: employeeId,
                employeeNumber: employeeNumber,
                selectedOption: option,
                submittedAt,
              });
            }
          }
        }
        this.logger.debug(
          `체크박스 응답 ${answers.checkboxAnswers.length}개 저장 완료`,
        );
      }

      // 2-4. 척도 응답 저장 (기존 레코드 복구 또는 새로 생성)
      if (answers.scaleAnswers && answers.scaleAnswers.length > 0) {
        for (const answer of answers.scaleAnswers) {
          const existing = await queryRunner.manager.findOne(
            SurveyResponseScale,
            {
              where: {
                questionId: answer.questionId,
                employeeId: employeeId,
              },
              withDeleted: true,
            },
          );

          if (existing) {
            existing.scaleValue = answer.scaleValue;
            existing.submittedAt = submittedAt;
            existing.deletedAt = null as any;
            await queryRunner.manager.save(SurveyResponseScale, existing);
          } else {
            await queryRunner.manager.save(SurveyResponseScale, {
              questionId: answer.questionId,
              employeeId: employeeId,
              employeeNumber: employeeNumber,
              scaleValue: answer.scaleValue,
              submittedAt,
            });
          }
        }
        this.logger.debug(
          `척도 응답 ${answers.scaleAnswers.length}개 저장 완료`,
        );
      }

      // 2-5. 그리드 응답 저장 (기존 레코드 복구 또는 새로 생성)
      if (answers.gridAnswers && answers.gridAnswers.length > 0) {
        for (const answer of answers.gridAnswers) {
          for (const gridItem of answer.gridAnswers) {
            const existing = await queryRunner.manager.findOne(
              SurveyResponseGrid,
              {
                where: {
                  questionId: answer.questionId,
                  employeeId: employeeId,
                  rowName: gridItem.rowName,
                },
                withDeleted: true,
              },
            );

            if (existing) {
              existing.columnValue = gridItem.columnValue;
              existing.submittedAt = submittedAt;
              existing.deletedAt = null as any;
              await queryRunner.manager.save(SurveyResponseGrid, existing);
            } else {
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
        }
        this.logger.debug(
          `그리드 응답 ${answers.gridAnswers.length}개 저장 완료`,
        );
      }

      // 2-6. 파일 응답 저장 (기존 파일 유지, 새 파일만 추가)
      if (answers.fileAnswers && answers.fileAnswers.length > 0) {
        for (const answer of answers.fileAnswers) {
          for (const file of answer.files) {
            // 파일은 항상 새로 추가 (중복 체크는 fileUrl 기준)
            const existing = await queryRunner.manager.findOne(
              SurveyResponseFile,
              {
                where: {
                  questionId: answer.questionId,
                  employeeId: employeeId,
                  fileUrl: file.fileUrl,
                },
                withDeleted: true,
              },
            );

            if (existing) {
              // 기존 파일 레코드 복구
              existing.fileName = file.fileName;
              existing.fileSize = file.fileSize;
              existing.mimeType = file.mimeType;
              existing.submittedAt = submittedAt;
              existing.deletedAt = null as any;
              await queryRunner.manager.save(SurveyResponseFile, existing);
            } else {
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
        }
        this.logger.debug(
          `파일 응답 ${answers.fileAnswers.length}개 저장 완료`,
        );
      }

      // 2-7. 날짜/시간 응답 저장 (기존 레코드 복구 또는 새로 생성)
      if (answers.datetimeAnswers && answers.datetimeAnswers.length > 0) {
        for (const answer of answers.datetimeAnswers) {
          const existing = await queryRunner.manager.findOne(
            SurveyResponseDatetime,
            {
              where: {
                questionId: answer.questionId,
                employeeId: employeeId,
              },
              withDeleted: true,
            },
          );

          if (existing) {
            existing.datetimeValue = new Date(answer.datetimeValue);
            existing.submittedAt = submittedAt;
            existing.deletedAt = null as any;
            await queryRunner.manager.save(SurveyResponseDatetime, existing);
          } else {
            await queryRunner.manager.save(SurveyResponseDatetime, {
              questionId: answer.questionId,
              employeeId: employeeId,
              employeeNumber: employeeNumber,
              datetimeValue: new Date(answer.datetimeValue),
              submittedAt,
            });
          }
        }
        this.logger.debug(
          `날짜/시간 응답 ${answers.datetimeAnswers.length}개 저장 완료`,
        );
      }

      // 3. 응답한 질문 수 계산 (이번 요청 + 기존 파일 응답 질문 포함)
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
      // 기존 파일 응답이 있는 질문도 포함 (soft deleted 제외)
      if (questionIds.length > 0) {
        const existingFiles = await queryRunner.manager.find(
          SurveyResponseFile,
          {
            where: { 
              employeeId, 
              questionId: In(questionIds),
              deletedAt: null as any, // soft deleted 제외
            },
            select: ['questionId'],
          },
        );
        existingFiles.forEach((f) => answeredQuestionIds.add(f.questionId));
      }

      const answeredQuestions = answeredQuestionIds.size;
      const totalQuestions = survey.questions?.length || 0;
      const isCompleted = answeredQuestions === totalQuestions;

      // 4. SurveyCompletion 생성/업데이트/복구
      // withDeleted: true를 사용하여 soft deleted 레코드도 검색
      const existingCompletion = await queryRunner.manager.findOne(
        SurveyCompletion,
        {
          where: { surveyId: survey.id, employeeNumber },
          withDeleted: true, // soft deleted 레코드도 찾기
        },
      );

      if (existingCompletion) {
        // 기존 레코드가 있으면 업데이트 (삭제 취소 포함)
        existingCompletion.answeredQuestions = answeredQuestions;
        existingCompletion.totalQuestions = totalQuestions;
        existingCompletion.isCompleted = isCompleted;
        existingCompletion.completedAt = isCompleted ? new Date() : null;
        existingCompletion.deletedAt = null as any; // soft delete 복구
        await queryRunner.manager.save(SurveyCompletion, existingCompletion);
      } else {
        // 새로운 레코드 생성
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

  /**
   * 특정 직원들의 설문 응답을 소프트 삭제한다
   * (공지사항 권한 축소 시 사용)
   */
  async 직원들의_설문_응답을_삭제한다(
    surveyId: string,
    employeeNumbers: string[],
  ): Promise<{ deletedCount: number }> {
    if (!employeeNumbers || employeeNumbers.length === 0) {
      return { deletedCount: 0 };
    }

    this.logger.log(
      `설문 응답 삭제 시작 - 설문 ID: ${surveyId}, 대상 직원: ${employeeNumbers.length}명`,
    );

    const queryRunner =
      this.surveyRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let totalDeleted = 0;

      // 1. SurveyCompletion soft delete
      const completions = await queryRunner.manager.softDelete(
        SurveyCompletion,
        {
          surveyId,
          employeeNumber: In(employeeNumbers),
        },
      );
      totalDeleted += completions.affected || 0;

      // 2. 각 응답 테이블별 soft delete (checkbox 포함)
      const deleteResults = await Promise.all([
        queryRunner.manager.softDelete(SurveyResponseText, {
          employeeNumber: In(employeeNumbers),
        }),
        queryRunner.manager.softDelete(SurveyResponseChoice, {
          employeeNumber: In(employeeNumbers),
        }),
        queryRunner.manager.softDelete(SurveyResponseCheckbox, {
          employeeNumber: In(employeeNumbers),
        }),
        queryRunner.manager.softDelete(SurveyResponseScale, {
          employeeNumber: In(employeeNumbers),
        }),
        queryRunner.manager.softDelete(SurveyResponseGrid, {
          employeeNumber: In(employeeNumbers),
        }),
        queryRunner.manager.softDelete(SurveyResponseFile, {
          employeeNumber: In(employeeNumbers),
        }),
        queryRunner.manager.softDelete(SurveyResponseDatetime, {
          employeeNumber: In(employeeNumbers),
        }),
      ]);

      deleteResults.forEach((result) => {
        totalDeleted += result.affected || 0;
      });

      await queryRunner.commitTransaction();

      this.logger.log(
        `설문 응답 삭제 완료 - 설문 ID: ${surveyId}, 삭제된 레코드: ${totalDeleted}개`,
      );

      return { deletedCount: totalDeleted };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `설문 응답 삭제 실패: ${error.message}`,
        error.stack,
      );
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * employeeId(UUID)를 employeeNumber(사번)로 변환한다
   * soft deleted 레코드도 포함하여 검색 (복구 시 필요)
   */
  async employeeId를_employeeNumber로_변환한다(
    surveyId: string,
    employeeIds: string[],
  ): Promise<string[]> {
    if (!employeeIds || employeeIds.length === 0) {
      return [];
    }

    const completions = await this.completionRepository.find({
      where: {
        surveyId,
        employeeId: In(employeeIds),
      },
      select: ['employeeNumber'],
      withDeleted: true, // soft deleted 레코드도 포함 (복구 시 필요)
    });

    return completions
      .map((c) => c.employeeNumber)
      .filter((num) => num !== null && num !== undefined);
  }

  /**
   * 직원들의 설문 응답을 복구한다 (deletedAt = NULL)
   * (공지사항 권한 재추가 시 사용)
   */
  async 직원들의_설문_응답을_복구한다(
    surveyId: string,
    employeeNumbers: string[],
  ): Promise<{ restoredCount: number }> {
    if (!employeeNumbers || employeeNumbers.length === 0) {
      return { restoredCount: 0 };
    }

    this.logger.log(
      `설문 응답 복구 시작 - 설문 ID: ${surveyId}, 대상 직원: ${employeeNumbers.length}명`,
    );

    const queryRunner =
      this.surveyRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let totalRestored = 0;

      // 1. SurveyCompletion 복구
      const completionResult = await queryRunner.manager
        .createQueryBuilder()
        .update(SurveyCompletion)
        .set({ deletedAt: null as any })
        .where('surveyId = :surveyId', { surveyId })
        .andWhere('employeeNumber IN (:...employeeNumbers)', { employeeNumbers })
        .andWhere('deletedAt IS NOT NULL')
        .execute();
      totalRestored += completionResult.affected || 0;

      // 2. SurveyResponseText 복구
      const textResult = await queryRunner.manager
        .createQueryBuilder()
        .update(SurveyResponseText)
        .set({ deletedAt: null as any })
        .where('employeeNumber IN (:...employeeNumbers)', { employeeNumbers })
        .andWhere('deletedAt IS NOT NULL')
        .execute();
      totalRestored += textResult.affected || 0;

      // 3. SurveyResponseChoice 복구
      const choiceResult = await queryRunner.manager
        .createQueryBuilder()
        .update(SurveyResponseChoice)
        .set({ deletedAt: null as any })
        .where('employeeNumber IN (:...employeeNumbers)', { employeeNumbers })
        .andWhere('deletedAt IS NOT NULL')
        .execute();
      totalRestored += choiceResult.affected || 0;

      // 4. SurveyResponseCheckbox 복구
      const checkboxResult = await queryRunner.manager
        .createQueryBuilder()
        .update(SurveyResponseCheckbox)
        .set({ deletedAt: null as any })
        .where('employeeNumber IN (:...employeeNumbers)', { employeeNumbers })
        .andWhere('deletedAt IS NOT NULL')
        .execute();
      totalRestored += checkboxResult.affected || 0;

      // 5. SurveyResponseScale 복구
      const scaleResult = await queryRunner.manager
        .createQueryBuilder()
        .update(SurveyResponseScale)
        .set({ deletedAt: null as any })
        .where('employeeNumber IN (:...employeeNumbers)', { employeeNumbers })
        .andWhere('deletedAt IS NOT NULL')
        .execute();
      totalRestored += scaleResult.affected || 0;

      // 6. SurveyResponseGrid 복구
      const gridResult = await queryRunner.manager
        .createQueryBuilder()
        .update(SurveyResponseGrid)
        .set({ deletedAt: null as any })
        .where('employeeNumber IN (:...employeeNumbers)', { employeeNumbers })
        .andWhere('deletedAt IS NOT NULL')
        .execute();
      totalRestored += gridResult.affected || 0;

      // 7. SurveyResponseFile 복구
      const fileResult = await queryRunner.manager
        .createQueryBuilder()
        .update(SurveyResponseFile)
        .set({ deletedAt: null as any })
        .where('employeeNumber IN (:...employeeNumbers)', { employeeNumbers })
        .andWhere('deletedAt IS NOT NULL')
        .execute();
      totalRestored += fileResult.affected || 0;

      // 8. SurveyResponseDatetime 복구
      const datetimeResult = await queryRunner.manager
        .createQueryBuilder()
        .update(SurveyResponseDatetime)
        .set({ deletedAt: null as any })
        .where('employeeNumber IN (:...employeeNumbers)', { employeeNumbers })
        .andWhere('deletedAt IS NOT NULL')
        .execute();
      totalRestored += datetimeResult.affected || 0;

      await queryRunner.commitTransaction();

      this.logger.log(
        `설문 응답 복구 완료 - 설문 ID: ${surveyId}, 복구된 레코드: ${totalRestored}개`,
      );

      return { restoredCount: totalRestored };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `설문 응답 복구 실패: ${error.message}`,
        error.stack,
      );
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 설문조사 순서만 수정한다
   * (snapshot 개념이므로 질문 내용은 수정하지 않고 순서만 변경)
   */
  async 설문조사_순서를_수정한다(
    surveyId: string,
    order: number,
  ): Promise<void> {
    this.logger.log(`설문조사 순서 변경 - ID: ${surveyId}, 순서: ${order}`);

    const survey = await this.surveyRepository.findOne({
      where: { id: surveyId },
    });

    if (!survey) {
      throw new NotFoundException(`설문조사를 찾을 수 없습니다. ID: ${surveyId}`);
    }

    survey.order = order;
    await this.surveyRepository.save(survey);

    this.logger.log(`설문조사 순서 변경 완료 - ID: ${surveyId}, 순서: ${order}`);
  }

  /**
   * 설문조사 질문 순서를 일괄 변경한다
   * (snapshot 개념이므로 질문 내용은 수정하지 않고 순서만 변경)
   */
  async 설문조사_질문_순서를_일괄_변경한다(
    surveyId: string,
    questions: Array<{ id: string; order: number }>,
  ): Promise<number> {
    if (!questions || questions.length === 0) {
      return 0;
    }

    this.logger.log(
      `설문조사 질문 순서 일괄 변경 - 설문 ID: ${surveyId}, 질문 수: ${questions.length}`,
    );

    const queryRunner =
      this.surveyRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let updatedCount = 0;

      for (const question of questions) {
        const result = await queryRunner.manager
          .createQueryBuilder()
          .update(SurveyQuestion)
          .set({ order: question.order })
          .where('id = :id', { id: question.id })
          .andWhere('surveyId = :surveyId', { surveyId })
          .execute();

        if (result.affected && result.affected > 0) {
          updatedCount += result.affected;
        }
      }

      await queryRunner.commitTransaction();

      this.logger.log(
        `설문조사 질문 순서 일괄 변경 완료 - 설문 ID: ${surveyId}, 변경된 질문 수: ${updatedCount}`,
      );

      return updatedCount;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `설문조사 질문 순서 일괄 변경 실패: ${error.message}`,
        error.stack,
      );
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
