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
 * SurveyResponseScale Entity (설문 응답 - 척도)
 * 
 * 선형 척도 응답 (1-10)
 */
@Entity('survey_response_scales')
@Index('uk_survey_response_scale', ['questionId', 'employeeId'], {
  unique: true,
})
@Index('idx_survey_response_scale_employee_id', ['employeeId'])
export class SurveyResponseScale {
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
    type: 'int',
    comment: '척도 값 (1-10)',
  })
  scaleValue: number;

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
