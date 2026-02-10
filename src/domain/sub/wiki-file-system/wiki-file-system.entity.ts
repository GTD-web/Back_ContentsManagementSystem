import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index, AfterLoad } from 'typeorm';
import { BaseEntity } from '@libs/database/base/base.entity';
import { WikiFileSystemType } from './wiki-file-system-type.types';
import { WikiFileSystemClosure } from './wiki-file-system-closure.entity';
import { WikiPermissionLog } from './wiki-permission-log.entity';

/**
 * WikiFileSystem Entity (위키 파일 시스템)
 * 
 * 문서 및 파일 관리 (계층 구조)
 * - 자기 참조 (parentId)
 * - Closure Table (WikiFileSystemClosure)
 * - 파일 타입:
 *   - 문서형: title + content + attachments
 *   - 첨부파일형: fileUrl + fileSize + mimeType
 * - 권한 정책:
 *   - 폴더: isPublic, permissionRankIds, permissionPositionIds, permissionDepartmentIds 설정 가능
 *   - 파일: isPublic만 설정 가능
 *     - isPublic: false → 완전 비공개 (아무도 접근 불가)
 *     - isPublic: true (기본값) → 상위 폴더 권한 cascading
 *   - 파일의 permissionRankIds/PositionIds/DepartmentIds는 항상 NULL
 * 다국어 지원: 없음
 */
@Entity('wiki_file_systems')
@Index('idx_wiki_file_system_parent_id', ['parentId'])
@Index('idx_wiki_file_system_type', ['type'])
@Index('idx_wiki_file_system_is_public', ['isPublic'])
@Index('idx_wiki_file_system_depth', ['depth'])
@Index('idx_wiki_file_system_order', ['order'])
export class WikiFileSystem extends BaseEntity<WikiFileSystem> {
  @Column({
    type: 'varchar',
    length: 500,
    comment: '이름 (폴더명 또는 파일명)',
  })
  name: string;

  @Column({
    type: 'enum',
    enum: WikiFileSystemType,
    comment: '타입 (folder|file)',
  })
  type: WikiFileSystemType;

  @Column({
    type: 'uuid',
    nullable: true,
    comment: '부모 ID (self-reference)',
  })
  parentId: string | null;

  @ManyToOne(() => WikiFileSystem, (wiki) => wiki.children, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parentId' })
  parent: WikiFileSystem | null;

  @OneToMany(() => WikiFileSystem, (wiki) => wiki.parent)
  children: WikiFileSystem[];

  @Column({
    type: 'int',
    default: 0,
    comment: '계층 깊이 (0=루트)',
  })
  depth: number;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: '문서 제목 (file 타입일 때만 사용)',
  })
  title: string | null;

  @Column({
    type: 'text',
    nullable: true,
    comment: '문서 본문 (file 타입일 때만 사용)',
  })
  content: string | null;

  @Column({
    type: 'text',
    nullable: true,
    comment: '단일 파일 URL (AWS S3) - file 타입일 때만 사용',
  })
  fileUrl: string | null;

  @Column({
    type: 'bigint',
    nullable: true,
    comment: '파일 크기 (bytes) - fileUrl이 있을 때만',
  })
  fileSize: number | null;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    comment: 'MIME 타입 - fileUrl이 있을 때만',
  })
  mimeType: string | null;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: '첨부파일 목록 (AWS S3 URLs) - file 타입일 때만 사용',
  })
  attachments: Array<{
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    deletedAt?: Date | null;
  }> | null;

  @Column({
    type: 'boolean',
    default: true,
    comment: '공개 여부 (folder: 권한 설정, file: false면 비공개, true면 상위 폴더 cascading)',
  })
  isPublic: boolean;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: '직급 ID 목록 (UUID, folder만 사용 - 파일은 항상 NULL)',
  })
  permissionRankIds: string[] | null;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: '직책 ID 목록 (UUID, folder만 사용 - 파일은 항상 NULL)',
  })
  permissionPositionIds: string[] | null;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: '부서 ID 목록 (UUID, folder만 사용 - 파일은 항상 NULL)',
  })
  permissionDepartmentIds: string[] | null;

  @Column({
    type: 'int',
    default: 0,
    comment: '정렬 순서',
  })
  order: number;

  @OneToMany(() => WikiFileSystemClosure, (closure) => closure.ancestor)
  ancestorClosures: WikiFileSystemClosure[];

  @OneToMany(() => WikiFileSystemClosure, (closure) => closure.descendant)
  descendantClosures: WikiFileSystemClosure[];

  @OneToMany(() => WikiPermissionLog, (log) => log.wikiFileSystem)
  permissionLogs: WikiPermissionLog[];

  /**
   * DB에서 로드 후 jsonb 배열 필드를 정규화한다
   * 
   * jsonb 컬럼에 배열이 아닌 값(문자열 등)이 저장된 경우
   * 배열로 변환하여 .forEach(), .join() 등의 배열 메서드 호출 시 에러를 방지한다
   */
  @AfterLoad()
  normalizeJsonbArrayFields() {
    this.permissionRankIds = this.ensureStringArray(this.permissionRankIds);
    this.permissionPositionIds = this.ensureStringArray(this.permissionPositionIds);
    this.permissionDepartmentIds = this.ensureStringArray(this.permissionDepartmentIds);
  }

  /**
   * 값을 string[] | null 로 정규화한다
   */
  private ensureStringArray(value: any): string[] | null {
    if (value === null || value === undefined) return null;
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed;
        return [String(parsed)];
      } catch {
        return [value];
      }
    }
    return null;
  }

  /**
   * 엔티티를 DTO로 변환한다
   */
  DTO로_변환한다(): WikiFileSystem {
    return this;
  }
}
