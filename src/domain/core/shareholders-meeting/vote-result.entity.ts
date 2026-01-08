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
import { VoteResultType } from './vote-result-type.types';
import { ShareholdersMeeting } from './shareholders-meeting.entity';
import { VoteResultTranslation } from './vote-result-translation.entity';

/**
 * VoteResult Entity (의결 결과)
 * 
 * 주주총회 안건별 의결 결과
 * 다국어 지원: VoteResultTranslation
 */
@Entity('vote_results')
@Index('idx_vote_result_shareholders_meeting_id', ['shareholdersMeetingId'])
@Index('idx_vote_result_agenda_number', ['agendaNumber'])
export class VoteResult {
  @PrimaryGeneratedColumn('uuid', {
    comment: '의결 결과 ID',
  })
  id: string;

  @Column({
    type: 'uuid',
    comment: '주주총회 ID',
  })
  shareholdersMeetingId: string;

  @ManyToOne(
    () => ShareholdersMeeting,
    (meeting) => meeting.voteResults,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'shareholdersMeetingId' })
  shareholdersMeeting: ShareholdersMeeting;

  @Column({
    type: 'int',
    comment: '안건 번호 (정렬 순서로도 사용)',
  })
  agendaNumber: number;

  @Column({
    type: 'int',
    comment: '전체 투표 수',
  })
  totalVote: number;

  @Column({
    type: 'int',
    comment: '찬성 투표 수',
  })
  yesVote: number;

  @Column({
    type: 'int',
    comment: '반대 투표 수',
  })
  noVote: number;

  @Column({
    type: 'float',
    comment: '찬성률 (%)',
  })
  approvalRating: number;

  @Column({
    type: 'enum',
    enum: VoteResultType,
    comment: '의결 결과 (accepted|rejected)',
  })
  result: VoteResultType;

  @OneToMany(
    () => VoteResultTranslation,
    (translation) => translation.voteResult,
    { cascade: true },
  )
  translations: VoteResultTranslation[];

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
