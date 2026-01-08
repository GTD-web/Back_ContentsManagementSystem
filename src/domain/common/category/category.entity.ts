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
import { CategoryEntityType } from './category-entity-type.types';

/**
 * Category Entity (카테고리)
 * 
 * 모든 도메인에서 공유하는 통합 카테고리 관리
 * entityType 필드로 도메인 구분
 */
@Entity('categories')
@Index('idx_category_entity_type', ['entityType'])
@Index('idx_category_is_active', ['isActive'])
@Index('idx_category_order', ['order'])
export class Category {
  @PrimaryGeneratedColumn('uuid', {
    comment: '카테고리 ID',
  })
  id: string;

  @Column({
    type: 'enum',
    enum: CategoryEntityType,
    comment: '엔티티 타입 (announcement|main_popup|shareholders_meeting|...)',
  })
  entityType: CategoryEntityType;

  @Column({
    type: 'varchar',
    length: 200,
    comment: '카테고리 이름',
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: '카테고리 설명',
  })
  description: string | null;

  @Column({
    type: 'boolean',
    default: true,
    comment: '활성화 여부',
  })
  isActive: boolean;

  @Column({
    type: 'int',
    default: 0,
    comment: '정렬 순서',
  })
  order: number;

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
