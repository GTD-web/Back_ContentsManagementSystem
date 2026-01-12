import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '@libs/database/base/base.entity';
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
export class VoteResultTranslation extends BaseEntity<VoteResultTranslation> {
  @Column({
    type: 'uuid',
    comment: '의결 결과 ID',
  })
  voteResultId: string;

  @ManyToOne(() => VoteResult, (voteResult) => voteResult.translations, {
    onDelete: 'CASCADE',
  })
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

  @Column({
    type: 'boolean',
    default: false,
    comment: '자동 동기화 여부 (true: 자동 번역, false: 개별 설정)',
  })
  isSynced: boolean;

  /**
   * 엔티티를 DTO로 변환한다
   */
  DTO로_변환한다(): VoteResultTranslation {
    return this;
  }
}
