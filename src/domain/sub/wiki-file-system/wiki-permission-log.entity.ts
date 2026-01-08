import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { WikiPermissionAction } from './wiki-permission-action.types';
import { WikiFileSystem } from './wiki-file-system.entity';

/**
 * WikiPermissionLog Entity (위키 권한 로그)
 * 
 * WikiFileSystem 권한 무효화 추적
 * - 외부 시스템(SSO)의 부서/직급/직책 코드 제거/변경 시 이력 기록
 * - 감사 로그 및 문제 해결 히스토리
 * 
 * ⚠️ Soft Delete 없음: 로그는 영구 보관
 */
@Entity('wiki_permission_logs')
@Index('idx_wiki_permission_log_wiki_id', ['wikiFileSystemId'])
@Index('idx_wiki_permission_log_action', ['action'])
@Index('idx_wiki_permission_log_detected_at', ['detectedAt'])
@Index('idx_wiki_permission_log_resolved_at', ['resolvedAt'])
export class WikiPermissionLog {
  @PrimaryGeneratedColumn('uuid', {
    comment: '위키 권한 로그 ID',
  })
  id: string;

  @Column({
    type: 'uuid',
    comment: '위키 파일 시스템 ID',
  })
  wikiFileSystemId: string;

  @ManyToOne(() => WikiFileSystem, (wiki) => wiki.permissionLogs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'wikiFileSystemId' })
  wikiFileSystem: WikiFileSystem;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: '무효화된 부서 코드 목록',
  })
  invalidDepartmentCodes: string[] | null;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: '무효화된 직급 코드 목록',
  })
  invalidRankCodes: string[] | null;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: '무효화된 직책 코드 목록',
  })
  invalidPositionCodes: string[] | null;

  @Column({
    type: 'jsonb',
    comment: '권한 설정 스냅샷 (변경 전)',
  })
  snapshotPermissions: {
    permissionRankCodes: string[] | null;
    permissionPositionCodes: string[] | null;
    permissionDepartmentCodes: string[] | null;
  };

  @Column({
    type: 'enum',
    enum: WikiPermissionAction,
    comment: '처리 상태 (detected|removed|notified|resolved)',
  })
  action: WikiPermissionAction;

  @Column({
    type: 'text',
    nullable: true,
    comment: '추가 메모',
  })
  note: string | null;

  @Column({
    type: 'timestamp',
    comment: '감지 일시',
  })
  detectedAt: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: '해결 일시',
  })
  resolvedAt: Date | null;

  @Column({
    type: 'uuid',
    nullable: true,
    comment: '해결한 관리자 ID (외부 시스템 직원 ID - SSO)',
  })
  resolvedBy: string | null;

  @CreateDateColumn({
    type: 'timestamp',
    comment: '생성 일시',
  })
  createdAt: Date;

  // ⚠️ updatedAt, deletedAt, version 없음 (로그는 수정/삭제 불가, 영구 보관)
}
