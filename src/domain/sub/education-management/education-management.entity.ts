import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  VersionColumn,
  Index,
} from 'typeorm';
import { EducationStatus } from './education-status.types';
import { Attendee } from './attendee.entity';

/**
 * EducationManagement Entity (교육 관리)
 * 
 * 직원 교육 및 수강 관리
 * 다국어 지원: 없음
 */
@Entity('education_managements')
@Index('idx_education_management_status', ['status'])
@Index('idx_education_management_is_public', ['isPublic'])
@Index('idx_education_management_manager_id', ['managerId'])
@Index('idx_education_management_deadline', ['deadline'])
@Index('idx_education_management_order', ['order'])
export class EducationManagement {
  @PrimaryGeneratedColumn('uuid', {
    comment: '교육 관리 ID',
  })
  id: string;

  @Column({
    type: 'varchar',
    length: 500,
    comment: '교육 제목',
  })
  title: string;

  @Column({
    type: 'text',
    comment: '교육 내용',
  })
  content: string;

  @Column({
    type: 'boolean',
    default: true,
    comment: '공개 여부',
  })
  isPublic: boolean;

  @Column({
    type: 'enum',
    enum: EducationStatus,
    default: EducationStatus.SCHEDULED,
    comment: '상태 (scheduled|in_progress|completed|cancelled|postponed)',
  })
  status: EducationStatus;

  @Column({
    type: 'uuid',
    comment: '담당자 ID (외부 시스템 직원 ID - SSO)',
  })
  managerId: string;

  @Column({
    type: 'timestamp',
    comment: '교육 마감 일시',
  })
  deadline: Date;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: '첨부파일 목록 (AWS S3 URLs)',
  })
  attachments: Array<{
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
  }> | null;

  @Column({
    type: 'int',
    default: 0,
    comment: '정렬 순서',
  })
  order: number;

  @OneToMany(() => Attendee, (attendee) => attendee.educationManagement)
  attendees: Attendee[];

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
