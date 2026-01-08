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
import { ShareholdersMeeting } from './shareholders-meeting.entity';
import { Language } from '../../common/language/language.entity';

/**
 * ShareholdersMeetingTranslation Entity (주주총회 번역)
 * 
 * 주주총회의 언어별 콘텐츠
 */
@Entity('shareholders_meeting_translations')
@Index('uk_shareholders_meeting_translation', ['shareholdersMeetingId', 'languageId'], {
  unique: true,
})
export class ShareholdersMeetingTranslation {
  @PrimaryGeneratedColumn('uuid', {
    comment: '주주총회 번역 ID',
  })
  id: string;

  @Column({
    type: 'uuid',
    comment: '주주총회 ID',
  })
  shareholdersMeetingId: string;

  @ManyToOne(
    () => ShareholdersMeeting,
    (meeting) => meeting.translations,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'shareholdersMeetingId' })
  shareholdersMeeting: ShareholdersMeeting;

  @Column({
    type: 'uuid',
    comment: '언어 ID',
  })
  languageId: string;

  @ManyToOne(() => Language)
  @JoinColumn({ name: 'languageId' })
  language: Language;

  @Column({
    type: 'varchar',
    length: 500,
    comment: '제목',
  })
  title: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: '간단한 설명',
  })
  description: string | null;

  @Column({
    type: 'text',
    nullable: true,
    comment: '상세 내용',
  })
  content: string | null;

  @Column({
    type: 'text',
    nullable: true,
    comment: '의결 결과 텍스트',
  })
  resultText: string | null;

  @Column({
    type: 'text',
    nullable: true,
    comment: '요약',
  })
  summary: string | null;

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
