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
import { AttendeeStatus } from './attendee-status.types';
import { EducationManagement } from './education-management.entity';

/**
 * Attendee Entity (수강자)
 * 
 * 교육별 수강자 정보 및 완료 상태
 * 같은 직원이 같은 교육에 중복 등록 불가
 */
@Entity('attendees')
@Index('uk_attendee', ['educationManagementId', 'employeeId'], {
  unique: true,
})
@Index('idx_attendee_employee_id', ['employeeId'])
@Index('idx_attendee_status', ['status'])
export class Attendee {
  @PrimaryGeneratedColumn('uuid', {
    comment: '수강자 ID',
  })
  id: string;

  @Column({
    type: 'uuid',
    comment: '교육 관리 ID',
  })
  educationManagementId: string;

  @ManyToOne(
    () => EducationManagement,
    (education) => education.attendees,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'educationManagementId' })
  educationManagement: EducationManagement;

  @Column({
    type: 'uuid',
    comment: '직원 ID (외부 시스템 직원 ID - SSO)',
  })
  employeeId: string;

  @Column({
    type: 'enum',
    enum: AttendeeStatus,
    default: AttendeeStatus.PENDING,
    comment: '수강 상태 (pending|in_progress|completed|overdue)',
  })
  status: AttendeeStatus;

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
