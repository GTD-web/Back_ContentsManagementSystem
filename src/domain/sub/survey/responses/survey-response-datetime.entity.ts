import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  VersionColumn,
  Index,
} from 'typeorm';

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
export class SurveyResponseDatetime {
  @PrimaryGeneratedColumn('uuid', {
    comment: '응답 ID',
  })
  id: string;

  @Column({
    type: 'uuid',
    comment: '질문 ID',
  })
  questionId: string;

  @Column({
    type: 'uuid',
    comment: '직원 ID (외부 시스템 직원 ID - SSO)',
  })
  employeeId: string;

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

  @CreateDateColumn({
    type: 'timestamp',
    comment: '생성 일시',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    comment: '수정 일시',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
    comment: '삭제 일시 (Soft Delete)',
  })
  deletedAt: Date | null;

  @Column({
    type: 'uuid',
    nullable: true,
    comment: '생성자 ID (외부 시스템 직원 ID - SSO)',
  })
  createdBy: string | null;

  @Column({
    type: 'uuid',
    nullable: true,
    comment: '수정자 ID (외부 시스템 직원 ID - SSO)',
  })
  updatedBy: string | null;

  @VersionColumn({
    comment: '버전 (Optimistic Locking)',
  })
  version: number;
}
