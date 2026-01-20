import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { DismissedPermissionLogType } from './dismissed-permission-log.types';

/**
 * DismissedPermissionLog Entity
 * 
 * 권한 로그 "다시 보지 않기" 기능을 위한 엔티티
 * - 관리자가 특정 권한 로그에 대한 모달을 더 이상 보지 않도록 설정
 * - 권한 로그 관리 페이지에서는 여전히 조회 가능
 * 
 * ⚠️ Soft Delete 없음: 로그는 영구 보관
 */
@Entity('dismissed_permission_logs')
@Index('idx_dismissed_permission_log_type_id', ['logType', 'permissionLogId'])
@Index('idx_dismissed_permission_log_dismissed_by', ['dismissedBy'])
export class DismissedPermissionLog {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'Dismissed 로그 ID',
  })
  id: string;

  @Column({
    type: 'enum',
    enum: DismissedPermissionLogType,
    comment: '로그 타입 (announcement | wiki)',
  })
  logType: DismissedPermissionLogType;

  @Column({
    type: 'uuid',
    comment: 'AnnouncementPermissionLog.id 또는 WikiPermissionLog.id',
  })
  permissionLogId: string;

  @Column({
    type: 'uuid',
    comment: '무시한 관리자 ID (외부 시스템 직원 ID - SSO)',
  })
  dismissedBy: string;

  @CreateDateColumn({
    type: 'timestamp',
    comment: '무시한 일시',
  })
  dismissedAt: Date;

  // ⚠️ updatedAt, deletedAt, version 없음 (로그는 수정/삭제 불가, 영구 보관)
}
