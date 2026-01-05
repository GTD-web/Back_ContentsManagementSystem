import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@libs/database/base/base.entity';
import { Employee } from '@domain/common/employee/employee.entity';
import type {
  AnnouncementStatus,
  Language,
  AnnouncementCategory,
  Tag,
} from '@domain/core/common/types';
import type { AnnouncementPopupDto } from './announcement-popup.types';

/**
 * 공지사항 팝업 엔티티
 *
 * 팝업 형태로 표시되는 공지사항을 관리합니다.
 */
@Entity('announcement_popup')
export class AnnouncementPopup extends BaseEntity<AnnouncementPopupDto> {
  @Column({
    type: 'enum',
    enum: [
      'draft',
      'approved',
      'under_review',
      'rejected',
      'opened',
    ],
    default: 'draft',
    comment: '공지사항 상태',
  })
  status: AnnouncementStatus;

  @Column({
    type: 'varchar',
    length: 500,
    comment: '제목',
  })
  title: string;

  @Column({
    type: 'boolean',
    default: false,
    comment: '공개 여부',
  })
  isPublic: boolean;

  @Column({
    type: 'jsonb',
    comment: '카테고리',
  })
  category: AnnouncementCategory;

  @Column({
    type: 'jsonb',
    comment: '언어',
  })
  language: Language;

  @Column({
    type: 'jsonb',
    default: [],
    comment: '태그 목록',
  })
  tags: Tag[];

  @ManyToOne(() => Employee, { nullable: false })
  @JoinColumn({ name: 'manager_id' })
  manager: Employee;

  @Column({
    type: 'text',
    array: true,
    default: [],
    comment: '첨부파일 URL 목록 (AWS S3)',
  })
  attachments: string[];

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: '공개 일시',
  })
  releasedAt?: Date;

  constructor(
    title?: string,
    status?: AnnouncementStatus,
    isPublic?: boolean,
    category?: AnnouncementCategory,
    language?: Language,
    manager?: Employee,
    tags?: Tag[],
    attachments?: string[],
    releasedAt?: Date,
  ) {
    super();
    if (title) this.title = title;
    if (status) this.status = status;
    if (isPublic !== undefined) this.isPublic = isPublic;
    if (category) this.category = category;
    if (language) this.language = language;
    if (manager) this.manager = manager;
    if (tags) this.tags = tags;
    if (attachments) this.attachments = attachments;
    if (releasedAt) this.releasedAt = releasedAt;
  }

  /**
   * AnnouncementPopup 엔티티를 DTO로 변환한다
   */
  DTO로_변환한다(): AnnouncementPopupDto {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      createdBy: this.createdBy,
      updatedBy: this.updatedBy,
      version: this.version,
      status: this.status,
      title: this.title,
      isPublic: this.isPublic,
      category: this.category,
      language: this.language,
      tags: this.tags,
      manager: this.manager?.DTO로_변환한다(),
      attachments: this.attachments,
      releasedAt: this.releasedAt,
      get isDeleted() {
        return this.deletedAt !== null && this.deletedAt !== undefined;
      },
      get isNew() {
        return !this.id || this.version === 1;
      },
      get isReleased() {
        return this.releasedAt !== null && this.releasedAt !== undefined;
      },
    };
  }

  /**
   * 공지사항 팝업을 공개한다
   */
  공개한다(): void {
    this.isPublic = true;
    this.releasedAt = new Date();
  }

  /**
   * 공지사항 팝업을 비공개한다
   */
  비공개한다(): void {
    this.isPublic = false;
  }

  /**
   * 상태를 변경한다
   */
  상태를_변경한다(status: AnnouncementStatus): void {
    this.status = status;
  }
}
