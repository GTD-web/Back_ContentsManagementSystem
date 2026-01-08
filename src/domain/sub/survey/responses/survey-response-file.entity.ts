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
 * SurveyResponseFile Entity (설문 응답 - 파일)
 * 
 * 파일 업로드 응답
 */
@Entity('survey_response_files')
@Index('uk_survey_response_file', ['questionId', 'employeeId', 'fileUrl'], {
  unique: true,
})
@Index('idx_survey_response_file_employee_id', ['employeeId'])
export class SurveyResponseFile {
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
    type: 'text',
    comment: '파일 URL (AWS S3)',
  })
  fileUrl: string;

  @Column({
    type: 'varchar',
    length: 500,
    comment: '원본 파일명',
  })
  fileName: string;

  @Column({
    type: 'bigint',
    comment: '파일 크기 (bytes)',
  })
  fileSize: number;

  @Column({
    type: 'varchar',
    length: 200,
    comment: 'MIME 타입',
  })
  mimeType: string;

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
