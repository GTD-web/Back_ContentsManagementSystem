import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  VersionColumn,
  Index,
} from 'typeorm';
import { Announcement } from '../../core/announcement/announcement.entity';
import { SurveyQuestion } from './survey-question.entity';
import { SurveyCompletion } from './survey-completion.entity';

/**
 * Survey Entity (설문조사)
 * 
 * 공지사항 연동 설문조사
 * - Announcement에 종속 (announcementId FK, 유니크)
 * - 상태/권한은 Announcement를 따름
 * 다국어 지원: 없음
 */
@Entity('surveys')
@Index('uk_survey_announcement_id', ['announcementId'], { unique: true })
@Index('idx_survey_start_date', ['startDate'])
@Index('idx_survey_end_date', ['endDate'])
@Index('idx_survey_order', ['order'])
export class Survey {
  @PrimaryGeneratedColumn('uuid', {
    comment: '설문조사 ID',
  })
  id: string;

  @Column({
    type: 'uuid',
    unique: true,
    comment: '공지사항 ID (FK, 유니크 - 공지사항당 설문 1개)',
  })
  announcementId: string;

  @OneToOne(() => Announcement, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'announcementId' })
  announcement: Announcement;

  @Column({
    type: 'varchar',
    length: 500,
    comment: '설문조사 제목',
  })
  title: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: '설문조사 설명',
  })
  description: string | null;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: '설문 시작 일시',
  })
  startDate: Date | null;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: '설문 마감 일시',
  })
  endDate: Date | null;

  @Column({
    type: 'int',
    default: 0,
    comment: '정렬 순서',
  })
  order: number;

  @OneToMany(() => SurveyQuestion, (question) => question.survey, {
    cascade: true,
  })
  questions: SurveyQuestion[];

  @OneToMany(() => SurveyCompletion, (completion) => completion.survey)
  completions: SurveyCompletion[];

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
