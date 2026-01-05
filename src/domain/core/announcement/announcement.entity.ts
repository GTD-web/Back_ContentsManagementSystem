import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@libs/database/base/base.entity';
import { Employee } from '@domain/common/employee/employee.entity';
import type {
  AnnouncementStatus,
  AnnouncementCategory,
} from '@domain/core/common/types';
import type { AnnouncementEmployee } from './announcement-employee.types';
import type { AnnouncementDto } from './announcement.types';

/**
 * 공지사항 엔티티
 *
 * 사내 공지사항 정보를 관리합니다.
 */
@Entity('announcement')
export class Announcement extends BaseEntity<AnnouncementDto> {
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
    comment: '상단 고정 여부',
  })
  isFixed: boolean;

  @Column({
    type: 'jsonb',
    comment: '카테고리',
  })
  category: AnnouncementCategory;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: '공개 일시',
  })
  releasedAt?: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: '만료 일시',
  })
  expiredAt?: Date;

  @Column({
    type: 'boolean',
    default: false,
    comment: '필독 여부',
  })
  mustRead: boolean;

  @ManyToOne(() => Employee, { nullable: false })
  @JoinColumn({ name: 'manager_id' })
  manager: Employee;

  @Column({
    type: 'enum',
    enum: ['draft', 'approved', 'under_review', 'rejected', 'opened'],
    default: 'draft',
    comment: '상태',
  })
  status: AnnouncementStatus;

  @Column({
    type: 'int',
    default: 0,
    comment: '조회수',
  })
  hits: number;

  @Column({
    type: 'text',
    array: true,
    default: [],
    comment: '첨부파일 URL 목록 (AWS S3)',
  })
  attachments: string[];

  @Column({
    type: 'jsonb',
    default: [],
    comment: '공지사항을 받은 직원 목록',
  })
  employees: AnnouncementEmployee[];

  constructor(
    title?: string,
    content?: string,
    isFixed?: boolean,
    category?: AnnouncementCategory,
    releasedAt?: Date,
    expiredAt?: Date,
    mustRead?: boolean,
    manager?: Employee,
    status?: AnnouncementStatus,
    hits?: number,
    attachments?: string[],
    employees?: AnnouncementEmployee[],
  ) {
    super();
    if (title) this.title = title;
    if (content) this.content = content;
    if (isFixed !== undefined) this.isFixed = isFixed;
    if (category) this.category = category;
    if (releasedAt) this.releasedAt = releasedAt;
    if (expiredAt) this.expiredAt = expiredAt;
    if (mustRead !== undefined) this.mustRead = mustRead;
    if (manager) this.manager = manager;
    if (status) this.status = status;
    if (hits !== undefined) this.hits = hits;
    if (attachments) this.attachments = attachments;
    if (employees) this.employees = employees;
  }

  /**
   * Announcement 엔티티를 DTO로 변환한다
   */
  DTO로_변환한다(): AnnouncementDto {
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
      isFixed: this.isFixed,
      category: this.category,
      releasedAt: this.releasedAt,
      expiredAt: this.expiredAt,
      mustRead: this.mustRead,
      manager: this.manager?.DTO로_변환한다(),
      status: this.status,
      hits: this.hits,
      attachments: this.attachments,
      employees: this.employees,
      get isDeleted() {
        return this.deletedAt !== null && this.deletedAt !== undefined;
      },
      get isNew() {
        return !this.id || this.version === 1;
      },
      get isReleased() {
        return this.releasedAt !== null && this.releasedAt !== undefined;
      },
      get isExpired() {
        return (
          this.expiredAt !== null &&
          this.expiredAt !== undefined &&
          this.expiredAt < new Date()
        );
      },
    };
  }

  /**
   * 조회수를 증가한다
   */
  조회수를_증가한다(): void {
    this.hits += 1;
  }

  /**
   * 직원이 읽음 처리한다
   */
  직원이_읽음_처리한다(employeeId: string): void {
    const employee = this.employees.find((emp) => emp.id === employeeId);
    if (employee) {
      employee.isRead = true;
      employee.readAt = new Date();
    }
  }

  /**
   * 직원이 응답을 제출한다
   */
  직원이_응답을_제출한다(employeeId: string, responseMessage: string): void {
    const employee = this.employees.find((emp) => emp.id === employeeId);
    if (employee) {
      employee.isSubmitted = true;
      employee.submittedAt = new Date();
      employee.responseMessage = responseMessage;
    }
  }

  /**
   * 상태를 변경한다
   */
  상태를_변경한다(status: AnnouncementStatus): void {
    this.status = status;
  }
}
