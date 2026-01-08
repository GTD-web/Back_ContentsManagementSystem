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
import { VoteResult } from './vote-result.entity';
import { Language } from '../../common/language/language.entity';

/**
 * VoteResultTranslation Entity (의결 결과 번역)
 * 
 * 의결 결과 안건의 언어별 콘텐츠
 */
@Entity('vote_result_translations')
@Index('uk_vote_result_translation', ['voteResultId', 'languageId'], {
  unique: true,
})
export class VoteResultTranslation {
  @PrimaryGeneratedColumn('uuid', {
    comment: '의결 결과 번역 ID',
  })
  id: string;

  @Column({
    type: 'uuid',
    comment: '의결 결과 ID',
  })
  voteResultId: string;

  @ManyToOne(
    () => VoteResult,
    (voteResult) => voteResult.translations,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'voteResultId' })
  voteResult: VoteResult;

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
    comment: '안건 제목',
  })
  title: string;

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
