import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@libs/database/base/base.entity';
import { Employee } from '@domain/common/employee/employee.entity';
import type {
  Language,
  ShareholdersMeetingCategory,
  Tag,
} from '@domain/core/common/types';
import type { ResultOfVote } from './vote-result.types';
import type { ShareholdersMeetingDto } from './shareholders-meeting.types';

/**
 * 주주총회 엔티티
 *
 * 주주총회 정보와 의결 결과를 관리합니다.
 */
@Entity('shareholders_meeting')
export class ShareholdersMeeting extends BaseEntity<ShareholdersMeetingDto> {
  @Column({
    type: 'jsonb',
    comment: '의결 결과',
  })
  resultOfVote: ResultOfVote;

  @Column({
    type: 'varchar',
    length: 500,
    comment: '제목',
  })
  title: string;

  @Column({
    type: 'text',
    comment: '결과 텍스트',
  })
  resultText: string;

  @Column({
    type: 'text',
    comment: '요약',
  })
  summary: string;

  @Column({
    type: 'jsonb',
    comment: '언어',
  })
  language: Language;

  @Column({
    type: 'jsonb',
    comment: '카테고리',
  })
  category: ShareholdersMeetingCategory;

  @Column({
    type: 'boolean',
    default: false,
    comment: '공개 여부',
  })
  isPublic: boolean;

  @Column({
    type: 'varchar',
    length: 500,
    comment: '장소',
  })
  location: string;

  @Column({
    type: 'timestamp',
    comment: '회의 일시',
  })
  meetingDate: Date;

  @ManyToOne(() => Employee, { nullable: false })
  @JoinColumn({ name: 'manager_id' })
  manager: Employee;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: '공개 일시',
  })
  releasedAt?: Date;

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
    comment: '태그 목록',
  })
  tags: Tag[];

  constructor(
    title?: string,
    resultOfVote?: ResultOfVote,
    resultText?: string,
    summary?: string,
    language?: Language,
    category?: ShareholdersMeetingCategory,
    isPublic?: boolean,
    location?: string,
    meetingDate?: Date,
    manager?: Employee,
    releasedAt?: Date,
    attachments?: string[],
    tags?: Tag[],
  ) {
    super();
    if (title) this.title = title;
    if (resultOfVote) this.resultOfVote = resultOfVote;
    if (resultText) this.resultText = resultText;
    if (summary) this.summary = summary;
    if (language) this.language = language;
    if (category) this.category = category;
    if (isPublic !== undefined) this.isPublic = isPublic;
    if (location) this.location = location;
    if (meetingDate) this.meetingDate = meetingDate;
    if (manager) this.manager = manager;
    if (releasedAt) this.releasedAt = releasedAt;
    if (attachments) this.attachments = attachments;
    if (tags) this.tags = tags;
  }

  /**
   * ShareholdersMeeting 엔티티를 DTO로 변환한다
   */
  DTO로_변환한다(): ShareholdersMeetingDto {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      createdBy: this.createdBy,
      updatedBy: this.updatedBy,
      version: this.version,
      resultOfVote: this.resultOfVote,
      title: this.title,
      resultText: this.resultText,
      summary: this.summary,
      language: this.language,
      category: this.category,
      isPublic: this.isPublic,
      location: this.location,
      meetingDate: this.meetingDate,
      manager: this.manager?.DTO로_변환한다(),
      releasedAt: this.releasedAt,
      attachments: this.attachments,
      tags: this.tags,
      get isDeleted() {
        return this.deletedAt !== null && this.deletedAt !== undefined;
      },
      get isNew() {
        return !this.id || this.version === 1;
      },
      get isReleased() {
        return this.releasedAt !== null && this.releasedAt !== undefined;
      },
      get isMeetingPassed() {
        return this.meetingDate < new Date();
      },
    };
  }

  /**
   * 주주총회를 공개한다
   */
  공개한다(): void {
    this.isPublic = true;
    this.releasedAt = new Date();
  }

  /**
   * 주주총회를 비공개한다
   */
  비공개한다(): void {
    this.isPublic = false;
  }
}
