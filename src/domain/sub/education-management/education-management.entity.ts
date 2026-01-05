import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@libs/database/base/base.entity';
import { Employee } from '@domain/common/employee/employee.entity';
import type { Attendee } from './attendee.types';
import { AttendeeStatus } from './attendee.types';
import type { EducationManagementDto } from './education-management.types';

/**
 * 교육 관리 엔티티
 *
 * 직원 교육 프로그램을 관리합니다.
 */
@Entity('education_management')
export class EducationManagement extends BaseEntity<EducationManagementDto> {
  @Column({
    type: 'varchar',
    length: 500,
    comment: '제목',
  })
  title: string;

  @Column({
    type: 'text',
    comment: '내용',
  })
  content: string;

  @Column({
    type: 'boolean',
    default: false,
    comment: '공개 여부',
  })
  isPublic: boolean;

  @Column({
    type: 'jsonb',
    default: [],
    comment: '수강 직원 목록',
  })
  attendees: Attendee[];

  @Column({
    type: 'timestamp',
    comment: '마감 일시',
  })
  deadline: Date;

  @Column({
    type: 'text',
    array: true,
    default: [],
    comment: '첨부파일 URL 목록 (AWS S3)',
  })
  attachments: string[];

  @ManyToOne(() => Employee, { nullable: false })
  @JoinColumn({ name: 'manager_id' })
  manager: Employee;

  constructor(
    title?: string,
    content?: string,
    isPublic?: boolean,
    attendees?: Attendee[],
    deadline?: Date,
    attachments?: string[],
    manager?: Employee,
  ) {
    super();
    if (title) this.title = title;
    if (content) this.content = content;
    if (isPublic !== undefined) this.isPublic = isPublic;
    if (attendees) this.attendees = attendees;
    if (deadline) this.deadline = deadline;
    if (attachments) this.attachments = attachments;
    if (manager) this.manager = manager;
  }

  /**
   * EducationManagement 엔티티를 DTO로 변환한다
   */
  DTO로_변환한다(): EducationManagementDto {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      createdBy: this.createdBy,
      updatedBy: this.updatedBy,
      version: this.version,
      title: this.title,
      content: this.content,
      isPublic: this.isPublic,
      attendees: this.attendees,
      deadline: this.deadline,
      attachments: this.attachments,
      manager: this.manager?.DTO로_변환한다(),
      get isDeleted() {
        return this.deletedAt !== null && this.deletedAt !== undefined;
      },
      get isNew() {
        return !this.id || this.version === 1;
      },
      get isDeadlinePassed() {
        return this.deadline < new Date();
      },
    };
  }

  /**
   * 교육을 공개한다
   */
  공개한다(): void {
    this.isPublic = true;
  }

  /**
   * 교육을 비공개한다
   */
  비공개한다(): void {
    this.isPublic = false;
  }

  /**
   * 수강 직원을 추가한다
   */
  수강직원을_추가한다(attendee: Attendee): void {
    this.attendees.push(attendee);
  }

  /**
   * 수강 직원의 상태를 변경한다
   */
  수강직원_상태를_변경한다(attendeeId: string, status: AttendeeStatus): void {
    const attendee = this.attendees.find((att) => att.id === attendeeId);
    if (attendee) {
      attendee.status = status;
      if (status === AttendeeStatus.COMPLETED) {
        attendee.completedAt = new Date();
      }
    }
  }
}
