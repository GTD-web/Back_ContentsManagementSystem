import {
  Entity,
  Column,
  Index,
} from 'typeorm';
import { BaseEntity } from '@libs/database/base/base.entity';

/**
 * SurveyResponseCheckbox Entity (설문 응답 - 체크박스)
 * 
 * 체크박스 응답 (다중 선택 가능)
 * 
 * ✅ Soft Delete 사용 (프로덕션 데이터 보호)
 * - BaseEntity 상속으로 deletedAt 필드 자동 추가
 * - 권한 제거 시 soft delete 처리
 * - 권한 재추가 시 복구 가능
 */
@Entity('survey_response_checkboxes')
@Index('uk_survey_response_checkbox', ['questionId', 'employeeId', 'selectedOption'], {
  unique: true,
})
@Index('idx_survey_response_checkbox_employee_id', ['employeeId'])
@Index('idx_survey_response_checkbox_employee_number', ['employeeNumber'])
export class SurveyResponseCheckbox extends BaseEntity<SurveyResponseCheckbox> {
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

  /**
   * 엔티티를 DTO로 변환한다
   */
  DTO로_변환한다(): SurveyResponseCheckbox {
    return this;
  }
}
