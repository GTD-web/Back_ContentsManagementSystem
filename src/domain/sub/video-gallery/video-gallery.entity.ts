import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@libs/database/base/base.entity';
import { Employee } from '@domain/common/employee/employee.entity';
import type {
  VideoGalleryStatus,
  VideoGalleryCategory,
  Tag,
} from '@domain/core/common/types';
import type { VideoGalleryDto } from './video-gallery.types';

/**
 * 비디오 갤러리 엔티티
 *
 * 회사의 비디오 콘텐츠를 관리합니다.
 */
@Entity('video_gallery')
export class VideoGallery extends BaseEntity<VideoGalleryDto> {
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
    comment: '카테고리',
  })
  category: VideoGalleryCategory;

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
  status: VideoGalleryStatus;

  @Column({
    type: 'jsonb',
    default: [],
    comment: '태그 목록',
  })
  tags: Tag[];

  constructor(
    title?: string,
    manager?: Employee,
    category?: VideoGalleryCategory,
    isPublic?: boolean,
    status?: VideoGalleryStatus,
    tags?: Tag[],
  ) {
    super();
    if (title) this.title = title;
    if (manager) this.manager = manager;
    if (category) this.category = category;
    if (isPublic !== undefined) this.isPublic = isPublic;
    if (status) this.status = status;
    if (tags) this.tags = tags;
  }

  /**
   * VideoGallery 엔티티를 DTO로 변환한다
   */
  DTO로_변환한다(): VideoGalleryDto {
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
   * 비디오를 공개한다
   */
  공개한다(): void {
    this.isPublic = true;
  }

  /**
   * 비디오를 비공개한다
   */
  비공개한다(): void {
    this.isPublic = false;
  }

  /**
   * 상태를 변경한다
   */
  상태를_변경한다(status: VideoGalleryStatus): void {
    this.status = status;
  }
}
