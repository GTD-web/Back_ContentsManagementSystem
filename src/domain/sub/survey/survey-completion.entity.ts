import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  VersionColumn,
  Index,
} from 'typeorm';
import { Survey } from './survey.entity';

/**
 * SurveyCompletion Entity (설문 완료 추적)
 * 
 * 직원별 설문 완료 여부 관리
 * 완료 여부는 totalQuestions === answeredQuestions로 계산
 */
@Entity('survey_completions')
@Index('uk_survey_completion', ['surveyId', 'employeeId'], { unique: true })
@Index('idx_survey_completion_employee_id', ['employeeId'])
export class SurveyCompletion {
  @PrimaryGeneratedColumn('uuid', {
    comment: '설문 완료 ID',
  })
  id: string;

  @Column({
    type: 'uuid',
    comment: '설문조사 ID',
  })
  surveyId: string;

  @ManyToOne(() => Survey, (survey) => survey.completions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'surveyId' })
  survey: Survey;

  @Column({
    type: 'uuid',
    comment: '직원 ID (외부 시스템 직원 ID - SSO)',
  })
  employeeId: string;

  @Column({
    type: 'int',
    comment: '전체 질문 수',
  })
  totalQuestions: number;

  @Column({
    type: 'int',
    default: 0,
    comment: '응답한 질문 수',
  })
  answeredQuestions: number;

  @Column({
    type: 'boolean',
    comment: '완료 여부 (generated: totalQuestions === answeredQuestions)',
  })
  isCompleted: boolean;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: '완료 일시',
  })
  completedAt: Date | null;

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
