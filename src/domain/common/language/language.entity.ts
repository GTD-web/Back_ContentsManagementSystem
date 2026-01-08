import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  VersionColumn,
  Index,
} from 'typeorm';
import { LanguageCode } from './language-code.types';

/**
 * Language Entity (언어)
 * 
 * 다국어 지원을 위한 언어 정보 관리
 */
@Entity('languages')
@Index('idx_language_code', ['code'])
@Index('idx_language_is_active', ['isActive'])
export class Language {
  @PrimaryGeneratedColumn('uuid', {
    comment: '언어 ID',
  })
  id: string;

  @Column({
    type: 'varchar',
    length: 10,
    unique: true,
    comment: '언어 코드 (ko|en|ja|zh)',
  })
  code: LanguageCode;

  @Column({
    type: 'varchar',
    length: 100,
    comment: '언어 이름 (예: 한국어, English)',
  })
  name: string;

  @Column({
    type: 'boolean',
    default: true,
    comment: '활성화 여부',
  })
  isActive: boolean;

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
