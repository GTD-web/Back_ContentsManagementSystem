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
import { ElectronicDisclosureTranslation } from './electronic-disclosure-translation.entity';

/**
 * ElectronicDisclosure Entity (전자공시)
 * 
 * 법적 전자공시 문서 관리
 * 다국어 지원: ElectronicDisclosureTranslation
 */
@Entity('electronic_disclosures')
@Index('idx_electronic_disclosure_status', ['status'])
@Index('idx_electronic_disclosure_is_public', ['isPublic'])
@Index('idx_electronic_disclosure_order', ['order'])
export class ElectronicDisclosure {
  @PrimaryGeneratedColumn('uuid', {
    comment: '전자공시 ID',
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
    type: 'int',
    default: 0,
    comment: '정렬 순서',
  })
  order: number;

  @OneToMany(
    () => ElectronicDisclosureTranslation,
    (translation) => translation.electronicDisclosure,
    { cascade: true },
  )
  translations: ElectronicDisclosureTranslation[];

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
