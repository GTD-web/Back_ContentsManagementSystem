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
import { InqueryType } from './inquery-type.types';
import { Survey } from './survey.entity';

/**
 * SurveyQuestion Entity (설문 질문)
 * 
 * 설문조사의 질문 항목
 * 질문 타입에 따라 form 필드에 동적 데이터 저장
 */
@Entity('survey_questions')
@Index('idx_survey_question_survey_id', ['surveyId'])
@Index('idx_survey_question_order', ['order'])
export class SurveyQuestion {
  @PrimaryGeneratedColumn('uuid', {
    comment: '설문 질문 ID',
  })
  id: string;

  @Column({
    type: 'uuid',
    comment: '설문조사 ID',
  })
  surveyId: string;

  @ManyToOne(() => Survey, (survey) => survey.questions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'surveyId' })
  survey: Survey;

  @Column({
    type: 'varchar',
    length: 1000,
    comment: '질문 제목',
  })
  title: string;

  @Column({
    type: 'enum',
    enum: InqueryType,
    comment: '질문 타입 (short_answer|paragraph|multiple_choice|...)',
  })
  type: InqueryType;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: '질문 폼 데이터 (타입별 옵션, 척도 범위 등)',
  })
  form: {
    options?: string[]; // multiple_choice, dropdown, checkboxes
    minScale?: number; // linear_scale
    maxScale?: number; // linear_scale
    rows?: string[]; // grid_scale
    columns?: string[]; // grid_scale
    allowedFileTypes?: string[]; // file_upload
    maxFileSize?: number; // file_upload
  } | null;

  @Column({
    type: 'boolean',
    default: false,
    comment: '필수 응답 여부',
  })
  isRequired: boolean;

  @Column({
    type: 'int',
    default: 0,
    comment: '질문 정렬 순서',
  })
  order: number;

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
