import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
  Index,
} from 'typeorm';

/**
 * SurveyResponseCheckbox Entity (설문 응답 - 체크박스)
 * 
 * 체크박스 응답 (다중 선택 가능)
 * 
 * ⚠️ Hard Delete 사용: 
 * - 사용자가 체크박스 선택 취소 시 레코드 완전 삭제
 * - Soft Delete를 사용하지 않음 (UK 제약조건 문제)
 */
@Entity('survey_response_checkboxes')
@Index('uk_survey_response_checkbox', ['questionId', 'employeeId', 'selectedOption'], {
  unique: true,
})
@Index('idx_survey_response_checkbox_employee_id', ['employeeId'])
export class SurveyResponseCheckbox {
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
    type: 'varchar',
    length: 500,
    comment: '선택한 옵션 (다중 선택 가능)',
  })
  selectedOption: string;

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

  // ⚠️ deletedAt 없음 (Hard Delete 사용)

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
