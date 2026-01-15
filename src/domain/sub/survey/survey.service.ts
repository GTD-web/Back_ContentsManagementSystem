import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Survey } from './survey.entity';
import { SurveyQuestion } from './survey-question.entity';
import { SurveyCompletion } from './survey-completion.entity';

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
  ): Promise<SurveyCompletion> {
    this.logger.log(
      `설문 완료 기록 - 설문 ID: ${surveyId}, 직원 ID: ${employeeId}`,
    );

    // 설문조사 존재 확인
    await this.ID로_설문조사를_조회한다(surveyId);

    // 이미 완료 기록이 있는지 확인
    let completion = await this.completionRepository.findOne({
      where: { surveyId, employeeId },
    });

    if (completion) {
      // 이미 있으면 완료 상태 업데이트
      completion.isCompleted = true;
      completion.completedAt = new Date();
      return await this.completionRepository.save(completion);
    }

    // 없으면 새로 생성
    completion = this.completionRepository.create({
      surveyId,
      employeeId,
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
    employeeId: string,
  ): Promise<boolean> {
    const completion = await this.completionRepository.findOne({
      where: { surveyId, employeeId, isCompleted: true },
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
   * 설문 미완료자 ID 목록을 조회한다
   */
  async 설문_미완료자를_조회한다(
    surveyId: string,
    targetEmployeeIds: string[],
  ): Promise<string[]> {
    const completions = await this.completionRepository.find({
      where: { surveyId, isCompleted: true },
    });

    const completedIds = new Set(completions.map((c) => c.employeeId));
    return targetEmployeeIds.filter((id) => !completedIds.has(id));
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
}
