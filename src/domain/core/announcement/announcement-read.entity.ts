import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  VersionColumn,
  Index,
} from 'typeorm';
import { Announcement } from './announcement.entity';

/**
 * AnnouncementRead Entity (공지사항 읽음 표시)
 * 
 * Lazy Creation 패턴: 직원이 읽을 때만 레코드 생성
 * 직원별 공지사항 읽음 여부 추적
 */
@Entity('announcement_reads')
@Index('uk_announcement_read', ['announcementId', 'employeeId'], {
  unique: true,
})
@Index('idx_announcement_read_employee_id', ['employeeId'])
export class AnnouncementRead {
  @PrimaryGeneratedColumn('uuid', {
    comment: '공지사항 읽음 ID',
  })
  id: string;

  @Column({
    type: 'uuid',
    comment: '공지사항 ID',
  })
  announcementId: string;

  @ManyToOne(() => Announcement, (announcement) => announcement.reads, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'announcementId' })
  announcement: Announcement;

  @Column({
    type: 'uuid',
    comment: '직원 ID (외부 시스템 직원 ID - SSO)',
  })
  employeeId: string;

  @Column({
    type: 'timestamp',
    comment: '읽은 일시',
  })
  readAt: Date;

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
