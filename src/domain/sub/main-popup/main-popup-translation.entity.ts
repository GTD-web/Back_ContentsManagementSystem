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
import { MainPopup } from './main-popup.entity';
import { Language } from '../../common/language/language.entity';

/**
 * MainPopupTranslation Entity (메인 팝업 번역)
 * 
 * 메인 팝업의 언어별 콘텐츠
 */
@Entity('main_popup_translations')
@Index('uk_main_popup_translation', ['mainPopupId', 'languageId'], {
  unique: true,
})
export class MainPopupTranslation {
  @PrimaryGeneratedColumn('uuid', {
    comment: '메인 팝업 번역 ID',
  })
  id: string;

  @Column({
    type: 'uuid',
    comment: '메인 팝업 ID',
  })
  mainPopupId: string;

  @ManyToOne(() => MainPopup, (popup) => popup.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'mainPopupId' })
  mainPopup: MainPopup;

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
    comment: '설명',
  })
  description: string | null;

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
