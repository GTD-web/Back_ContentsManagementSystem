import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  VersionColumn,
  Index,
} from 'typeorm';
import { WikiFileSystemType } from './wiki-file-system-type.types';
import { WikiFileSystemClosure } from './wiki-file-system-closure.entity';
import { WikiPermissionLog } from './wiki-permission-log.entity';

/**
 * WikiFileSystem Entity (위키 파일 시스템)
 * 
 * 문서 및 파일 관리 (계층 구조)
 * - 자기 참조 (parentId)
 * - Closure Table (WikiFileSystemClosure)
 * 다국어 지원: 없음
 */
@Entity('wiki_file_systems')
@Index('idx_wiki_file_system_parent_id', ['parentId'])
@Index('idx_wiki_file_system_type', ['type'])
@Index('idx_wiki_file_system_is_public', ['isPublic'])
@Index('idx_wiki_file_system_depth', ['depth'])
@Index('idx_wiki_file_system_order', ['order'])
export class WikiFileSystem {
  @PrimaryGeneratedColumn('uuid', {
    comment: '위키 파일 시스템 ID',
  })
  id: string;

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
    type: 'text',
    nullable: true,
    comment: '파일 URL (AWS S3) - 파일 타입일 때만',
  })
  fileUrl: string | null;

  @Column({
    type: 'bigint',
    nullable: true,
    comment: '파일 크기 (bytes) - 파일 타입일 때만',
  })
  fileSize: number | null;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    comment: 'MIME 타입 - 파일 타입일 때만',
  })
  mimeType: string | null;

  @Column({
    type: 'boolean',
    default: true,
    comment: '공개 여부',
  })
  isPublic: boolean;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: '직급 코드 목록',
  })
  permissionRankCodes: string[] | null;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: '직책 코드 목록',
  })
  permissionPositionCodes: string[] | null;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: '부서 코드 목록',
  })
  permissionDepartmentCodes: string[] | null;

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
