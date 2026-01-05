import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@libs/database/base/base.entity';
import { Employee } from '@domain/common/employee/employee.entity';
import type { SurveyStatus, SurveyCategory } from '@domain/core/common/types';
import { ContentStatus } from '@domain/core/common/types';
import type { Inquery } from './inquery.types';
import type { SurveyDto } from './survey.types';

/**
 * 설문조사 엔티티
 *
 * 직원 대상 설문조사를 관리합니다.
 */
@Entity('survey')
export class Survey extends BaseEntity<SurveyDto> {
  @Column({
    type: 'varchar',
    length: 500,
    comment: '제목',
  })
  title: string;

  @Column({
    type: 'jsonb',
    comment: '카테고리',
  })
  category: SurveyCategory;

  @ManyToOne(() => Employee, { nullable: false })
  @JoinColumn({ name: 'manager_id' })
  manager: Employee;

  @Column({
    type: 'text',
    comment: '설명',
  })
  description: string;

  @Column({
    type: 'jsonb',
    default: [],
    comment: '질문 목록',
  })
  inqueries: Inquery[];

  @Column({
    type: 'enum',
    enum: ['draft', 'approved', 'under_review', 'rejected', 'opened'],
    default: 'draft',
    comment: '상태',
  })
  status: SurveyStatus;

  constructor(
    title?: string,
    category?: SurveyCategory,
    manager?: Employee,
    description?: string,
    inqueries?: Inquery[],
    status?: SurveyStatus,
  ) {
    super();
    if (title) this.title = title;
    if (category) this.category = category;
    if (manager) this.manager = manager;
    if (description) this.description = description;
    if (inqueries) this.inqueries = inqueries;
    if (status) this.status = status;
  }

  /**
   * Survey 엔티티를 DTO로 변환한다
   */
  DTO로_변환한다(): SurveyDto {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      createdBy: this.createdBy,
      updatedBy: this.updatedBy,
      version: this.version,
      title: this.title,
      category: this.category,
      manager: this.manager?.DTO로_변환한다(),
      description: this.description,
      inqueries: this.inqueries,
      status: this.status,
      get isDeleted() {
        return this.deletedAt !== null && this.deletedAt !== undefined;
      },
      get isNew() {
        return !this.id || this.version === 1;
      },
    };
  }

  /**
   * 질문을 추가한다
   */
  질문을_추가한다(inquery: Inquery): void {
    this.inqueries.push(inquery);
  }

  /**
   * 질문을 제거한다
   */
  질문을_제거한다(inqueryId: string): void {
    this.inqueries = this.inqueries.filter((inq) => inq.id !== inqueryId);
  }

  /**
   * 설문조사를 공개한다
   */
  공개한다(): void {
    this.status = ContentStatus.OPENED;
  }

  /**
   * 설문조사를 비공개한다 (초안으로 변경)
   */
  비공개한다(): void {
    this.status = ContentStatus.DRAFT;
  }

  /**
   * 상태를 변경한다
   */
  상태를_변경한다(status: SurveyStatus): void {
    this.status = status;
  }
}
