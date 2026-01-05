import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@libs/database/base/base.entity';
import { Employee } from '@domain/common/employee/employee.entity';
import type {
  ElectronicDisclosureStatus,
  Language,
  ElectronicDisclosureCategory,
  Tag,
} from '@domain/core/common/types';
import type { ElectronicDisclosureDto } from './electronic-disclosure.types';

/**
 * 전자공시 엔티티
 *
 * 전자공시 정보를 관리합니다.
 */
@Entity('electronic_disclosure')
export class ElectronicDisclosure extends BaseEntity<ElectronicDisclosureDto> {
  @Column({
    type: 'varchar',
    length: 500,
    comment: '제목',
  })
  title: string;

  @ManyToOne(() => Employee, { nullable: false })
  @JoinColumn({ name: 'manager_id' })
  manager: Employee;

  @Column({
    type: 'jsonb',
    comment: '언어',
  })
  language: Language;

  @Column({
    type: 'jsonb',
    comment: '카테고리',
  })
  category: ElectronicDisclosureCategory;

  @Column({
    type: 'boolean',
    default: false,
    comment: '공개 여부',
  })
  isPublic: boolean;

  @Column({
    type: 'enum',
    enum: ['draft', 'approved', 'under_review', 'rejected', 'opened'],
    default: 'draft',
    comment: '상태',
  })
  status: ElectronicDisclosureStatus;

  @Column({
    type: 'jsonb',
    default: [],
    comment: '태그 목록',
  })
  tags: Tag[];

  constructor(
    title?: string,
    manager?: Employee,
    language?: Language,
    category?: ElectronicDisclosureCategory,
    isPublic?: boolean,
    status?: ElectronicDisclosureStatus,
    tags?: Tag[],
  ) {
    super();
    if (title) this.title = title;
    if (manager) this.manager = manager;
    if (language) this.language = language;
    if (category) this.category = category;
    if (isPublic !== undefined) this.isPublic = isPublic;
    if (status) this.status = status;
    if (tags) this.tags = tags;
  }

  /**
   * ElectronicDisclosure 엔티티를 DTO로 변환한다
   */
  DTO로_변환한다(): ElectronicDisclosureDto {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      createdBy: this.createdBy,
      updatedBy: this.updatedBy,
      version: this.version,
      title: this.title,
      manager: this.manager?.DTO로_변환한다(),
      language: this.language,
      category: this.category,
      isPublic: this.isPublic,
      status: this.status,
      tags: this.tags,
      get isDeleted() {
        return this.deletedAt !== null && this.deletedAt !== undefined;
      },
      get isNew() {
        return !this.id || this.version === 1;
      },
    };
  }

  /**
   * 전자공시를 공개한다
   */
  공개한다(): void {
    this.isPublic = true;
  }

  /**
   * 전자공시를 비공개한다
   */
  비공개한다(): void {
    this.isPublic = false;
  }

  /**
   * 상태를 변경한다
   */
  상태를_변경한다(status: ElectronicDisclosureStatus): void {
    this.status = status;
  }
}
