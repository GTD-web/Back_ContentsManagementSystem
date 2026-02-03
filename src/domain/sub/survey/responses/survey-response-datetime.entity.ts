import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '@libs/database/base/base.entity';

/**
 * SurveyResponseDatetime Entity (설문 응답 - 날짜/시간)
 * 
 * 날짜/시간 응답
 */
@Entity('survey_response_datetimes')
@Index('uk_survey_response_datetime', ['questionId', 'employeeId'], {
  unique: true,
})
@Index('idx_survey_response_datetime_employee_id', ['employeeId'])
@Index('idx_survey_response_datetime_employee_number', ['employeeNumber'])
export class SurveyResponseDatetime extends BaseEntity<SurveyResponseDatetime> {
  @Column({
    type: 'uuid',
    comment: '질문 ID',
  })
  questionId: string;

  @Column({
    type: 'uuid',
    comment: '직원 ID (내부 DB 사용자 UUID)',
  })
  employeeId: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: '직원 사번 (SSO employeeNumber)',
  })
  employeeNumber: string;

  @Column({
    type: 'timestamp',
    comment: '날짜/시간 값',
  })
  datetimeValue: Date;

  @Column({
    type: 'timestamp',
    comment: '제출 일시',
  })
  submittedAt: Date;

  /**
   * 엔티티를 DTO로 변환한다
   */
  DTO로_변환한다(): SurveyResponseDatetime {
    return this;
  }
}
