import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  VersionColumn,
  Index,
} from 'typeorm';
import { ContentStatus } from '../content-status.types';
import { IRTranslation } from './ir-translation.entity';

/**
 * IR Entity (투자자 정보)
 * 
 * IR 자료 및 투자자 정보 관리
 * 다국어 지원: IRTranslation
 */
@Entity('irs')
@Index('idx_ir_status', ['status'])
@Index('idx_ir_is_public', ['isPublic'])
@Index('idx_ir_order', ['order'])
export class IR {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'IR ID',
  })
  id: string;

  @Column({
    type: 'boolean',
    default: true,
    comment: '공개 여부',
  })
  isPublic: boolean;

  @Column({
    type: 'enum',
    enum: ContentStatus,
    default: ContentStatus.DRAFT,
    comment: '상태 (draft|approved|under_review|rejected|opened)',
  })
  status: ContentStatus;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: '첨부파일 목록 (AWS S3 URLs)',
  })
  attachments: Array<{
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
  }> | null;

  @Column({
    type: 'int',
    default: 0,
    comment: '정렬 순서',
  })
  order: number;

  @OneToMany(() => IRTranslation, (translation) => translation.ir, {
    cascade: true,
  })
  translations: IRTranslation[];

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
