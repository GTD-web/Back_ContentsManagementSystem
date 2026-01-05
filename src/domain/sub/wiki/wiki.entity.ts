import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@libs/database/base/base.entity';
import type { WikiFileSystem } from './wiki-file-system.types';
import type { WikiDto } from './wiki.types';

/**
 * 위키 엔티티
 *
 * 사내 위키 문서를 관리합니다.
 */
@Entity('wiki')
export class Wiki extends BaseEntity<WikiDto> {
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
    type: 'jsonb',
    comment: '파일 시스템 구조',
  })
  fileSystem: WikiFileSystem;

  @Column({
    type: 'boolean',
    default: true,
    comment: '공개 여부',
  })
  isPublic: boolean;

  @Column({
    type: 'varchar',
    length: 255,
    comment: '소유자 ID',
  })
  ownerId: string;

  @Column({
    type: 'text',
    array: true,
    default: [],
    comment: '태그 목록',
  })
  tags: string[];

  constructor(
    title?: string,
    content?: string,
    fileSystem?: WikiFileSystem,
    isPublic?: boolean,
    ownerId?: string,
    tags?: string[],
  ) {
    super();
    if (title) this.title = title;
    if (content) this.content = content;
    if (fileSystem) this.fileSystem = fileSystem;
    if (isPublic !== undefined) this.isPublic = isPublic;
    if (ownerId) this.ownerId = ownerId;
    if (tags) this.tags = tags;
  }

  /**
   * Wiki 엔티티를 DTO로 변환한다
   */
  DTO로_변환한다(): WikiDto {
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
      fileSystem: this.fileSystem,
      isPublic: this.isPublic,
      ownerId: this.ownerId,
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
   * 위키를 공개한다
   */
  공개한다(): void {
    this.isPublic = true;
  }

  /**
   * 위키를 비공개한다
   */
  비공개한다(): void {
    this.isPublic = false;
  }

  /**
   * 태그를 추가한다
   */
  태그를_추가한다(tag: string): void {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
    }
  }

  /**
   * 태그를 제거한다
   */
  태그를_제거한다(tag: string): void {
    this.tags = this.tags.filter((t) => t !== tag);
  }
}
